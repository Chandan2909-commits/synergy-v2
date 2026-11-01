import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { AIModule } from '../ai/ai.module';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Module({
  imports: [PrismaModule, AIModule],
  controllers: [ContentController],
  providers: [ContentService, TenantGuard],
  exports: [ContentService],
})
export class ContentModule {}

