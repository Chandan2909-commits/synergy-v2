import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PublishingService } from './publishing.service';
import { SchedulePostDto, ReschedulePostDto } from './publishing.dto';

@Controller('publishing')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PublishingController {
  constructor(private readonly publishingService: PublishingService) {}

  @Post('schedule')
  async schedulePost(
    @Headers('x-business-id') businessId: string,
    @Body() dto: SchedulePostDto
  ) {
    return this.publishingService.schedulePost(businessId, dto);
  }

  @Get('scheduled')
  async getScheduledPosts(
    @Headers('x-business-id') businessId: string,
    @Query('status') status?: string
  ) {
    return this.publishingService.getScheduledPosts(businessId, status);
  }

  @Post('scheduled/:id/reschedule')
  async reschedulePost(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string,
    @Body() dto: ReschedulePostDto
  ) {
    return this.publishingService.reschedulePost(businessId, id, dto);
  }

  @Post('scheduled/:id/cancel')
  async cancelPost(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string
  ) {
    return this.publishingService.cancelPost(businessId, id);
  }

  @Post('process-due')
  async processDuePosts() {
    return this.publishingService.processDuePosts();
  }

  @Get('logs')
  async getPublishingLogs(
    @Headers('x-business-id') businessId: string,
    @Query('scheduledPostId') scheduledPostId?: string
  ) {
    return this.publishingService.getPublishingLogs(businessId, scheduledPostId);
  }
}

