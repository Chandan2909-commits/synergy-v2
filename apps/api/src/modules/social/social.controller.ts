import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { SocialService } from './social.service';
import {
  ConnectAccountDto,
  OAuthCallbackDto,
  ValidatePostDto,
  PublishNowDto,
} from './social.dto';
import { SocialPlatform } from '@synergy/types';

@Controller('social')
@UseGuards(JwtAuthGuard, TenantGuard)
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get('accounts')
  async getAccounts(@Headers('x-business-id') businessId: string) {
    return this.socialService.getAccounts(businessId);
  }

  @Post('accounts/connect')
  async connectAccount(
    @Headers('x-business-id') businessId: string,
    @Body() dto: ConnectAccountDto
  ) {
    return this.socialService.connectAccount(businessId, dto);
  }

  @Get('oauth/:platform/url')
  async getOAuthUrl(
    @Headers('x-business-id') businessId: string,
    @Param('platform') platform: SocialPlatform,
    @Query('redirectUri') redirectUri: string
  ) {
    return this.socialService.getOAuthUrl(
      businessId,
      platform,
      redirectUri || 'http://localhost:3000/settings/connections/callback'
    );
  }

  @Post('oauth/:platform/callback')
  async handleOAuthCallback(
    @Headers('x-business-id') businessId: string,
    @Param('platform') platform: SocialPlatform,
    @Body() dto: OAuthCallbackDto
  ) {
    return this.socialService.handleOAuthCallback(businessId, platform, dto);
  }

  @Post('accounts/:id/test-connection')
  async testConnection(
    @Headers('x-business-id') businessId: string,
    @Param('id') accountId: string
  ) {
    return this.socialService.testConnection(businessId, accountId);
  }

  @Post('accounts/:id/disconnect')
  async disconnectAccount(
    @Headers('x-business-id') businessId: string,
    @Param('id') accountId: string
  ) {
    return this.socialService.disconnectAccount(businessId, accountId);
  }

  @Post('validate-post')
  async validateContent(@Body() dto: ValidatePostDto) {
    return this.socialService.validateContent(dto);
  }

  @Post('publish-now')
  async publishNow(
    @Headers('x-business-id') businessId: string,
    @Body() dto: PublishNowDto
  ) {
    return this.socialService.publishNow(businessId, dto);
  }
}

