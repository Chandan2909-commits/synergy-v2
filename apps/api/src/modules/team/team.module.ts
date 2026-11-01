import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { PublishingModule } from '../publishing/publishing.module';
import { SocialModule } from '../social/social.module';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Module({
  imports: [PrismaModule, PublishingModule, SocialModule],
  controllers: [TeamController],
  providers: [TeamService, TenantGuard],
  exports: [TeamService],
})
export class TeamModule {}
