import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { AIService } from './ai.service';
import {
  ConfigurePersonaDto,
  TestConnectionDto,
  ExecuteStrategistDto,
  ExecuteWriterDto,
  ExecuteDesignerDto,
  ExecuteQADto,
} from './ai.dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('personas')
  getPersonas() {
    return this.aiService.getPersonas();
  }

  @UseGuards(JwtAuthGuard)
  @Post('personas/:role/configure')
  configurePersona(
    @Param('role') role: string,
    @Body() dto: ConfigurePersonaDto
  ) {
    return this.aiService.configurePersona(role, dto);
  }

  @Post('test-connection')
  testConnection(@Body() dto: TestConnectionDto) {
    return this.aiService.testConnection(dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post('personas/strategist/execute')
  executeStrategist(
    @Headers('x-business-id') businessId: string,
    @Body() dto: ExecuteStrategistDto
  ) {
    if (!businessId) {
      throw new BadRequestException('X-Business-ID header is required.');
    }
    return this.aiService.executeStrategist(businessId, dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post('personas/writer/execute')
  executeWriter(
    @Headers('x-business-id') businessId: string,
    @Body() dto: ExecuteWriterDto
  ) {
    if (!businessId) {
      throw new BadRequestException('X-Business-ID header is required.');
    }
    return this.aiService.executeWriter(businessId, dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post('personas/designer/execute')
  executeDesigner(
    @Headers('x-business-id') businessId: string,
    @Body() dto: ExecuteDesignerDto
  ) {
    if (!businessId) {
      throw new BadRequestException('X-Business-ID header is required.');
    }
    return this.aiService.executeDesigner(businessId, dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post('personas/qa/execute')
  executeQA(
    @Headers('x-business-id') businessId: string,
    @Body() dto: ExecuteQADto
  ) {
    if (!businessId) {
      throw new BadRequestException('X-Business-ID header is required.');
    }
    return this.aiService.executeQA(businessId, dto);
  }

  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get('usage')
  getUsage(@Headers('x-business-id') businessId: string) {
    if (!businessId) {
      throw new BadRequestException('X-Business-ID header is required.');
    }
    return this.aiService.getUsage(businessId);
  }
}

