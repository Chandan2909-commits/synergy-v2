import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TeamService } from './team.service';
import {
  InviteMemberDto,
  UpdateMemberRoleDto,
  AcceptInvitationDto,
  ApprovalActionDto,
} from './team.dto';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  // Public endpoint for accepting invitations
  @Post('invitations/:token/accept')
  async acceptInvitation(
    @Param('token') token: string,
    @Body() dto: AcceptInvitationDto
  ) {
    return this.teamService.acceptInvitation(token, dto);
  }

  @Post('invitations')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async inviteMember(
    @Headers('x-business-id') businessId: string,
    @Req() req: any,
    @Body() dto: InviteMemberDto
  ) {
    const userId = req.user?.userId || req.user?.id;
    return this.teamService.inviteMember(businessId, userId, dto);
  }

  @Get('invitations')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getInvitations(@Headers('x-business-id') businessId: string) {
    return this.teamService.getInvitations(businessId);
  }

  @Delete('invitations/:id')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async revokeInvitation(
    @Headers('x-business-id') businessId: string,
    @Req() req: any,
    @Param('id') id: string
  ) {
    const userId = req.user?.userId || req.user?.id;
    return this.teamService.revokeInvitation(businessId, userId, id);
  }

  @Get('members')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getMembers(@Headers('x-business-id') businessId: string) {
    return this.teamService.getMembers(businessId);
  }

  @Put('members/:id')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async updateMemberRole(
    @Headers('x-business-id') businessId: string,
    @Req() req: any,
    @Param('id') memberId: string,
    @Body() dto: UpdateMemberRoleDto
  ) {
    const userId = req.user?.userId || req.user?.id;
    return this.teamService.updateMemberRole(businessId, userId, memberId, dto);
  }

  @Delete('members/:id')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async removeMember(
    @Headers('x-business-id') businessId: string,
    @Req() req: any,
    @Param('id') memberId: string
  ) {
    const userId = req.user?.userId || req.user?.id;
    return this.teamService.removeMember(businessId, userId, memberId);
  }

  @Post('approvals/:contentId/submit')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async submitForApproval(
    @Headers('x-business-id') businessId: string,
    @Req() req: any,
    @Param('contentId') contentId: string,
    @Body('notes') notes?: string
  ) {
    const userId = req.user?.userId || req.user?.id;
    return this.teamService.submitForApproval(businessId, userId, contentId, notes);
  }

  @Post('approvals/:contentId/approve')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async approveContent(
    @Headers('x-business-id') businessId: string,
    @Req() req: any,
    @Param('contentId') contentId: string,
    @Body() dto?: ApprovalActionDto
  ) {
    const userId = req.user?.userId || req.user?.id;
    return this.teamService.approveContent(businessId, userId, contentId, dto);
  }

  @Post('approvals/:contentId/reject')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async rejectContent(
    @Headers('x-business-id') businessId: string,
    @Req() req: any,
    @Param('contentId') contentId: string,
    @Body('reason') reason: string
  ) {
    const userId = req.user?.userId || req.user?.id;
    return this.teamService.rejectContent(businessId, userId, contentId, reason || 'Content does not meet quality bar');
  }

  @Post('approvals/:contentId/request-changes')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async requestChanges(
    @Headers('x-business-id') businessId: string,
    @Req() req: any,
    @Param('contentId') contentId: string,
    @Body('notes') notes: string
  ) {
    const userId = req.user?.userId || req.user?.id;
    return this.teamService.requestChanges(businessId, userId, contentId, notes || 'Please update hashtags and hook');
  }

  @Get('approvals/:contentId/history')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getApprovalHistory(
    @Headers('x-business-id') businessId: string,
    @Param('contentId') contentId: string
  ) {
    return this.teamService.getApprovalHistory(businessId, contentId);
  }

  @Get('notifications')
  @UseGuards(JwtAuthGuard)
  async getNotifications(@Req() req: any) {
    const userId = req.user?.userId || req.user?.id;
    return this.teamService.getNotifications(userId);
  }

  @Post('notifications/:id/read')
  @UseGuards(JwtAuthGuard)
  async markNotificationRead(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.userId || req.user?.id;
    return this.teamService.markNotificationRead(userId, id);
  }

  @Get('audit-logs')
  @UseGuards(JwtAuthGuard, TenantGuard)
  async getAuditLogs(@Headers('x-business-id') businessId: string) {
    return this.teamService.getAuditLogs(businessId);
  }
}
