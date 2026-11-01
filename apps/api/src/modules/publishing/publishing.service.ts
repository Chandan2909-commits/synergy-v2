import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SocialAdapterFactory } from '../social/adapters/adapter.factory';
import { SchedulePostDto, ReschedulePostDto } from './publishing.dto';
import { decrypt } from '../../common/utils/encryption.util';
import { SocialPlatform } from '@synergy/types';

@Injectable()
export class PublishingService {
  private readonly logger = new Logger(PublishingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly adapterFactory: SocialAdapterFactory
  ) {}

  /**
   * Schedule a content draft for future publication
   */
  async schedulePost(businessId: string, dto: SchedulePostDto) {
    const content = await this.prisma.content.findUnique({
      where: { id: dto.contentId },
      include: { variants: true, carouselSlides: true, mediaAssets: true },
    });

    if (!content) {
      throw new NotFoundException(`Content ${dto.contentId} not found`);
    }

    if (content.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to content outside business`);
    }

    const account = await this.prisma.socialAccount.findUnique({
      where: { id: dto.socialAccountId },
      include: { credential: true },
    });

    if (!account) {
      throw new NotFoundException(`Social account ${dto.socialAccountId} not found`);
    }

    if (account.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to account outside business`);
    }

    if (!account.isConnected || !account.credential) {
      throw new BadRequestException(
        `Selected account ${account.accountName} is not connected or missing credentials`
      );
    }

    const scheduledDate = new Date(dto.scheduledTime);
    if (isNaN(scheduledDate.getTime())) {
      throw new BadRequestException(`Invalid scheduledTime format`);
    }

    // Deterministic idempotency key to prevent double scheduling
    const idempotencyKey = `idemp_${content.id}_${account.id}_${scheduledDate.getTime()}`;

    const existingJob = await this.prisma.scheduledPost.findUnique({
      where: { idempotencyKey },
    });

    if (existingJob) {
      return {
        message: 'Post already scheduled with this idempotency key',
        scheduledPost: existingJob,
      };
    }

    const scheduledPost = await this.prisma.scheduledPost.create({
      data: {
        contentId: content.id,
        socialAccountId: account.id,
        scheduledTime: scheduledDate,
        idempotencyKey,
        status: 'scheduled',
      },
      include: {
        socialAccount: true,
      },
    });

    // Update Content status
    await this.prisma.content.update({
      where: { id: content.id },
      data: {
        status: 'scheduled',
        scheduledFor: scheduledDate,
      },
    });

