import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId) {
      throw new ForbiddenException('User session not authenticated');
    }

    const businessId =
      request.headers['x-business-id'] ||
      request.params.businessId ||
      request.params.id ||
      request.query.businessId;

    if (!businessId) {
      return true; // No business scope requested; controller handles org level
    }

    // Check if the user is a super_admin, org_admin of the business's org, or direct business member
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        organization: {
          include: {
            memberships: {
              where: { userId: user.userId },
            },
          },
        },
        members: {
          where: { userId: user.userId },
        },
      },
    });

    if (!business) {
      throw new ForbiddenException('The requested business workspace does not exist.');
    }

    const orgMembership = business.organization.memberships[0];
    const isOrgAdmin = orgMembership && (orgMembership.role === 'org_admin' || orgMembership.role === 'super_admin');
    const isDirectMember = business.members.length > 0;

    if (!isOrgAdmin && !isDirectMember) {
      throw new ForbiddenException(
        'Cross-tenant violation: You do not have permissions to access this business workspace.'
      );
    }

    request.business = business;
    return true;
  }
}

