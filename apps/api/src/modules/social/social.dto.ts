import { SocialPlatform } from '@synergy/types';

export class ConnectAccountDto {
  platform!: SocialPlatform;
  platformAccountId!: string;
  accountName!: string;
  avatarUrl?: string;
  accessToken!: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  permissions?: string[];
  apiKey?: string;
  apiSecret?: string;
  clientId?: string;
  clientSecret?: string;
}

export class OAuthCallbackDto {
  code!: string;
  state!: string;
  redirectUri!: string;
}

export class ValidatePostDto {
  platform!: SocialPlatform;
  text!: string;
  mediaUrls?: string[];
  carouselSlides?: {
    slideNumber: number;
    headline: string;
    bodyText: string;
    imageUrl?: string;
  }[];
  hashtags?: string[];
}

export class PublishNowDto {
  contentId!: string;
  platform!: SocialPlatform;
  socialAccountId?: string;
}

