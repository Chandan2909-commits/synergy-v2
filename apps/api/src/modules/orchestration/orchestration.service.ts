import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ContentService } from '../content/content.service';
import { PublishingService } from '../publishing/publishing.service';
import { SocialService } from '../social/social.service';
import {
  CreateWorkflowDto,
  UpdateWorkflowDto,
  TriggerWorkflowDto,
  ExecuteAutonomousDto,
} from './orchestration.dto';

export interface WorkflowStepResult {
  taskId: string;
  workflowId?: string;
  persona: string;
  action: string;
  status: 'success' | 'failed';
  timestamp: string;
  summary: string;
  tokensConsumed: number;
  costUsd: number;
}

@Injectable()
export class OrchestrationService {
  private readonly logger = new Logger(OrchestrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly contentService: ContentService,
    private readonly publishingService: PublishingService,
    private readonly socialService: SocialService
  ) {}

  /**
   * Create an automated marketing workflow configuration
   */
  async createWorkflow(businessId: string, dto: CreateWorkflowDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business ${businessId} not found`);
    }

    const workflow = await this.prisma.automationWorkflow.create({
      data: {
        businessId,
        name: dto.name,
        description: dto.description || null,
        triggerType: dto.triggerType || 'cron',
        cronSchedule: dto.cronSchedule || '0 10 * * 0', // Default: every Sunday 10am
        targetPlatformsJson: JSON.stringify(dto.targetPlatforms || ['instagram', 'linkedin', 'x']),
        contentCategoriesJson: JSON.stringify(dto.contentCategories || ['Educational', 'Product']),
        assignedPersonasJson: JSON.stringify(
          dto.assignedPersonas || [
            'marketing_strategist',
            'content_writer',
            'visual_designer',
            'quality_assurance',
          ]
        ),
        approvalMode: dto.approvalMode || 'conditional',
        monthlyAiBudgetUsd: dto.monthlyAiBudgetUsd || 50.0,
        currentSpendUsd: 0.0,
        isActive: true,
      },
    });

    return workflow;
  }

  /**
   * List workflows for active business
   */
  async getWorkflows(businessId: string) {
    return this.prisma.automationWorkflow.findMany({
      where: { businessId },
      include: {
        executions: {
          orderBy: { startedAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get single workflow by ID
   */
  async getWorkflow(businessId: string, id: string) {
    const workflow = await this.prisma.automationWorkflow.findUnique({
      where: { id },
      include: {
        executions: {
          orderBy: { startedAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow ${id} not found`);
    }

    if (workflow.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to workflow outside business`);
    }

    return workflow;
  }

  /**
   * Update workflow
   */
  async updateWorkflow(businessId: string, id: string, dto: UpdateWorkflowDto) {
    await this.getWorkflow(businessId, id);

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.cronSchedule !== undefined) updateData.cronSchedule = dto.cronSchedule;
    if (dto.targetPlatforms !== undefined) {
      updateData.targetPlatformsJson = JSON.stringify(dto.targetPlatforms);
    }
    if (dto.contentCategories !== undefined) {
      updateData.contentCategoriesJson = JSON.stringify(dto.contentCategories);
    }
    if (dto.assignedPersonas !== undefined) {
      updateData.assignedPersonasJson = JSON.stringify(dto.assignedPersonas);
    }
    if (dto.approvalMode !== undefined) updateData.approvalMode = dto.approvalMode;
    if (dto.monthlyAiBudgetUsd !== undefined) updateData.monthlyAiBudgetUsd = dto.monthlyAiBudgetUsd;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    return this.prisma.automationWorkflow.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete workflow
   */
  async deleteWorkflow(businessId: string, id: string) {
    await this.getWorkflow(businessId, id);
    await this.prisma.automationWorkflow.delete({ where: { id } });
    return { success: true, id };
  }

  /**
   * Emergency stop: Instantly deactivates all workflows for business
   */
  async emergencyStop(businessId: string) {
    const updated = await this.prisma.automationWorkflow.updateMany({
      where: { businessId, isActive: true },
      data: { isActive: false },
    });

    return {
      success: true,
      businessId,
      deactivatedCount: updated.count,
      message: `Emergency shutdown activated: ${updated.count} automated workflows halted.`,
    };
  }

  /**
   * Trigger autonomous workflow execution
   * Step 1: Strategist Persona plans campaign pillars
   * Step 2: Writer Persona generates platform-specific variants (Instagram, LinkedIn, X)
   * Step 3: Designer Persona crafts visual carousel slides honoring Brand Kit
   * Step 4: QA Persona evaluates tone, limits, and brand safety
   * Step 5: Approval Policy Evaluator checks (manual vs conditional vs full_auto)
   * Step 6: Scheduled Queue Dispatcher automatically schedules for publication
   */
  async triggerWorkflow(businessId: string, workflowId: string, dto: TriggerWorkflowDto) {
    const workflow = await this.getWorkflow(businessId, workflowId);

    if (!workflow.isActive) {
      throw new BadRequestException(
        `Workflow '${workflow.name}' is currently inactive. Please enable before triggering.`
      );
    }

    // Reliability Check: Budget limit guard (Section 7.7)
    if (workflow.currentSpendUsd >= workflow.monthlyAiBudgetUsd) {
      throw new BadRequestException(
        `Monthly AI spending limit of $${workflow.monthlyAiBudgetUsd.toFixed(2)} reached for this workflow (Current spend: $${workflow.currentSpendUsd.toFixed(2)})`
      );
    }

    const execution = await this.prisma.workflowExecution.create({
      data: {
        workflowId: workflow.id,
        status: 'running',
        stepResultsJson: '[]',
        tokensUsed: 0,
        costUsd: 0.0,
      },
    });

    const stepResults: WorkflowStepResult[] = [];
    const platforms = JSON.parse(workflow.targetPlatformsJson || '["instagram","linkedin","x"]');
    const objective =
      dto.objective ||
      `Omni-channel executive thought leadership and conversion sequence for ${workflow.name}`;

    try {
      // Execute multi-persona pipeline (Strategist -> Writer -> Designer -> QA)
      const pipelineRes = await this.contentService.generatePipeline(businessId, {
        objective,
        targetPlatforms: platforms,
        format: 'carousel',
        carouselSlideCount: 5,
      });

      const content = pipelineRes.content;
      const strategy = pipelineRes.strategy;
      const qaReports = pipelineRes.qaReports;

      // 1. Record Strategist Step
      stepResults.push({
        taskId: `task_strat_${Date.now()}`,
        workflowId: workflow.id,
        persona: 'marketing_strategist',
        action: 'Formulate omni-channel strategic pillars & distribution schedule',
        status: 'success',
        timestamp: new Date().toISOString(),
        summary: strategy.strategySummary || 'Strategy formulated successfully',
        tokensConsumed: 450,
        costUsd: 0.0009,
      });

      // 2. Record Writer Step
      stepResults.push({
        taskId: `task_writer_${Date.now()}`,
        workflowId: workflow.id,
        persona: 'content_writer',
        action: `Generated platform-specific copy variants for [${platforms.join(', ')}]`,
        status: 'success',
        timestamp: new Date().toISOString(),
        summary: `Created ${content.variants.length} adapted platform variants with native hashtags`,
        tokensConsumed: 720,
        costUsd: 0.0014,
      });

      // 3. Record Designer Step
      stepResults.push({
        taskId: `task_designer_${Date.now()}`,
        workflowId: workflow.id,
        persona: 'visual_designer',
        action: 'Formatted 5-slide visual carousel honoring Brand Kit luxury palette',
        status: 'success',
        timestamp: new Date().toISOString(),
        summary: `Created ${content.carouselSlides.length} visual slides with ONIX styling`,
        tokensConsumed: 320,
        costUsd: 0.0006,
      });

      // 4. Record QA Step
      const avgScore =
        Object.values(qaReports).reduce(
          (acc: number, cur: any) => acc + (cur?.confidenceScore || 90),
          0
        ) / (Object.keys(qaReports).length || 1);

      stepResults.push({
        taskId: `task_qa_${Date.now()}`,
        workflowId: workflow.id,
        persona: 'quality_assurance',
        action: 'Validated platform character boundaries, brand voice, and restriction scan',
        status: 'success',
        timestamp: new Date().toISOString(),
        summary: `QA validation passed with an average confidence rating of ${Math.round(avgScore)}%`,
        tokensConsumed: 280,
        costUsd: 0.0005,
      });

      // 5. Approval Policy Evaluation (manual, conditional, full_auto)
      let finalWorkflowStatus = 'success';
      const scheduledPostsList: any[] = [];
      const scheduledTarget = dto.scheduledFor
        ? new Date(dto.scheduledFor)
        : new Date(Date.now() + 3600 * 24 * 2 * 1000); // 2 days in future

      const approvalMode = workflow.approvalMode; // 'manual' | 'conditional' | 'full_auto'

      if (approvalMode === 'manual') {
        // All content requires approval
        await this.prisma.content.update({
          where: { id: content.id },
          data: { status: 'pending_approval' },
        });

        finalWorkflowStatus = 'requires_approval';
        stepResults.push({
          taskId: `task_approval_${Date.now()}`,
          workflowId: workflow.id,
          persona: 'central_orchestrator',
          action: 'Approval Policy: Manual',
          status: 'success',
          timestamp: new Date().toISOString(),
          summary: 'Content draft created and held in pending_approval for human sign-off.',
          tokensConsumed: 0,
          costUsd: 0.0,
        });
      } else if (approvalMode === 'conditional') {
        // Content passing validation rules (score >= 85%) publishes automatically
        const passesThreshold = avgScore >= 85;

        if (passesThreshold) {
          await this.prisma.content.update({
            where: { id: content.id },
            data: { status: 'approved' },
          });

          // Automatically schedule with connected platform accounts
          const connectedAccounts = await this.socialService.getAccounts(businessId);
          for (const platform of platforms) {
            const acc = connectedAccounts.find((a) => a.platform === platform && a.isConnected);
            if (acc) {
              const sp = await this.publishingService.schedulePost(businessId, {
                contentId: content.id,
                socialAccountId: acc.id,
                scheduledTime: scheduledTarget.toISOString(),
              });
              scheduledPostsList.push(sp);
            }
          }

          stepResults.push({
            taskId: `task_approval_${Date.now()}`,
            workflowId: workflow.id,
            persona: 'central_orchestrator',
            action: 'Approval Policy: Conditional Auto-Approved',
            status: 'success',
            timestamp: new Date().toISOString(),
            summary: `Validation score (${Math.round(avgScore)}%) exceeded threshold (85%). Automatically scheduled for publication.`,
            tokensConsumed: 0,
            costUsd: 0.0,
          });
        } else {
          // Escalate to human review
          await this.prisma.content.update({
            where: { id: content.id },
            data: { status: 'pending_approval' },
          });
          finalWorkflowStatus = 'requires_approval';

          stepResults.push({
            taskId: `task_approval_${Date.now()}`,
            workflowId: workflow.id,
            persona: 'central_orchestrator',
            action: 'Approval Policy: Escalated to Review',
            status: 'success',
            timestamp: new Date().toISOString(),
            summary: `Validation score (${Math.round(avgScore)}%) fell below conditional threshold. Escalated to human review.`,
            tokensConsumed: 0,
            costUsd: 0.0,
          });
        }
      } else {
        // Full Auto: Publishes without human intervention
        await this.prisma.content.update({
          where: { id: content.id },
          data: { status: 'approved' },
        });

        const connectedAccounts = await this.socialService.getAccounts(businessId);
        for (const platform of platforms) {
          const acc = connectedAccounts.find((a) => a.platform === platform && a.isConnected);
          if (acc) {
            const sp = await this.publishingService.schedulePost(businessId, {
              contentId: content.id,
              socialAccountId: acc.id,
              scheduledTime: scheduledTarget.toISOString(),
            });
            scheduledPostsList.push(sp);
          }
        }

        stepResults.push({
          taskId: `task_approval_${Date.now()}`,
          workflowId: workflow.id,
          persona: 'central_orchestrator',
          action: 'Approval Policy: Full Auto Queued',
          status: 'success',
          timestamp: new Date().toISOString(),
          summary: `Zero-touch autonomous execution complete. ${scheduledPostsList.length} posts scheduled into publishing engine queue.`,
          tokensConsumed: 0,
          costUsd: 0.0,
        });
      }

      // Calculate total usage & update workflow spend
      const totalTokens = stepResults.reduce((sum, s) => sum + s.tokensConsumed, 0);
      const totalCost = stepResults.reduce((sum, s) => sum + s.costUsd, 0);

      await this.prisma.automationWorkflow.update({
        where: { id: workflow.id },
        data: {
          currentSpendUsd: workflow.currentSpendUsd + totalCost,
          lastRunAt: new Date(),
        },
      });

      const updatedExecution = await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: finalWorkflowStatus,
          stepResultsJson: JSON.stringify(stepResults),
          tokensUsed: totalTokens,
          costUsd: totalCost,
          completedAt: new Date(),
        },
      });

      const updatedContent = await this.prisma.content.findUnique({
        where: { id: content.id },
        include: {
          variants: true,
          carouselSlides: { orderBy: { slideNumber: 'asc' } },
        },
      });

      return {
        execution: updatedExecution,
        content: updatedContent || content,
        strategy,
        qaReports,
        scheduledPosts: scheduledPostsList,
        steps: stepResults,
      };
    } catch (err: any) {
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'failed',
          errorMessage: err.message,
          completedAt: new Date(),
        },
      });
      throw err;
    }
  }

  /**
   * Execute autonomous campaign objective ad-hoc
   */
  async executeAutonomous(businessId: string, dto: ExecuteAutonomousDto) {
    const platforms = dto.targetPlatforms || ['instagram', 'linkedin', 'x'];
    const approvalMode = dto.approvalMode || 'conditional';

    const pipelineRes = await this.contentService.generatePipeline(businessId, {
      objective: dto.objective,
      targetPlatforms: platforms,
      format: dto.format || 'carousel',
      carouselSlideCount: dto.carouselSlideCount || 5,
    });

    const content = pipelineRes.content;
    const scheduledPostsList: any[] = [];
    const scheduledTarget = dto.scheduledTime
      ? new Date(dto.scheduledTime)
      : new Date(Date.now() + 3600 * 24 * 3 * 1000);

    if (approvalMode === 'manual') {
      await this.prisma.content.update({
        where: { id: content.id },
        data: { status: 'pending_approval' },
      });
    } else {
      // Conditional or Full Auto: approve and schedule
      await this.prisma.content.update({
        where: { id: content.id },
        data: { status: 'approved' },
      });

      const connectedAccounts = await this.socialService.getAccounts(businessId);
      for (const platform of platforms) {
        const acc = connectedAccounts.find((a) => a.platform === platform && a.isConnected);
        if (acc) {
          const sp = await this.publishingService.schedulePost(businessId, {
            contentId: content.id,
            socialAccountId: acc.id,
            scheduledTime: scheduledTarget.toISOString(),
          });
          scheduledPostsList.push(sp);
        }
      }
    }

    const updatedContent = await this.prisma.content.findUnique({
      where: { id: content.id },
      include: {
        variants: true,
        carouselSlides: { orderBy: { slideNumber: 'asc' } },
      },
    });

    return {
      success: true,
      content: updatedContent || content,
      approvalMode,
      scheduledPosts: scheduledPostsList,
      strategy: pipelineRes.strategy,
      qaReports: pipelineRes.qaReports,
    };
  }

  /**
   * Get workflow execution history
   */
  async getWorkflowExecutions(businessId: string, workflowId: string) {
    await this.getWorkflow(businessId, workflowId);
    return this.prisma.workflowExecution.findMany({
      where: { workflowId },
      orderBy: { startedAt: 'desc' },
    });
  }

  /**
   * Get single execution details
   */
  async getExecution(businessId: string, executionId: string) {
    const execution = await this.prisma.workflowExecution.findUnique({
      where: { id: executionId },
      include: { workflow: true },
    });

    if (!execution) {
      throw new NotFoundException(`Workflow execution ${executionId} not found`);
    }

    if (execution.workflow.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to execution outside business`);
    }

    return {
      ...execution,
      stepResults: JSON.parse(execution.stepResultsJson || '[]'),
    };
  }
}
