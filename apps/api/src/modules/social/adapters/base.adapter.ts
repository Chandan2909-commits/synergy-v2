import {
  SocialPlatform,
  SocialPlatformAdapter,
  PlatformPost,
  PublishResult,
  PostStatusInfo,
  PlatformValidationResult,
  ConnectionResult,
} from '@synergy/types';

export abstract class BaseSocialAdapter implements SocialPlatformAdapter {
  abstract platform: SocialPlatform;

  abstract getAuthorizationUrl(state: string, redirectUri: string): string;

  abstract handleCallback(code: string, redirectUri: string): Promise<ConnectionResult>;

  abstract refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    tokenExpiresAt?: string;
  }>;

  abstract validateContent(post: PlatformPost): PlatformValidationResult;

  abstract publishPost(
    post: PlatformPost,
    credentials: { accessToken: string; tokenSecret?: string; platformAccountId: string }
  ): Promise<PublishResult>;

  abstract getPostStatus(
    platformPostId: string,
    credentials: { accessToken: string; platformAccountId: string }
  ): Promise<PostStatusInfo>;

  protected isTestToken(token?: string): boolean {
    if (!token) return true;
    return (
      token.startsWith('test_') ||
      token.startsWith('mock_') ||
      token.includes('dummy') ||
      token.length < 15
    );
  }
}

