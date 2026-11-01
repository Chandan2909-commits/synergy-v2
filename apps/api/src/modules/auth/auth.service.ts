import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  RegisterDto,
  LoginDto,
  CreateBusinessDto,
  InviteMemberDto,
  UpdateBrandKitDto,
} from './auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { slugify } from '@synergy/shared';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private getJwtSecret(): string {
    return (
      process.env.JWT_SECRET ||
      'super_secret_synergy_jwt_signing_key_local_dev_only_min_32_chars'
    );
  }

  private generateToken(payload: { userId: string; email: string; orgId: string }): string {
    return jwt.sign(payload, this.getJwtSecret(), { expiresIn: '7d' });
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const orgSlug = `${slugify(dto.organizationName)}-${Math.random().toString(36).substring(2, 6)}`;

    // Create User, Organization, Membership, initial Business & BrandKit in transaction
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        fullName: dto.fullName,
      },
    });

    const organization = await this.prisma.organization.create({
      data: {
        name: dto.organizationName,
        slug: orgSlug,
        ownerId: user.id,
      },
    });

    await this.prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: 'org_admin',
      },
    });

    const bizName = dto.initialBusinessName || `${dto.organizationName} Main`;
    const bizSlug = `${slugify(bizName)}-${Math.random().toString(36).substring(2, 6)}`;

    const business = await this.prisma.business.create({
      data: {
        organizationId: organization.id,
        name: bizName,
        slug: bizSlug,
        industry: dto.industry || 'General Business',
      },
    });

    await this.prisma.businessMember.create({
      data: {
        userId: user.id,
        businessId: business.id,
        role: 'business_admin',
      },
    });

    // Initialize Default Brand Kit
    await this.prisma.brandKit.create({
      data: {
        businessId: business.id,
        brandName: bizName,
        tagline: 'Sustainable, intelligent marketing operations',
        primaryColor: '#1e1e1e',
        secondaryColor: '#f4f5f7',
        accentColor: '#1d4ed8',
        backgroundColor: '#ffffff',
        headingFont: 'Montserrat',
        bodyFont: 'Inter',
        brandVoiceJson: JSON.stringify(['Visionary', 'Professional', 'Data-Driven']),
        targetAudience: 'High-growth founders, agencies, and marketing leaders',
        productsJson: JSON.stringify(['AI Marketing Operations Platform']),
        preferredHashtagsJson: JSON.stringify(['#Synergy', '#AIMarketing', '#CrossTech']),
        restrictionsJson: JSON.stringify(['No misleading claims', 'No spam tone']),
      },
    });

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      orgId: organization.id,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
      business: {
        id: business.id,
        name: business.name,
        slug: business.slug,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        memberships: {
          include: {
            organization: {
              include: {
                businesses: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const defaultMembership = user.memberships[0];
    const defaultOrg = defaultMembership?.organization;
    const defaultBusiness = defaultOrg?.businesses[0];

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      orgId: defaultOrg?.id || '',
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: defaultMembership?.role || 'viewer',
      },
      organization: defaultOrg
        ? { id: defaultOrg.id, name: defaultOrg.name, slug: defaultOrg.slug }
        : null,
      business: defaultBusiness
        ? { id: defaultBusiness.id, name: defaultBusiness.name, slug: defaultBusiness.slug }
        : null,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        createdAt: true,
        memberships: {
          include: {
            organization: {
              include: {
                businesses: {
                  include: {
                    brandKit: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found.');
    }

    return user;
  }

  async createBusiness(userId: string, orgId: string, dto: CreateBusinessDto) {
    // Check membership
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: orgId,
        },
      },
    });

    if (!membership || (membership.role !== 'org_admin' && membership.role !== 'super_admin')) {
      throw new ForbiddenException('Only organization administrators can create new business workspaces.');
    }

    const bizSlug = `${slugify(dto.name)}-${Math.random().toString(36).substring(2, 6)}`;

    const business = await this.prisma.business.create({
      data: {
        organizationId: orgId,
        name: dto.name,
        slug: bizSlug,
        description: dto.description,
        industry: dto.industry || 'General',
        timezone: dto.timezone || 'UTC',
      },
    });

    await this.prisma.businessMember.create({
      data: {
        userId,
        businessId: business.id,
        role: 'business_admin',
      },
    });

    await this.prisma.brandKit.create({
      data: {
        businessId: business.id,
        brandName: dto.name,
        tagline: dto.description || 'Branded marketing workspace',
        primaryColor: '#1e1e1e',
        secondaryColor: '#f4f5f7',
        accentColor: '#1d4ed8',
        backgroundColor: '#ffffff',
        headingFont: 'Montserrat',
        bodyFont: 'Inter',
        brandVoiceJson: JSON.stringify(['Visionary', 'Professional']),
        targetAudience: 'Target market profile',
      },
    });

    return business;
  }

  async getBusinessesForUser(userId: string, orgId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: orgId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this organization.');
    }

    if (membership.role === 'org_admin' || membership.role === 'super_admin') {
      return this.prisma.business.findMany({
        where: { organizationId: orgId },
        include: { brandKit: true },
      });
    }

    // Scoped member: return only assigned businesses
    return this.prisma.business.findMany({
      where: {
        organizationId: orgId,
        members: {
          some: { userId },
        },
      },
      include: { brandKit: true },
    });
  }

  async getBrandKit(businessId: string) {
    const brandKit = await this.prisma.brandKit.findUnique({
      where: { businessId },
    });

    if (!brandKit) {
      throw new NotFoundException('Brand Kit not found for this business.');
    }

    return {
      ...brandKit,
      brandVoice: JSON.parse(brandKit.brandVoiceJson || '[]'),
      productsAndServices: JSON.parse(brandKit.productsJson || '[]'),
      preferredHashtags: JSON.parse(brandKit.preferredHashtagsJson || '[]'),
      contentRestrictions: JSON.parse(brandKit.restrictionsJson || '[]'),
    };
  }

  async updateBrandKit(businessId: string, dto: UpdateBrandKitDto) {
    const brandKit = await this.prisma.brandKit.update({
      where: { businessId },
      data: {
        brandName: dto.brandName,
        tagline: dto.tagline,
        websiteUrl: dto.websiteUrl,
        logoUrl: dto.logoUrl,
        iconUrl: dto.iconUrl,
        primaryColor: dto.primaryColor,
        secondaryColor: dto.secondaryColor,
        accentColor: dto.accentColor,
        backgroundColor: dto.backgroundColor,
        headingFont: dto.headingFont,
        bodyFont: dto.bodyFont,
        brandVoiceJson: dto.brandVoice ? JSON.stringify(dto.brandVoice) : undefined,
        targetAudience: dto.targetAudience,
        productsJson: dto.productsAndServices ? JSON.stringify(dto.productsAndServices) : undefined,
        preferredHashtagsJson: dto.preferredHashtags ? JSON.stringify(dto.preferredHashtags) : undefined,
        restrictionsJson: dto.contentRestrictions ? JSON.stringify(dto.contentRestrictions) : undefined,
      },
    });

    return brandKit;
  }

  async inviteMember(inviterId: string, orgId: string, dto: InviteMemberDto) {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: inviterId,
          organizationId: orgId,
        },
      },
    });

    if (!membership || (membership.role !== 'org_admin' && membership.role !== 'super_admin')) {
      throw new ForbiddenException('Only organization administrators can invite new members.');
    }

    const token = `inv_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await this.prisma.invitation.create({
      data: {
        organizationId: orgId,
        email: dto.email.toLowerCase(),
        role: dto.role || 'marketing_manager',
        token,
        invitedByUserId: inviterId,
        expiresAt,
      },
    });

    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      token: invitation.token,
      expiresAt: invitation.expiresAt,
    };
  }
}

