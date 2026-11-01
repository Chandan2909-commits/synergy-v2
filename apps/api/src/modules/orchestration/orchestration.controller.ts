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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { OrchestrationService } from './orchestration.service';
import {
  CreateWorkflowDto,
  UpdateWorkflowDto,
  TriggerWorkflowDto,
  ExecuteAutonomousDto,
} from './orchestration.dto';

@Controller('orchestration')
@UseGuards(JwtAuthGuard, TenantGuard)
export class OrchestrationController {
  constructor(private readonly orchestrationService: OrchestrationService) {}

  @Post('workflows')
  async createWorkflow(
    @Headers('x-business-id') businessId: string,
    @Body() dto: CreateWorkflowDto
  ) {
    return this.orchestrationService.createWorkflow(businessId, dto);
  }

  @Get('workflows')
  async getWorkflows(@Headers('x-business-id') businessId: string) {
    return this.orchestrationService.getWorkflows(businessId);
  }

  @Get('workflows/:id')
  async getWorkflow(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string
  ) {
    return this.orchestrationService.getWorkflow(businessId, id);
  }

  @Put('workflows/:id')
  async updateWorkflow(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWorkflowDto
  ) {
    return this.orchestrationService.updateWorkflow(businessId, id, dto);
  }

  @Delete('workflows/:id')
  async deleteWorkflow(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string
  ) {
    return this.orchestrationService.deleteWorkflow(businessId, id);
  }

  @Post('workflows/:id/trigger')
  async triggerWorkflow(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string,
    @Body() dto: TriggerWorkflowDto
  ) {
    return this.orchestrationService.triggerWorkflow(businessId, id, dto);
  }

  @Post('execute-autonomous')
  async executeAutonomous(
    @Headers('x-business-id') businessId: string,
    @Body() dto: ExecuteAutonomousDto
  ) {
    return this.orchestrationService.executeAutonomous(businessId, dto);
  }

  @Post('emergency-stop')
  async emergencyStop(@Headers('x-business-id') businessId: string) {
    return this.orchestrationService.emergencyStop(businessId);
  }

  @Get('workflows/:id/executions')
  async getWorkflowExecutions(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string
  ) {
    return this.orchestrationService.getWorkflowExecutions(businessId, id);
  }

  @Get('executions/:id')
  async getExecution(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string
  ) {
    return this.orchestrationService.getExecution(businessId, id);
  }
}

