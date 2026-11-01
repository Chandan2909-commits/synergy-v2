export class CreateWorkflowDto {
  name!: string;
  description?: string;
  triggerType?: 'cron' | 'manual' | 'event';
  cronSchedule?: string;
  targetPlatforms!: string[];
  contentCategories?: string[];
  assignedPersonas?: string[];
  approvalMode?: 'manual' | 'conditional' | 'full_auto';
  monthlyAiBudgetUsd?: number;
}

export class UpdateWorkflowDto {
  name?: string;
  description?: string;
  cronSchedule?: string;
  targetPlatforms?: string[];
  contentCategories?: string[];
  assignedPersonas?: string[];
  approvalMode?: 'manual' | 'conditional' | 'full_auto';
  monthlyAiBudgetUsd?: number;
  isActive?: boolean;
}

export class TriggerWorkflowDto {
  objective?: string;
  scheduledFor?: string;
}

export class ExecuteAutonomousDto {
  objective!: string;
  targetPlatforms!: string[]; // 'instagram', 'linkedin', 'x'
  format?: 'text' | 'image' | 'carousel';
  carouselSlideCount?: number;
  approvalMode?: 'manual' | 'conditional' | 'full_auto';
  scheduledTime?: string;
}
