import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AIService } from '../ai/ai.service';
import {
  GenerateContentPipelineDto,
  CreateDraftDto,
  UpdateContentDto,
  CreateSlideDto,
  UpdateSlideDto,
  UploadMediaDto,
} from './content.dto';
import { SocialPlatform } from '@synergy/types';

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AIService
  ) {}

  /**
   * Complete multi-persona content production pipeline:
   * 1. Strategist plans campaign angle and pillars
   * 2. Writer adapts content per platform (Instagram, LinkedIn, X)
   * 3. Designer generates visual specs & carousel slides
   * 4. QA validates quality, tone, and character limits
   * 5. Saves atomically as draft with variants & slides
   */
  async generatePipeline(businessId: string, dto: GenerateContentPipelineDto) {
    // 1. Verify business & get brand kit
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: { brandKit: true },
    });

    if (!business) {
      throw new NotFoundException(`Business ${businessId} not found`);
    }

    const brandKit = business.brandKit;
    const platforms = dto.targetPlatforms || ['instagram', 'linkedin', 'x'];

    // Step 1: Strategist Persona
    const strategyResult = await this.aiService.executeStrategist(businessId, {
      campaignGoal: dto.objective,
      targetPlatforms: platforms as SocialPlatform[],
    });

    // Step 2: Writer Persona - Generate tailored copy for each platform
    const platformVariants: Record<string, { text: string; hashtags: string[] }> = {};
    const slideOutlines: { slideNumber: number; headline: string; bodyText: string }[] = [];

    for (const platform of platforms) {
      const isCarousel = dto.format === 'carousel' || platform === 'instagram';
      const writerResult = await this.aiService.executeWriter(businessId, {
        topic: dto.objective,
        format: isCarousel ? 'carousel' : 'text',
        targetPlatform: platform as SocialPlatform,
        keyTakeaway: strategyResult.contentPillars?.[0]?.pillar || dto.objective,
        carouselSlideCount: dto.carouselSlideCount || 5,
      });

      platformVariants[platform] = {
        text: writerResult.caption,
        hashtags: writerResult.hashtags,
      };

      if (isCarousel && writerResult.carouselSlides && writerResult.carouselSlides.length > 0 && slideOutlines.length === 0) {
        writerResult.carouselSlides.forEach((s) => slideOutlines.push(s));
      }
    }

    // Step 3: Designer Persona - Format visual carousel slides
    const slideCount = dto.carouselSlideCount || (slideOutlines.length > 0 ? slideOutlines.length : 5);
    const finalSlides: {
      slideNumber: number;
      headline: string;
      bodyText: string;
      imageUrl?: string;
      callToAction?: string;
      backgroundColor?: string;
      textColor?: string;
    }[] = [];

    const primaryColor = brandKit?.primaryColor || '#1e1e1e';
    const accentColor = brandKit?.accentColor || '#1d4ed8';
    const bgLight = brandKit?.backgroundColor || '#ffffff';

    for (let i = 1; i <= slideCount; i++) {
      const outline = slideOutlines.find((s) => s.slideNumber === i) || {
        headline: i === 1 ? dto.objective : `Key Principle #${i - 1}`,
        bodyText: `Actionable strategic insight detailing step ${i} for ${business.name}.`,
      };

      const designerResult = await this.aiService.executeDesigner(businessId, {
        headline: outline.headline,
        bodyText: outline.bodyText,
        visualConcept: `Slide ${i} of ${slideCount} for campaign: ${dto.objective}`,
        generateImage: dto.generateImages ?? false,
      });

      // Cover slide and final CTA slide use signature high-contrast dark accent; middle slides use clean executive light
      const isHeroSlide = i === 1 || i === slideCount;
      finalSlides.push({
        slideNumber: i,
        headline: outline.headline,
        bodyText: outline.bodyText,
        imageUrl: designerResult.imageUrl || undefined,
        callToAction: i === slideCount ? 'Follow for more executive growth strategies' : undefined,
        backgroundColor: isHeroSlide ? primaryColor : bgLight,
        textColor: isHeroSlide ? '#ffffff' : '#111827',
      });
    }

    // Step 4: QA Persona - Validate compliance across platforms
    const qaReports: Record<string, any> = {};
    for (const platform of platforms) {
      const copy = platformVariants[platform];
      const qaResult = await this.aiService.executeQA(businessId, {
        targetPlatform: platform as SocialPlatform,
        caption: copy.text,
        hashtags: copy.hashtags,
      });
      qaReports[platform] = qaResult;
    }

    // Step 5: Save Content, Variants, and Carousel Slides atomically
    const masterText = platformVariants['linkedin']?.text || platformVariants[platforms[0]]?.text || dto.objective;

    const content = await this.prisma.content.create({
      data: {
        businessId,
        campaignId: dto.campaignId || null,
        title: dto.objective.length > 60 ? `${dto.objective.substring(0, 57)}...` : dto.objective,
        masterCopy: masterText,
        targetPlatformsJson: JSON.stringify(platforms),
        status: 'draft',
        createdByRole: 'ai_pipeline',
        variants: {
          create: platforms.map((p) => ({
            platform: p,
            text: platformVariants[p].text,
            hashtagsJson: JSON.stringify(platformVariants[p].hashtags),
          })),
        },
        carouselSlides: {
          create: finalSlides.map((s) => ({
            slideNumber: s.slideNumber,
            headline: s.headline,
            bodyText: s.bodyText,
            imageUrl: s.imageUrl || null,
            callToAction: s.callToAction || null,
            backgroundColor: s.backgroundColor || '#1e1e1e',
            textColor: s.textColor || '#ffffff',
          })),
        },
      },
      include: {
        variants: true,
        carouselSlides: {
          orderBy: { slideNumber: 'asc' },
        },
      },
    });

    return {
      content,
      strategy: strategyResult,
      qaReports,
    };
  }

  /**
   * Create a draft manually or save editor output
   */
  async createDraft(businessId: string, dto: CreateDraftDto) {
    const platforms = dto.targetPlatforms || ['linkedin'];

    const content = await this.prisma.content.create({
      data: {
        businessId,
        campaignId: dto.campaignId || null,
        title: dto.title,
        masterCopy: dto.masterCopy,
        targetPlatformsJson: JSON.stringify(platforms),
        status: 'draft',
        createdByRole: 'user',
        variants: {
          create: platforms.map((platform) => {
            const variantData = dto.variants?.[platform];
            return {
              platform,
              text: variantData?.text || dto.masterCopy,
              hashtagsJson: JSON.stringify(variantData?.hashtags || []),
            };
          }),
        },
        carouselSlides: {
          create: (dto.carouselSlides || []).map((slide, index) => ({
            slideNumber: slide.slideNumber || index + 1,
            headline: slide.headline,
            bodyText: slide.bodyText,
            imageUrl: slide.imageUrl || null,
            callToAction: slide.callToAction || null,
            backgroundColor: slide.backgroundColor || '#1e1e1e',
            textColor: slide.textColor || '#ffffff',
          })),
        },
      },
      include: {
        variants: true,
        carouselSlides: {
          orderBy: { slideNumber: 'asc' },
        },
      },
    });

    return content;
  }

  /**
   * List contents for a business
   */
  async findAll(businessId: string, query?: { status?: string; search?: string; campaignId?: string }) {
    const where: any = { businessId };

    if (query?.status) {
      where.status = query.status;
    }
    if (query?.campaignId) {
      where.campaignId = query.campaignId;
    }
    if (query?.search) {
      where.OR = [
        { title: { contains: query.search } },
        { masterCopy: { contains: query.search } },
      ];
    }

    return this.prisma.content.findMany({
      where,
      include: {
        variants: true,
        carouselSlides: {
          orderBy: { slideNumber: 'asc' },
        },
        mediaAssets: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find single content item by ID
   */
  async findOne(businessId: string, id: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        variants: true,
        carouselSlides: {
          orderBy: { slideNumber: 'asc' },
        },
        mediaAssets: true,
        campaign: true,
      },
    });

    if (!content) {
      throw new NotFoundException(`Content ${id} not found`);
    }

    if (content.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to content outside business`);
    }

    return content;
  }

  /**
   * Update content and variants/slides
   */
  async update(businessId: string, id: string, dto: UpdateContentDto) {
    await this.findOne(businessId, id);

    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.masterCopy !== undefined) updateData.masterCopy = dto.masterCopy;
    if (dto.status !== undefined) updateData.status = dto.status;

    // Update variants if provided
    if (dto.variants) {
      for (const [platform, variant] of Object.entries(dto.variants)) {
        await this.prisma.contentVariant.upsert({
          where: {
            contentId_platform: {
              contentId: id,
              platform,
            },
          },
          update: {
            text: variant.text,
            hashtagsJson: JSON.stringify(variant.hashtags || []),
          },
          create: {
            contentId: id,
            platform,
            text: variant.text,
            hashtagsJson: JSON.stringify(variant.hashtags || []),
          },
        });
      }
    }

    // Replace slides if explicitly provided
    if (dto.carouselSlides) {
      await this.prisma.carouselSlide.deleteMany({
        where: { contentId: id },
      });

      for (const slide of dto.carouselSlides) {
        await this.prisma.carouselSlide.create({
          data: {
            contentId: id,
            slideNumber: slide.slideNumber,
            headline: slide.headline,
            bodyText: slide.bodyText,
            imageUrl: slide.imageUrl || null,
            callToAction: slide.callToAction || null,
            backgroundColor: slide.backgroundColor || '#1e1e1e',
            textColor: slide.textColor || '#ffffff',
          },
        });
      }
    }

    const updated = await this.prisma.content.update({
      where: { id },
      data: updateData,
      include: {
        variants: true,
        carouselSlides: {
          orderBy: { slideNumber: 'asc' },
        },
        mediaAssets: true,
      },
    });

    return updated;
  }

  /**
   * Delete content
   */
  async delete(businessId: string, id: string) {
    await this.findOne(businessId, id);
    await this.prisma.content.delete({ where: { id } });
    return { success: true, id };
  }

  /**
   * Carousel: Add slide
   */
  async addSlide(businessId: string, contentId: string, dto: CreateSlideDto) {
    await this.findOne(businessId, contentId);

    const existingSlides = await this.prisma.carouselSlide.findMany({
      where: { contentId },
      orderBy: { slideNumber: 'desc' },
    });

    const nextNumber = dto.slideNumber || (existingSlides.length > 0 ? existingSlides[0].slideNumber + 1 : 1);

    const slide = await this.prisma.carouselSlide.create({
      data: {
        contentId,
        slideNumber: nextNumber,
        headline: dto.headline,
        bodyText: dto.bodyText,
        imageUrl: dto.imageUrl || null,
        callToAction: dto.callToAction || null,
        backgroundColor: dto.backgroundColor || '#1e1e1e',
        textColor: dto.textColor || '#ffffff',
      },
    });

    return slide;
  }

  /**
   * Carousel: Update slide
   */
  async updateSlide(businessId: string, contentId: string, slideNumber: number, dto: UpdateSlideDto) {
    await this.findOne(businessId, contentId);

    const slide = await this.prisma.carouselSlide.findUnique({
      where: {
        contentId_slideNumber: {
          contentId,
          slideNumber,
        },
      },
    });

    if (!slide) {
      throw new NotFoundException(`Slide ${slideNumber} not found on content ${contentId}`);
    }

    return this.prisma.carouselSlide.update({
      where: { id: slide.id },
      data: {
        headline: dto.headline !== undefined ? dto.headline : slide.headline,
        bodyText: dto.bodyText !== undefined ? dto.bodyText : slide.bodyText,
        imageUrl: dto.imageUrl !== undefined ? dto.imageUrl : slide.imageUrl,
        callToAction: dto.callToAction !== undefined ? dto.callToAction : slide.callToAction,
        backgroundColor: dto.backgroundColor !== undefined ? dto.backgroundColor : slide.backgroundColor,
        textColor: dto.textColor !== undefined ? dto.textColor : slide.textColor,
      },
    });
  }

  /**
   * Carousel: Delete slide and renumber
   */
  async deleteSlide(businessId: string, contentId: string, slideNumber: number) {
    await this.findOne(businessId, contentId);

    const slide = await this.prisma.carouselSlide.findUnique({
      where: {
        contentId_slideNumber: {
          contentId,
          slideNumber,
        },
      },
    });

    if (!slide) {
      throw new NotFoundException(`Slide ${slideNumber} not found`);
    }

    await this.prisma.carouselSlide.delete({ where: { id: slide.id } });

    // Renumber remaining slides
    const remaining = await this.prisma.carouselSlide.findMany({
      where: { contentId },
      orderBy: { slideNumber: 'asc' },
    });

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].slideNumber !== i + 1) {
        await this.prisma.carouselSlide.update({
          where: { id: remaining[i].id },
          data: { slideNumber: i + 1 },
        });
      }
    }

    return { success: true, deletedSlide: slideNumber, remainingSlides: remaining.length };
  }

  /**
   * Carousel: Duplicate slide
   */
  async duplicateSlide(businessId: string, contentId: string, slideNumber: number) {
    await this.findOne(businessId, contentId);

    const sourceSlide = await this.prisma.carouselSlide.findUnique({
      where: {
        contentId_slideNumber: {
          contentId,
          slideNumber,
        },
      },
    });

    if (!sourceSlide) {
      throw new NotFoundException(`Slide ${slideNumber} not found`);
    }

    const totalSlides = await this.prisma.carouselSlide.count({ where: { contentId } });
    const newSlideNumber = totalSlides + 1;

    const duplicated = await this.prisma.carouselSlide.create({
      data: {
        contentId,
        slideNumber: newSlideNumber,
        headline: `${sourceSlide.headline} (Copy)`,
        bodyText: sourceSlide.bodyText,
        imageUrl: sourceSlide.imageUrl,
        callToAction: sourceSlide.callToAction,
        backgroundColor: sourceSlide.backgroundColor,
        textColor: sourceSlide.textColor,
      },
    });

    return duplicated;
  }

  /**
   * Carousel: Export slide deck as vector SVG / HTML frames per ONIX Design System
   */
  async exportCarousel(businessId: string, contentId: string, format: 'json' | 'html' = 'json') {
    const content = await this.findOne(businessId, contentId);

    if (format === 'html') {
      const slidesHtml = content.carouselSlides
        .map(
          (s) => `
        <div style="width: 1080px; height: 1080px; background-color: ${s.backgroundColor || '#1e1e1e'}; color: ${s.textColor || '#ffffff'}; padding: 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; font-family: 'Inter', sans-serif; position: relative;">
          <div style="font-size: 20px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #1d4ed8;">SLIDE ${s.slideNumber} / ${content.carouselSlides.length}</div>
          <div>
            <h1 style="font-size: 56px; font-weight: 800; line-height: 1.15; margin: 0 0 24px 0;">${s.headline}</h1>
            <p style="font-size: 28px; line-height: 1.5; opacity: 0.9; margin: 0;">${s.bodyText}</p>
          </div>
          <div style="font-size: 20px; opacity: 0.75; font-weight: 600;">${s.callToAction || content.title}</div>
        </div>
      `
        )
        .join('\n');

      return {
        format: 'html',
        html: `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${content.title}</title></head><body style="margin:0; background:#f0f2f5; display:flex; flex-direction:column; gap:40px; align-items:center; padding:40px;">${slidesHtml}</body></html>`,
      };
    }

    return {
      format: 'json',
      contentId,
      title: content.title,
      slideCount: content.carouselSlides.length,
      slides: content.carouselSlides,
    };
  }

  /**
   * Media Library: Upload & register media asset
   */
  async uploadMedia(businessId: string, dto: UploadMediaDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException(`Business ${businessId} not found`);
    }

    if (dto.contentId) {
      await this.findOne(businessId, dto.contentId);
    }

    return this.prisma.mediaAsset.create({
      data: {
        businessId,
        contentId: dto.contentId || null,
        url: dto.url,
        fileType: dto.fileType,
        fileSize: dto.fileSize,
        width: dto.width || null,
        height: dto.height || null,
      },
    });
  }

  /**
   * Media Library: Get all media for a business
   */
  async getMediaAssets(businessId: string, search?: string) {
    const where: any = { businessId };
    if (search) {
      where.url = { contains: search };
    }

    return this.prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Media Library: Delete asset
   */
  async deleteMediaAsset(businessId: string, id: string) {
    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      throw new NotFoundException(`Media asset ${id} not found`);
    }

    if (asset.businessId !== businessId) {
      throw new ForbiddenException(`Access denied to media outside business`);
    }

    await this.prisma.mediaAsset.delete({ where: { id } });
    return { success: true, id };
  }
}
