import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CalendarService } from './calendar.service';
import { CalendarQueryDto, UpdatePostStatusDto } from '../publishing/publishing.dto';

@Controller('calendar')
@UseGuards(JwtAuthGuard, TenantGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  async getCalendarFeed(
    @Headers('x-business-id') businessId: string,
    @Query() query: CalendarQueryDto
  ) {
    return this.calendarService.getCalendarFeed(businessId, query);
  }

  @Put('content/:id/status')
  async updateStatus(
    @Headers('x-business-id') businessId: string,
    @Param('id') contentId: string,
    @Body() dto: UpdatePostStatusDto
  ) {
    return this.calendarService.updateStatus(businessId, contentId, dto.status);
  }
}
