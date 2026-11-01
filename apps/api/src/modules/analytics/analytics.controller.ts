import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto, SyncAnalyticsDto } from './analytics.dto';

@Controller('analytics')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(
    @Headers('x-business-id') businessId: string,
    @Query() query: AnalyticsQueryDto
  ) {
    return this.analyticsService.getOverview(businessId, query);
  }

  @Post('sync')
  async syncMetrics(
    @Headers('x-business-id') businessId: string,
    @Body() dto: SyncAnalyticsDto
  ) {
    return this.analyticsService.syncMetrics(businessId, dto.platform);
  }

  @Get('snapshots')
  async getSnapshots(
    @Headers('x-business-id') businessId: string,
    @Query('metricName') metricName?: string,
    @Query('platform') platform?: string
  ) {
    return this.analyticsService.getSnapshots(businessId, metricName, platform);
  }

  @Get('insights')
  async getInsights(@Headers('x-business-id') businessId: string) {
    return this.analyticsService.getInsights(businessId);
  }
}

