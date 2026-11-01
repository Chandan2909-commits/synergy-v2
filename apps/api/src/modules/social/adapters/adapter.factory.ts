import { Injectable, BadRequestException } from '@nestjs/common';
import { SocialPlatform } from '@synergy/types';
import { BaseSocialAdapter } from './base.adapter';
import { InstagramAdapter } from './instagram.adapter';
import { LinkedInAdapter } from './linkedin.adapter';
import { XAdapter } from './x.adapter';

@Injectable()
export class SocialAdapterFactory {
  private readonly adapters: Map<SocialPlatform, BaseSocialAdapter> = new Map();

  constructor(
    private readonly instagramAdapter: InstagramAdapter,
    private readonly linkedinAdapter: LinkedInAdapter,
    private readonly xAdapter: XAdapter
  ) {
    this.adapters.set('instagram', instagramAdapter);
    this.adapters.set('linkedin', linkedinAdapter);
    this.adapters.set('x', xAdapter);
  }

  getAdapter(platform: SocialPlatform): BaseSocialAdapter {
    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new BadRequestException(`Social platform '${platform}' is not supported in Phase 5`);
    }
    return adapter;
  }
}

