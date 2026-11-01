import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  Param,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  CreateBusinessDto,
  InviteMemberDto,
  UpdateBrandKitDto,
} from './auth.dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('auth/login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  getMe(@Req() req: any) {
    return this.authService.getMe(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('businesses')
  getBusinesses(
    @Req() req: any,
    @Headers('x-organization-id') headerOrgId?: string
  ) {
    const orgId = headerOrgId || req.user.orgId;
    return this.authService.getBusinessesForUser(req.user.userId, orgId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('businesses')
  createBusiness(
    @Req() req: any,
    @Body() dto: CreateBusinessDto,
    @Headers('x-organization-id') headerOrgId?: string
  ) {
    const orgId = headerOrgId || req.user.orgId;
    return this.authService.createBusiness(req.user.userId, orgId, dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get('businesses/:id/brand-kit')
  getBrandKit(@Param('id') id: string) {
    return this.authService.getBrandKit(id);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Put('businesses/:id/brand-kit')
  updateBrandKit(@Param('id') id: string, @Body() dto: UpdateBrandKitDto) {
    return this.authService.updateBrandKit(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('organizations/:id/invitations')
  inviteMember(
    @Req() req: any,
    @Param('id') orgId: string,
    @Body() dto: InviteMemberDto
  ) {
    return this.authService.inviteMember(req.user.userId, orgId, dto);
  }
}

