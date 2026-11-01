import { Module } from '@nestjs/common';
import { OrchestrationController } from './orchestration.controller';
import { OrchestrationService } from './orchestration.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { ContentModule } from '../content/content.module';
import { PublishingModule } from '../publishing/publishing.module';
import { SocialModule } from '../social/social.module';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Module({
  imports: [PrismaModule, ContentModule, PublishingModule, SocialModule],
  controllers: [OrchestrationController],
  providers: [OrchestrationService, TenantGuard],
  exports: [OrchestrationService],
})
export class OrchestrationModule {}

