import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SocialModule } from '../social/social.module';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Module({
  imports: [PrismaModule, SocialModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, TenantGuard],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
