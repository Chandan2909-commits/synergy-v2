import { AIPersonaRole, AIProviderName, BrandKit, SocialPlatform } from '@synergy/types';

export interface TextGenerationInput {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  apiKey?: string;
}

export interface TextGenerationResult {
  text: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  estimatedCostUsd: number;
  model: string;
}

export interface ImageGenerationInput {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '4:5' | '9:16';
  style?: string;
  apiKey?: string;
}

export interface ImageGenerationResult {
  imageUrl: string;
  revisedPrompt?: string;
  estimatedCostUsd: number;
}

export interface AIProviderAdapter {
  providerName: AIProviderName;
  testConnection(apiKey: string): Promise<boolean>;
  generateText(input: TextGenerationInput): Promise<TextGenerationResult>;
  generateImage?(input: ImageGenerationInput): Promise<ImageGenerationResult>;
}

export interface StrategistInput {
  businessName: string;
  brandKit: BrandKit;
  campaignGoal: string;
  targetPlatforms: SocialPlatform[];
  timeframeDays?: number;
}

export interface ContentPillarPlan {
  pillar: string;
  topics: {
    title: string;
    targetPlatform: SocialPlatform;
    format: 'text' | 'image' | 'carousel';
    keyTakeaway: string;
  }[];
}

export interface StrategistOutput {
  strategySummary: string;
  contentPillars: ContentPillarPlan[];
  suggestedScheduleFrequency: string;
}

export interface WriterInput {
  brandKit: BrandKit;
  topic: string;
  format: 'text' | 'image' | 'carousel';
  targetPlatform: SocialPlatform;
  keyTakeaway: string;
  carouselSlideCount?: number;
}

export interface WriterOutput {
  caption: string;
  hashtags: string[];
  callToAction: string;
  carouselSlides?: {
    slideNumber: number;
    headline: string;
    bodyText: string;
    visualDirection: string;
  }[];
}

export interface QACheckInput {
  brandKit: BrandKit;
  targetPlatform: SocialPlatform;
  content: {
    caption: string;
    hashtags: string[];
    hasMedia: boolean;
    mediaDimensions?: { width: number; height: number };
  };
}

export interface QACheckOutput {
  passed: boolean;
  score: number; // 0 - 100
  brandVoiceMatchScore: number; // 0 - 100
  issuesDetected: {
    severity: 'critical' | 'warning' | 'suggestion';
    category: 'grammar' | 'policy' | 'brand_voice' | 'dimension' | 'platform_limit';
    message: string;
  }[];
  recommendedFixes?: string[];
}

