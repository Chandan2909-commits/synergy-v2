import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SocialAdapterFactory } from './adapters/adapter.factory';
import {
  ConnectAccountDto,
  OAuthCallbackDto,
  ValidatePostDto,
  PublishNowDto,
} from './social.dto';
import { encrypt, decrypt, maskApiKey } from '../../common/utils/encryption.util';
import { SocialPlatform } from '@synergy/types';

@Injectable()
export class SocialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly adapterFactory: SocialAdapterFactory
  ) {}

  /**
   * List all social accounts connected to a business
   */
  async getAccounts(businessId: string) {
    const accounts = await this.prisma.socialAccount.findMany({
      where: { businessId },
      include: { credential: true },
      orderBy: { platform: 'asc' },
    });

    return accounts.map((acc) => {
      const isExpired = acc.tokenExpiresAt ? new Date(acc.tokenExpiresAt) < new Date() : false;
      return {
        id: acc.id,
        businessId: acc.businessId,
        platform: acc.platform,
        platformAccountId: acc.platformAccountId,
        accountName: acc.accountName,
        avatarUrl: acc.avatarUrl,
        isConnected: acc.isConnected && !isExpired,
        tokenExpiresAt: acc.tokenExpiresAt,
        lastSyncAt: acc.lastSyncAt,
        permissions: JSON.parse(acc.permissionsJson || '[]'),
        hasCredential: !!acc.credential,
        tokenPreview: acc.credential
          ? maskApiKey(decrypt(acc.credential.accessTokenEnc))
          : undefined,
        apiKeyPreview: acc.credential?.apiKeyEnc
          ? maskApiKey(decrypt(acc.credential.apiKeyEnc))
          : undefined,
        clientIdPreview: acc.credential?.clientIdEnc
          ? maskApiKey(decrypt(acc.credential.clientIdEnc))
          : undefined,
      };
    });
  }

  /**
   * Manually connect or register credentials for a platform
   */
  async connectAccount(businessId: string, dto: ConnectAccountDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business ${businessId} not found`);
    }

    const encAccessToken = encrypt(dto.accessToken);
    const encRefreshToken = dto.refreshToken ? encrypt(dto.refreshToken) : null;
    const encApiKey = dto.apiKey ? encrypt(dto.apiKey) : null;
    const encApiSecret = dto.apiSecret ? encrypt(dto.apiSecret) : null;
    const encClientId = dto.clientId ? encrypt(dto.clientId) : null;
    const encClientSecret = dto.clientSecret ? encrypt(dto.clientSecret) : null;

    // Check if account already exists for this business + platform + platformAccountId
    const existing = await this.prisma.socialAccount.findFirst({
      where: {
        businessId,
        platform: dto.platform,
        platformAccountId: dto.platformAccountId,
      },
    });

    let account;
    if (existing) {
      account = await this.prisma.socialAccount.update({
        where: { id: existing.id },
        data: {
          accountName: dto.accountName,
          avatarUrl: dto.avatarUrl || existing.avatarUrl,
          isConnected: true,
          tokenExpiresAt: dto.tokenExpiresAt ? new Date(dto.tokenExpiresAt) : null,
          lastSyncAt: new Date(),
          permissionsJson: JSON.stringify(dto.permissions || ['publish']),
        },
      });

      await this.prisma.platformCredential.upsert({
        where: { socialAccountId: account.id },
        update: {
          accessTokenEnc: encAccessToken,
          refreshTokenEnc: encRefreshToken,
          apiKeyEnc: encApiKey,
          apiSecretEnc: encApiSecret,
          clientIdEnc: encClientId,
          clientSecretEnc: encClientSecret,
        },
        create: {
          socialAccountId: account.id,
          accessTokenEnc: encAccessToken,
          refreshTokenEnc: encRefreshToken,
          apiKeyEnc: encApiKey,
          apiSecretEnc: encApiSecret,
          clientIdEnc: encClientId,
          clientSecretEnc: encClientSecret,
        },
      });
    } else {
      account = await this.prisma.socialAccount.create({
        data: {
          businessId,
          platform: dto.platform,
          platformAccountId: dto.platformAccountId,
          accountName: dto.accountName,
          avatarUrl: dto.avatarUrl || null,
          isConnected: true,
          tokenExpiresAt: dto.tokenExpiresAt ? new Date(dto.tokenExpiresAt) : null,
          lastSyncAt: new Date(),
          permissionsJson: JSON.stringify(dto.permissions || ['publish']),
          credential: {
            create: {
              accessTokenEnc: encAccessToken,
              refreshTokenEnc: encRefreshToken,
              apiKeyEnc: encApiKey,
              apiSecretEnc: encApiSecret,
              clientIdEnc: encClientId,
              clientSecretEnc: encClientSecret,
            },
          },
        },
      });
    }

    return {
      success: true,
      account: {
        id: account.id,
        platform: account.platform,
        accountName: account.accountName,
        isConnected: true,
      },
    };
  }

  /**
   * Generate OAuth authorization URL
   */
  getOAuthUrl(businessId: string, platform: SocialPlatform, redirectUri: string) {
    const adapter = this.adapterFactory.getAdapter(platform);
    const statePayload = Buffer.from(
      JSON.stringify({ businessId, platform, nonce: Date.now() })
    ).toString('base64');

    const authUrl = adapter.getAuthorizationUrl(statePayload, redirectUri);
    return {
      platform,
      authorizationUrl: authUrl,
      state: statePayload,
    };
  }

  /**
   * Handle OAuth Callback from provider
   */
  async handleOAuthCallback(
    businessId: string,
    platform: SocialPlatform,
    dto: OAuthCallbackDto
  ) {
    const adapter = this.adapterFactory.getAdapter(platform);
    const connResult = await adapter.handleCallback(dto.code, dto.redirectUri);

    if (!connResult.success) {
      throw new BadRequestException(`OAuth authorization failed for ${platform}`);
    }

    return this.connectAccount(businessId, {
      platform,
      platformAccountId: connResult.platformAccountId,
      accountName: connResult.accountName,
      avatarUrl: connResult.avatarUrl,
      accessToken: connResult.accessToken,
      refreshToken: connResult.refreshToken,
      tokenExpiresAt: connResult.tokenExpiresAt,
      permissions: connResult.permissions,
    });
  }

  /**
   * Test active connection & refresh token if required
   */
  async testConnection(businessId: string, accountId: string) {
    const account = await this.prisma.socialAccount.findUnique({
      where: { id: accountId },
      include: { credential: true },
    });

    if (!account) {
      throw new NotFoundException(`Social account ${accountId} not found`);
    }

    if (account.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to account outside business`);
    }

    if (!account.credential) {
      throw new BadRequestException(`No platform credential registered for this account`);
    }

    const adapter = this.adapterFactory.getAdapter(account.platform as SocialPlatform);
    const decryptedToken = decrypt(account.credential.accessTokenEnc);

    // If token is expired and refreshToken exists, refresh it
    if (account.tokenExpiresAt && new Date(account.tokenExpiresAt) < new Date() && account.credential.refreshTokenEnc) {
      const decryptedRefresh = decrypt(account.credential.refreshTokenEnc);
      const refreshed = await adapter.refreshToken(decryptedRefresh);

      await this.prisma.platformCredential.update({
        where: { socialAccountId: account.id },
        data: {
          accessTokenEnc: encrypt(refreshed.accessToken),
          refreshTokenEnc: refreshed.refreshToken ? encrypt(refreshed.refreshToken) : undefined,
        },
      });

      if (refreshed.tokenExpiresAt) {
        await this.prisma.socialAccount.update({
          where: { id: account.id },
          data: { tokenExpiresAt: new Date(refreshed.tokenExpiresAt), isConnected: true },
        });
      }
    }

    await this.prisma.socialAccount.update({
      where: { id: account.id },
      data: { lastSyncAt: new Date(), isConnected: true },
    });

    return {
      success: true,
      platform: account.platform,
      accountName: account.accountName,
      status: 'active',
      lastSyncAt: new Date().toISOString(),
    };
  }

  /**
   * Disconnect social account
   */
  async disconnectAccount(businessId: string, accountId: string) {
    const account = await this.prisma.socialAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException(`Social account ${accountId} not found`);
    }

    if (account.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to account outside business`);
    }

    // Delete credentials and mark inactive
    await this.prisma.platformCredential.deleteMany({
      where: { socialAccountId: accountId },
    });

    await this.prisma.socialAccount.update({
      where: { id: accountId },
      data: { isConnected: false },
    });

    return { success: true, accountId, disconnected: true };
  }

  /**
   * Pre-flight validate content against platform restrictions
   */
  validateContent(dto: ValidatePostDto) {
    const adapter = this.adapterFactory.getAdapter(dto.platform);
    return adapter.validateContent({
      text: dto.text,
      mediaUrls: dto.mediaUrls,
      carouselSlides: dto.carouselSlides,
      hashtags: dto.hashtags,
    });
  }

  /**
   * Immediately publish content to connected social account
   */
  async publishNow(businessId: string, dto: PublishNowDto) {
    const content = await this.prisma.content.findUnique({
      where: { id: dto.contentId },
      include: {
        variants: true,
        carouselSlides: { orderBy: { slideNumber: 'asc' } },
        mediaAssets: true,
      },
    });

    if (!content) {
      throw new NotFoundException(`Content ${dto.contentId} not found`);
    }

    if (content.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to content outside business`);
    }

    // Find account
    const whereAccount: any = {
      businessId,
      platform: dto.platform,
      isConnected: true,
    };
    if (dto.socialAccountId) {
      whereAccount.id = dto.socialAccountId;
    }

    const account = await this.prisma.socialAccount.findFirst({
      where: whereAccount,
      include: { credential: true },
    });

    if (!account || !account.credential) {
      throw new BadRequestException(
        `No connected ${dto.platform.toUpperCase()} account found for business. Please connect an account first.`
      );
    }

    const adapter = this.adapterFactory.getAdapter(dto.platform);
    const decryptedToken = decrypt(account.credential.accessTokenEnc);
    const decryptedSecret = account.credential.tokenSecretEnc
      ? decrypt(account.credential.tokenSecretEnc)
      : undefined;

    // Platform-specific variant if exists, else masterCopy
    const variant = content.variants.find((v) => v.platform === dto.platform);
    const postText = variant?.text || content.masterCopy;
    const postHashtags = variant?.hashtagsJson ? JSON.parse(variant.hashtagsJson) : [];

    const publishResult = await adapter.publishPost(
      {
        text: postText,
        mediaUrls: content.mediaAssets.map((m) => m.url),
        carouselSlides: content.carouselSlides.map((s) => ({
          slideNumber: s.slideNumber,
          headline: s.headline,
          bodyText: s.bodyText,
          imageUrl: s.imageUrl || undefined,
        })),
        hashtags: postHashtags,
      },
      {
        accessToken: decryptedToken,
        tokenSecret: decryptedSecret,
        platformAccountId: account.platformAccountId,
      }
    );

    if (publishResult.success) {
      await this.prisma.content.update({
        where: { id: content.id },
        data: {
          status: 'published',
          publishedAt: new Date(publishResult.publishedAt),
        },
      });
    }

    return {
      publishResult,
      contentId: content.id,
      platform: dto.platform,
      accountName: account.accountName,
    };
  }
}

