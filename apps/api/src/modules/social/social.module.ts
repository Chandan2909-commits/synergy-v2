import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { SocialAdapterFactory } from './adapters/adapter.factory';
import { InstagramAdapter } from './adapters/instagram.adapter';
import { LinkedInAdapter } from './adapters/linkedin.adapter';
import { XAdapter } from './adapters/x.adapter';

@Module({
  imports: [PrismaModule],
  controllers: [SocialController],
  providers: [
    InstagramAdapter,
    LinkedInAdapter,
    XAdapter,
    SocialAdapterFactory,
    SocialService,
    TenantGuard,
  ],
  exports: [SocialService, SocialAdapterFactory],
})
export class SocialModule {}

