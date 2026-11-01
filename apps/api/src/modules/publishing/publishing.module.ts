import { Module } from '@nestjs/common';
import { PublishingController } from './publishing.controller';
import { PublishingService } from './publishing.service';
import { PublishingScheduler } from './publishing.scheduler';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SocialModule } from '../social/social.module';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Module({
  imports: [PrismaModule, SocialModule],
  controllers: [PublishingController],
  providers: [PublishingService, PublishingScheduler, TenantGuard],
  exports: [PublishingService],
})
export class PublishingModule {}

