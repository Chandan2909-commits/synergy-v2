import { Injectable } from '@nestjs/common';
import { AIProviderAdapter, ImageGenerationResult } from '@synergy/ai-contracts';
import { BrandKit } from '@synergy/types';

export interface DesignerInput {
  brandKit: BrandKit;
  headline: string;
  bodyText: string;
  visualConcept?: string;
  generateImage?: boolean;
}

export interface DesignedSlideLayout {
  slideNumber: number;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  imageUrl?: string;
  visualDirection: string;
}

@Injectable()
export class DesignerPersonaEngine {
  async execute(
    provider: AIProviderAdapter,
    input: DesignerInput,
    apiKey?: string
  ): Promise<DesignedSlideLayout> {
    const primaryColor = input.brandKit.colors?.primary || '#1e1e1e';
    const secondaryColor = input.brandKit.colors?.secondary || '#f4f5f7';
    const accentColor = input.brandKit.colors?.accent || '#1d4ed8';

    let imageUrl: string | undefined;

    if (input.generateImage && provider.generateImage) {
      try {
        const imageRes = await provider.generateImage({
          prompt: `${input.visualConcept || input.headline}. Modern minimal luxury aesthetic, clean lighting, high resolution.`,
          aspectRatio: '4:5',
          apiKey,
        });
        imageUrl = imageRes.imageUrl;
      } catch {
        imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80';
      }
    }

    return {
      slideNumber: 1,
      backgroundColor: primaryColor,
      textColor: '#ffffff',
      accentColor,
      headingFont: input.brandKit.typography?.headingFont || 'Montserrat',
      bodyFont: input.brandKit.typography?.bodyFont || 'Inter',
      imageUrl,
      visualDirection: `Rendered with ${primaryColor} Onyx background and ${accentColor} sapphire accent lighting. High-contrast executive layout.`,
    };
  }
}
