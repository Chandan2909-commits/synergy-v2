import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CalendarQueryDto } from '../publishing/publishing.dto';

const VALID_TRANSITIONS: Record<string, string[]> = {
  idea: ['planned', 'generating', 'draft', 'cancelled'],
  planned: ['generating', 'draft', 'scheduled', 'cancelled'],
  generating: ['draft', 'failed'],
  draft: ['pending_approval', 'approved', 'scheduled', 'cancelled'],
  pending_approval: ['approved', 'draft', 'cancelled'],
  approved: ['scheduled', 'publishing', 'draft', 'cancelled'],
  scheduled: ['publishing', 'cancelled', 'draft'],
  publishing: ['published', 'failed'],
  failed: ['scheduled', 'draft', 'cancelled'],
  cancelled: ['draft'],
  published: [], // terminal
};

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get content calendar feed aggregated by business date
   */
  async getCalendarFeed(businessId: string, query: CalendarQueryDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, name: true, timezone: true },
    });

    if (!business) {
      throw new NotFoundException(`Business ${businessId} not found`);
    }

    const where: any = { businessId };

    if (query.startDate || query.endDate) {
      where.OR = [
        {
          scheduledFor: {
            gte: query.startDate ? new Date(query.startDate) : undefined,
            lte: query.endDate ? new Date(query.endDate) : undefined,
          },
        },
        {
          publishedAt: {
            gte: query.startDate ? new Date(query.startDate) : undefined,
            lte: query.endDate ? new Date(query.endDate) : undefined,
          },
        },
        {
          status: 'draft',
        },
      ];
    }

    const contents = await this.prisma.content.findMany({
      where,
      include: {
        variants: true,
        carouselSlides: { orderBy: { slideNumber: 'asc' } },
        scheduledPosts: {
          include: { socialAccount: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Bucket into drafts, scheduled, published, failed
    const drafts = contents.filter((c) => c.status === 'draft' || c.status === 'idea' || c.status === 'planned');
    const scheduled = contents.filter((c) => c.status === 'scheduled' || c.status === 'pending_approval' || c.status === 'approved');
    const published = contents.filter((c) => c.status === 'published');
    const failed = contents.filter((c) => c.status === 'failed');

    return {
      business: {
        id: business.id,
        name: business.name,
        timezone: business.timezone,
      },
      view: query.view || 'month',
      summary: {
        total: contents.length,
        draftsCount: drafts.length,
        scheduledCount: scheduled.length,
        publishedCount: published.length,
        failedCount: failed.length,
      },
      feed: contents.map((c) => ({
        id: c.id,
        title: c.title,
        status: c.status,
        masterCopy: c.masterCopy,
        targetPlatforms: JSON.parse(c.targetPlatformsJson || '[]'),
        scheduledFor: c.scheduledFor,
        publishedAt: c.publishedAt,
        slideCount: c.carouselSlides.length,
        scheduledAccounts: c.scheduledPosts.map((sp) => ({
          platform: sp.socialAccount.platform,
          accountName: sp.socialAccount.accountName,
          scheduledTime: sp.scheduledTime,
          status: sp.status,
        })),
        createdAt: c.createdAt,
      })),
    };
  }

  /**
   * Update post status enforcing state transition machine per Phase 6.2
   */
  async updateStatus(businessId: string, contentId: string, newStatus: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException(`Content ${contentId} not found`);
    }

    if (content.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to content outside business`);
    }

    const currentStatus = content.status.toLowerCase();
    const targetStatus = newStatus.toLowerCase();

    if (currentStatus === targetStatus) {
      return content;
    }

    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new BadRequestException(
        `Invalid status transition from '${currentStatus.toUpperCase()}' to '${targetStatus.toUpperCase()}'. Allowed transitions: [${allowed.map((s) => s.toUpperCase()).join(', ')}]`
      );
    }

    const updated = await this.prisma.content.update({
      where: { id: contentId },
      data: { status: targetStatus },
    });

    return updated;
  }
}
