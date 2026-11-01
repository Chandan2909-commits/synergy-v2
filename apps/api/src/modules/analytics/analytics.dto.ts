export class AnalyticsQueryDto {
  period?: '7d' | '30d' | '90d' | 'custom';
  startDate?: string;
  endDate?: string;
  platform?: 'instagram' | 'linkedin' | 'x';
}

export class SyncAnalyticsDto {
  platform?: 'instagram' | 'linkedin' | 'x';
}
