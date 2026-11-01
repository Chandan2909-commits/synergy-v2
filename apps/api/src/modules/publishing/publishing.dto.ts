export class SchedulePostDto {
  contentId!: string;
  socialAccountId!: string;
  scheduledTime!: string; // ISO 8601 string
}

export class ReschedulePostDto {
  scheduledTime!: string; // ISO 8601 string
}

export class UpdatePostStatusDto {
  status!: string;
}

export class CalendarQueryDto {
  view?: 'month' | 'week' | 'day';
  startDate?: string;
  endDate?: string;
  date?: string;
}
