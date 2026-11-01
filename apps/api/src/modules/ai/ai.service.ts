import {
  Injectable,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AIProviderFactory } from './providers/provider.factory';
import { StrategistPersonaEngine } from './personas/strategist.persona';
import { WriterPersonaEngine } from './personas/writer.persona';
import { DesignerPersonaEngine } from './personas/designer.persona';
import { QAPersonaEngine } from './personas/qa.persona';
import {
  ConfigurePersonaDto,
  TestConnectionDto,
  ExecuteStrategistDto,
  ExecuteWriterDto,
  ExecuteDesignerDto,
  ExecuteQADto,
} from './ai.dto';
import { encrypt, decrypt, maskApiKey } from '../../common/utils/encryption.util';
import { MVP_PERSONAS } from '@synergy/shared';
import { BrandKit, SocialPlatform } from '@synergy/types';

@Injectable()
export class AIService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerFactory: AIProviderFactory,
    private readonly strategistEngine: StrategistPersonaEngine,
    private readonly writerEngine: WriterPersonaEngine,
    private readonly designerEngine: DesignerPersonaEngine,
    private readonly qaEngine: QAPersonaEngine
  ) {}

  async onModuleInit() {
    // Seed the 4 MVP Personas if not already initialized
    for (const p of MVP_PERSONAS) {
      const existing = await this.prisma.aIPersona.findUnique({
        where: { role: p.role },
      });

      if (!existing) {
        await this.prisma.aIPersona.create({
          data: {
            role: p.role,
            name: p.title,
            description: p.description,
            defaultProvider: p.provider,
            defaultModel: p.defaultModel,
            defaultTemperature: 0.7,
            systemInstructions: `You are the ${p.title} for the business. Execute with high professionalism.`,
          },
        });
      }
    }
  }

  async getPersonas() {
    const personas = await this.prisma.aIPersona.findMany();
    return personas.map((p) => ({
      id: p.id,
      role: p.role,
      name: p.name,
      description: p.description,
      provider: p.defaultProvider,
      model: p.defaultModel,
      temperature: p.defaultTemperature,
      systemInstructions: p.systemInstructions,
    }));
  }

  async configurePersona(role: string, dto: ConfigurePersonaDto) {
    const persona = await this.prisma.aIPersona.findUnique({
      where: { role },
    });

    if (!persona) {
      throw new NotFoundException(`Persona ${role} not found.`);
    }

    const updated = await this.prisma.aIPersona.update({
      where: { role },
      data: {
        defaultProvider: dto.provider,
        defaultModel: dto.model,
        defaultTemperature: dto.temperature,
        systemInstructions: dto.systemInstructions,
      },
    });

    return updated;
  }

  async testConnection(dto: TestConnectionDto): Promise<{ success: boolean; message: string }> {
    const provider = this.providerFactory.getProvider(dto.provider);
    const isSuccess = await provider.testConnection(dto.apiKey);

    return {
      success: isSuccess,
      message: isSuccess
        ? `Successfully verified connection to ${dto.provider.toUpperCase()} API engine.`
        : `Connection test failed for ${dto.provider}. Please verify API key format.`,
    };
  }

  private async getBrandKitHelper(businessId: string): Promise<BrandKit> {
    const bk = await this.prisma.brandKit.findUnique({
      where: { businessId },
    });

    if (!bk) {
      throw new NotFoundException(`Brand Kit not found for business: ${businessId}`);
    }

    return {
      id: bk.id,
      businessId: bk.businessId,
      brandName: bk.brandName,
      tagline: bk.tagline || '',
      websiteUrl: bk.websiteUrl || '',
      colors: {
        primary: bk.primaryColor,
        secondary: bk.secondaryColor,
        accent: bk.accentColor,
        background: bk.backgroundColor,
      },
      typography: {
        headingFont: bk.headingFont,
        bodyFont: bk.bodyFont,
      },
      brandVoice: JSON.parse(bk.brandVoiceJson || '[]'),
      targetAudience: bk.targetAudience,
      productsAndServices: JSON.parse(bk.productsJson || '[]'),
      preferredHashtags: JSON.parse(bk.preferredHashtagsJson || '[]'),
      contentRestrictions: JSON.parse(bk.restrictionsJson || '[]'),
      updatedAt: bk.updatedAt.toISOString(),
    };
  }

  async executeStrategist(businessId: string, dto: ExecuteStrategistDto) {
    const brandKit = await this.getBrandKitHelper(businessId);
    const persona = await this.prisma.aIPersona.findUnique({
      where: { role: 'marketing_strategist' },
    });

    const providerName = persona?.defaultProvider || 'openai';
    const provider = this.providerFactory.getProvider(providerName);

    return this.strategistEngine.execute(
      provider,
      {
        businessName: brandKit.brandName,
        brandKit,
        campaignGoal: dto.campaignGoal,
        targetPlatforms: dto.targetPlatforms as SocialPlatform[],
      },
      persona?.defaultModel
    );
  }

  async executeWriter(businessId: string, dto: ExecuteWriterDto) {
    const brandKit = await this.getBrandKitHelper(businessId);
    const persona = await this.prisma.aIPersona.findUnique({
      where: { role: 'content_writer' },
    });

    const providerName = persona?.defaultProvider || 'gemini';
    const provider = this.providerFactory.getProvider(providerName);

    return this.writerEngine.execute(
      provider,
      {
        brandKit,
        topic: dto.topic,
        format: dto.format || 'text',
        targetPlatform: dto.targetPlatform as SocialPlatform,
        keyTakeaway: dto.keyTakeaway,
        carouselSlideCount: dto.carouselSlideCount,
      },
      persona?.defaultModel
    );
  }

  async executeDesigner(businessId: string, dto: ExecuteDesignerDto) {
    const brandKit = await this.getBrandKitHelper(businessId);
    const persona = await this.prisma.aIPersona.findUnique({
      where: { role: 'visual_designer' },
    });

    const providerName = persona?.defaultProvider || 'openai';
    const provider = this.providerFactory.getProvider(providerName);

    return this.designerEngine.execute(provider, {
      brandKit,
      headline: dto.headline,
      bodyText: dto.bodyText,
      visualConcept: dto.visualConcept,
      generateImage: dto.generateImage,
    });
  }

  async executeQA(businessId: string, dto: ExecuteQADto) {
    const brandKit = await this.getBrandKitHelper(businessId);
    const persona = await this.prisma.aIPersona.findUnique({
      where: { role: 'quality_assurance' },
    });

    const providerName = persona?.defaultProvider || 'anthropic';
    const provider = this.providerFactory.getProvider(providerName);

    return this.qaEngine.execute(
      provider,
      {
        brandKit,
        targetPlatform: dto.targetPlatform as SocialPlatform,
        content: {
          caption: dto.caption,
          hashtags: dto.hashtags || [],
          hasMedia: false,
        },
      },
      persona?.defaultModel
    );
  }

  async getUsage(businessId: string) {
    return {
      businessId,
      monthlyBudgetUsd: 150.0,
      currentMonthSpendUsd: 28.45,
      tokensConsumed: 184200,
      personaBreakdown: [
        { role: 'marketing_strategist', tokens: 42000, costUsd: 8.4 },
        { role: 'content_writer', tokens: 84000, costUsd: 6.2 },
        { role: 'visual_designer', tokens: 18200, costUsd: 11.4 },
        { role: 'quality_assurance', tokens: 40000, costUsd: 2.45 },
      ],
    };
  }
}

