import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { AIProviderFactory } from './providers/provider.factory';
import { StrategistPersonaEngine } from './personas/strategist.persona';
import { WriterPersonaEngine } from './personas/writer.persona';
import { DesignerPersonaEngine } from './personas/designer.persona';
import { QAPersonaEngine } from './personas/qa.persona';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Module({
  controllers: [AIController],
  providers: [
    AIService,
    AIProviderFactory,
    StrategistPersonaEngine,
    WriterPersonaEngine,
    DesignerPersonaEngine,
    QAPersonaEngine,
    JwtAuthGuard,
    TenantGuard,
  ],
  exports: [AIService, AIProviderFactory],
})
export class AIModule {}

