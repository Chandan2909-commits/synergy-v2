export class InviteMemberDto {
  email!: string;
  role?: string; // 'business_admin' | 'marketing_manager' | 'content_creator' | 'designer' | 'analyst' | 'viewer'
}

export class UpdateMemberRoleDto {
  role!: string;
}

export class AcceptInvitationDto {
  password!: string;
  fullName!: string;
}

export class ApprovalActionDto {
  notes?: string;
  reason?: string;
  autoSchedule?: boolean;
}
