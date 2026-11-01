import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, TenantGuard],
  exports: [AuthService, JwtAuthGuard, TenantGuard],
})
export class AuthModule {}