    return scheduledPost;
  }

  /**
   * Identifies due posts and executes publishing lifecycle
   * Step 1: Acquire execution lock (status = 'publishing')
   * Step 2: Verify authorization & credentials
   * Step 3: Check platform status / reconcile before retry
   * Step 4: Publish through platform adapter
   * Step 5: Save external post ID & write audit log
   * Step 6: Update status to 'published' or handle exponential backoff retry
   */
  async processDuePosts(): Promise<{
    processedCount: number;
    successfulCount: number;
    failedCount: number;
    results: any[];
  }> {
    const now = new Date();

    // 1. Identify due posts (scheduledTime <= now AND status = 'scheduled')
    const duePosts = await this.prisma.scheduledPost.findMany({
      where: {
        scheduledTime: { lte: now },
        status: 'scheduled',
      },
      include: {
        content: {
          include: {
            variants: true,
            carouselSlides: { orderBy: { slideNumber: 'asc' } },
            mediaAssets: true,
          },
        },
        socialAccount: {
          include: { credential: true },
        },
        publishingLogs: {
          orderBy: { executedAt: 'desc' },
          take: 1,
        },
      },
      take: 20,
    });

    let successfulCount = 0;
    let failedCount = 0;
    const results: any[] = [];

    for (const post of duePosts) {
      // 2. Acquire execution lock
      const locked = await this.prisma.scheduledPost.updateMany({
        where: { id: post.id, status: 'scheduled' },
        data: { status: 'publishing' },
      });

      if (locked.count === 0) {
        continue; // Another worker process acquired the lock
      }

      const account = post.socialAccount;
      const content = post.content;
      const platform = account.platform as SocialPlatform;

      try {
        if (!account.credential) {
          throw new Error(`Platform credential missing for account ${account.accountName}`);
        }

        const adapter = this.adapterFactory.getAdapter(platform);
        const decryptedToken = decrypt(account.credential.accessTokenEnc);
        const decryptedSecret = account.credential.tokenSecretEnc
          ? decrypt(account.credential.tokenSecretEnc)
          : undefined;

        // 3. Reconcile: If previous log had external post ID, verify if platform already published it
        const lastLog = post.publishingLogs[0];
        if (lastLog?.externalPostId) {
          const statusCheck = await adapter.getPostStatus(lastLog.externalPostId, {
            accessToken: decryptedToken,
            platformAccountId: account.platformAccountId,
          });

          if (statusCheck.status === 'published') {
            await this.prisma.scheduledPost.update({
              where: { id: post.id },
              data: { status: 'published' },
            });
            await this.prisma.content.update({
              where: { id: content.id },
              data: { status: 'published', publishedAt: new Date() },
            });
            successfulCount++;
            results.push({ id: post.id, status: 'reconciled_published', url: statusCheck.url });
            continue;
          }
        }

        // 4. Build post payload
        const variant = content.variants.find((v) => v.platform === platform);
        const text = variant?.text || content.masterCopy;
        const hashtags = variant?.hashtagsJson ? JSON.parse(variant.hashtagsJson) : [];

        const pubResult = await adapter.publishPost(
          {
            text,
            mediaUrls: content.mediaAssets.map((m) => m.url),
            carouselSlides: content.carouselSlides.map((s) => ({
              slideNumber: s.slideNumber,
              headline: s.headline,
              bodyText: s.bodyText,
              imageUrl: s.imageUrl || undefined,
            })),
            hashtags,
          },
          {
            accessToken: decryptedToken,
            tokenSecret: decryptedSecret,
            platformAccountId: account.platformAccountId,
          }
        );

        if (!pubResult.success) {
          throw new Error(pubResult.error || 'Platform adapter returned failure');
        }

        // 5. Success: update ScheduledPost, Content, and record PublishingLog
        await this.prisma.scheduledPost.update({
          where: { id: post.id },
          data: { status: 'published' },
        });

        await this.prisma.content.update({
          where: { id: content.id },
          data: {
            status: 'published',
            publishedAt: new Date(pubResult.publishedAt),
          },
        });

        await this.prisma.publishingLog.create({
          data: {
            scheduledPostId: post.id,
            attemptNumber: post.retryCount + 1,
            statusCode: 200,
            externalPostId: pubResult.platformPostId || null,
            responseJson: JSON.stringify({ url: pubResult.url, publishedAt: pubResult.publishedAt }),
            executedAt: new Date(),
          },
        });

        successfulCount++;
        results.push({ id: post.id, status: 'published', url: pubResult.url });
      } catch (err: any) {
        failedCount++;
        const attempt = post.retryCount + 1;
        const maxRetries = 3;

        // Exponential backoff: 2^(attempt - 1) * 60 seconds (60s, 120s, 240s)
        const backoffSeconds = Math.pow(2, attempt - 1) * 60;
        const nextRetryTime = new Date(Date.now() + backoffSeconds * 1000);

        if (attempt < maxRetries) {
          // Re-schedule with incremented retry count and backoff time
          await this.prisma.scheduledPost.update({
            where: { id: post.id },
            data: {
              status: 'scheduled',
              retryCount: attempt,
              scheduledTime: nextRetryTime,
            },
          });
          results.push({ id: post.id, status: 'retry_scheduled', attempt, nextRetryTime });
        } else {
          // Max retries exceeded: mark failed
          await this.prisma.scheduledPost.update({
            where: { id: post.id },
            data: { status: 'failed', retryCount: attempt },
          });

          await this.prisma.content.update({
            where: { id: content.id },
            data: { status: 'failed' },
          });

          results.push({ id: post.id, status: 'failed', error: err.message });
        }

        // Record failure log
        await this.prisma.publishingLog.create({
          data: {
            scheduledPostId: post.id,
            attemptNumber: attempt,
            statusCode: 500,
            errorMessage: err.message,
            executedAt: new Date(),
          },
        });
      }
    }

    return {
      processedCount: duePosts.length,
      successfulCount,
      failedCount,
      results,
    };
  }

  /**
   * List scheduled posts for a business
   */
  async getScheduledPosts(businessId: string, status?: string) {
    const where: any = {
      content: { businessId },
    };
    if (status) {
      where.status = status;
    }

    return this.prisma.scheduledPost.findMany({
      where,
      include: {
        content: true,
        socialAccount: true,
        publishingLogs: { orderBy: { executedAt: 'desc' } },
      },
      orderBy: { scheduledTime: 'asc' },
    });
  }

  /**
   * Reschedule a post
   */
  async reschedulePost(businessId: string, id: string, dto: ReschedulePostDto) {
    const post = await this.prisma.scheduledPost.findUnique({
      where: { id },
      include: { content: true },
    });

    if (!post) {
      throw new NotFoundException(`Scheduled post ${id} not found`);
    }

    if (post.content.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to post outside business`);
    }

    const newDate = new Date(dto.scheduledTime);
    if (isNaN(newDate.getTime())) {
      throw new BadRequestException(`Invalid scheduledTime format`);
    }

    const newIdempotencyKey = `idemp_${post.contentId}_${post.socialAccountId}_${newDate.getTime()}`;

    const updated = await this.prisma.scheduledPost.update({
      where: { id },
      data: {
        scheduledTime: newDate,
        idempotencyKey: newIdempotencyKey,
        status: 'scheduled',
      },
    });

    await this.prisma.content.update({
      where: { id: post.contentId },
      data: { scheduledFor: newDate, status: 'scheduled' },
    });

    return updated;
  }

  /**
   * Cancel a scheduled post
   */
  async cancelPost(businessId: string, id: string) {
    const post = await this.prisma.scheduledPost.findUnique({
      where: { id },
      include: { content: true },
    });

    if (!post) {
      throw new NotFoundException(`Scheduled post ${id} not found`);
    }

    if (post.content.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to post outside business`);
    }

    await this.prisma.scheduledPost.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    await this.prisma.content.update({
      where: { id: post.contentId },
      data: { status: 'cancelled' },
    });

    return { success: true, id, status: 'cancelled' };
  }

  /**
   * Get publishing audit logs for business
   */
  async getPublishingLogs(businessId: string, scheduledPostId?: string) {
    const where: any = {
      scheduledPost: {
        content: { businessId },
      },
    };
    if (scheduledPostId) {
      where.scheduledPostId = scheduledPostId;
    }

    return this.prisma.publishingLog.findMany({
      where,
      include: {
        scheduledPost: {
          include: {
            content: true,
            socialAccount: true,
          },
        },
      },
      orderBy: { executedAt: 'desc' },
      take: 50,
    });
  }
}
