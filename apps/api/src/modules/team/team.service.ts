import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PublishingService } from '../publishing/publishing.service';
import { SocialService } from '../social/social.service';
import {
  InviteMemberDto,
  UpdateMemberRoleDto,
  AcceptInvitationDto,
  ApprovalActionDto,
} from './team.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publishingService: PublishingService,
    private readonly socialService: SocialService
  ) {}

  /**
   * Helper to write audit log
   */
  async logAction(businessId: string, userId: string | null, action: string, resource: string, resourceId?: string, details?: any) {
    return this.prisma.auditLog.create({
      data: {
        businessId,
        userId,
        action,
        resource,
        resourceId: resourceId || null,
        detailsJson: details ? JSON.stringify(details) : null,
      },
    });
  }

  /**
   * Invite an employee to the organization and assign business role
   */
  async inviteMember(businessId: string, invitedByUserId: string, dto: InviteMemberDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: { organization: true },
    });

    if (!business) {
      throw new NotFoundException(`Business ${businessId} not found`);
    }

    const email = dto.email.toLowerCase().trim();
    const token = crypto.randomBytes(32).toString('hex');
    const role = dto.role || 'marketing_manager';
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 days

    const invitation = await this.prisma.invitation.create({
      data: {
        organizationId: business.organizationId,
        email,
        role,
        token,
        status: 'pending',
        invitedByUserId,
        expiresAt,
      },
    });

    await this.logAction(businessId, invitedByUserId, 'MEMBER_INVITED', 'invitation', invitation.id, {
      email,
      role,
    });

    return {
      invitationId: invitation.id,
      email: invitation.email,
      role: invitation.role,
      token: invitation.token,
      expiresAt: invitation.expiresAt,
      invitationUrl: `http://localhost:3000/invite/accept?token=${invitation.token}`,
    };
  }

  /**
   * List pending invitations
   */
  async getInvitations(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business ${businessId} not found`);
    }

    return this.prisma.invitation.findMany({
      where: {
        organizationId: business.organizationId,
        status: 'pending',
      },
      include: {
        invitedByUser: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Revoke invitation
   */
  async revokeInvitation(businessId: string, userId: string, invitationId: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundException(`Invitation ${invitationId} not found`);
    }

    await this.prisma.invitation.delete({ where: { id: invitationId } });
    await this.logAction(businessId, userId, 'INVITATION_REVOKED', 'invitation', invitationId);

    return { success: true, invitationId };
  }

  /**
   * Accept invitation & register/attach member
   */
  async acceptInvitation(token: string, dto: AcceptInvitationDto) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: { organization: { include: { businesses: true } } },
    });

    if (!invitation) {
      throw new NotFoundException('Invalid or expired invitation token');
    }

    if (invitation.status !== 'pending' || new Date(invitation.expiresAt) < new Date()) {
      throw new BadRequestException('This invitation is no longer active');
    }

    const email = invitation.email.toLowerCase();
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      const passwordHash = await bcrypt.hash(dto.password, 10);
      user = await this.prisma.user.create({
        data: {
          email,
          passwordHash,
          fullName: dto.fullName,
        },
      });
    }

    // Add membership to organization
    await this.prisma.membership.upsert({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: invitation.organizationId,
        },
      },
      update: { role: 'member' },
      create: {
        userId: user.id,
        organizationId: invitation.organizationId,
        role: 'member',
      },
    });

    // Add BusinessMember role to organization's businesses
    for (const b of invitation.organization.businesses) {
      await this.prisma.businessMember.upsert({
        where: {
          userId_businessId: {
            userId: user.id,
            businessId: b.id,
          },
        },
        update: { role: invitation.role },
        create: {
          userId: user.id,
          businessId: b.id,
          role: invitation.role,
        },
      });
    }

    // Mark invitation accepted
    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: 'accepted' },
    });

    return {
      success: true,
      user: { id: user.id, email: user.email, fullName: user.fullName },
      organizationId: invitation.organizationId,
      assignedRole: invitation.role,
    };
  }

  /**
   * List members of a business
   */
  async getMembers(businessId: string) {
    const members = await this.prisma.businessMember.findMany({
      where: { businessId },
      include: {
        user: { select: { id: true, email: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return members.map((m) => ({
      id: m.id,
      userId: m.userId,
      email: m.user.email,
      fullName: m.user.fullName,
      avatarUrl: m.user.avatarUrl,
      role: m.role,
      joinedAt: m.createdAt,
    }));
  }

  /**
   * Update member role
   */
  async updateMemberRole(businessId: string, currentUserId: string, memberId: string, dto: UpdateMemberRoleDto) {
    const member = await this.prisma.businessMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.businessId !== businessId) {
      throw new NotFoundException(`Member ${memberId} not found in this business`);
    }

    const updated = await this.prisma.businessMember.update({
      where: { id: memberId },
      data: { role: dto.role },
    });

    await this.logAction(businessId, currentUserId, 'ROLE_UPDATED', 'member', memberId, {
      oldRole: member.role,
      newRole: dto.role,
    });

    return updated;
  }

  /**
   * Remove member from business
   */
  async removeMember(businessId: string, currentUserId: string, memberId: string) {
    const member = await this.prisma.businessMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.businessId !== businessId) {
      throw new NotFoundException(`Member ${memberId} not found in this business`);
    }

    await this.prisma.businessMember.delete({ where: { id: memberId } });
    await this.logAction(businessId, currentUserId, 'MEMBER_REMOVED', 'member', memberId);

    return { success: true, memberId };
  }

  /**
   * Submit content for approval (Section 9.2)
   */
  async submitForApproval(businessId: string, userId: string, contentId: string, notes?: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content || content.businessId !== businessId) {
      throw new NotFoundException(`Content ${contentId} not found`);
    }

    await this.prisma.content.update({
      where: { id: contentId },
      data: { status: 'pending_approval' },
    });

    const approval = await this.prisma.contentApproval.create({
      data: {
        contentId,
        userId,
        action: 'submitted',
        notes: notes || null,
      },
    });

    // Create Notification
    await this.prisma.notification.create({
      data: {
        userId,
        businessId,
        type: 'approval_required',
        title: 'Content Submitted for Approval',
        message: `Content "${content.title}" was submitted for review.`,
      },
    });

    await this.logAction(businessId, userId, 'CONTENT_SUBMITTED', 'content', contentId);

    return { success: true, status: 'pending_approval', approval };
  }

  /**
   * Approve content (Section 9.2)
   */
  async approveContent(businessId: string, userId: string, contentId: string, dto?: ApprovalActionDto) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content || content.businessId !== businessId) {
      throw new NotFoundException(`Content ${contentId} not found`);
    }

    await this.prisma.content.update({
      where: { id: contentId },
      data: { status: 'approved' },
    });

    const approval = await this.prisma.contentApproval.create({
      data: {
        contentId,
        userId,
        action: 'approved',
        notes: dto?.notes || null,
      },
    });

    await this.prisma.notification.create({
      data: {
        userId,
        businessId,
        type: 'content_approved',
        title: 'Content Approved',
        message: `Content "${content.title}" has been approved for publication.`,
      },
    });

    await this.logAction(businessId, userId, 'CONTENT_APPROVED', 'content', contentId);

    return { success: true, status: 'approved', approval };
  }

  /**
   * Reject content (Section 9.2)
   */
  async rejectContent(businessId: string, userId: string, contentId: string, reason: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content || content.businessId !== businessId) {
      throw new NotFoundException(`Content ${contentId} not found`);
    }

    await this.prisma.content.update({
      where: { id: contentId },
      data: { status: 'draft' }, // returned to draft
    });

    const approval = await this.prisma.contentApproval.create({
      data: {
        contentId,
        userId,
        action: 'rejected',
        notes: reason,
      },
    });

    await this.logAction(businessId, userId, 'CONTENT_REJECTED', 'content', contentId, { reason });

    return { success: true, status: 'draft', approval };
  }

  /**
   * Request changes on content (Section 9.2)
   */
  async requestChanges(businessId: string, userId: string, contentId: string, notes: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content || content.businessId !== businessId) {
      throw new NotFoundException(`Content ${contentId} not found`);
    }

    await this.prisma.content.update({
      where: { id: contentId },
      data: { status: 'draft' },
    });

    const approval = await this.prisma.contentApproval.create({
      data: {
        contentId,
        userId,
        action: 'changes_requested',
        notes,
      },
    });

    await this.logAction(businessId, userId, 'CONTENT_CHANGES_REQUESTED', 'content', contentId, { notes });

    return { success: true, status: 'draft', approval };
  }

  /**
   * Get approval history for a content item
   */
  async getApprovalHistory(businessId: string, contentId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content || content.businessId !== businessId) {
      throw new NotFoundException(`Content ${contentId} not found`);
    }

    return this.prisma.contentApproval.findMany({
      where: { contentId },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get user notifications
   */
  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(userId: string, notificationId: string) {
    const notif = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notif || notif.userId !== userId) {
      throw new NotFoundException(`Notification ${notificationId} not found`);
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  /**
   * Get audit logs for business (Section 9.3)
   */
  async getAuditLogs(businessId: string) {
    return this.prisma.auditLog.findMany({
      where: { businessId },
      include: {
        user: { select: { fullName: true, email: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
  }
}
