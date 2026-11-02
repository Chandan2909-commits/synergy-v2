import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { AIModule } from './modules/ai/ai.module';
import { ContentModule } from './modules/content/content.module';
import { SocialModule } from './modules/social/social.module';
import { PublishingModule } from './modules/publishing/publishing.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { OrchestrationModule } from './modules/orchestration/orchestration.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { TeamModule } from './modules/team/team.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    RedisModule,
    HealthModule,
    AuthModule,
    AIModule,
    ContentModule,
    SocialModule,
    PublishingModule,
    CalendarModule,
    OrchestrationModule,
    AnalyticsModule,
    TeamModule,
  ],
})
export class AppModule {}

