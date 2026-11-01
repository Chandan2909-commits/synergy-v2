export class ConfigurePersonaDto {
  provider!: string;
  model!: string;
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstructions?: string;
  monthlySpendLimitUsd?: number;
  isEnabled?: boolean;
}

export class TestConnectionDto {
  provider!: string;
  apiKey!: string;
  model?: string;
}

export class ExecuteStrategistDto {
  campaignGoal!: string;
  targetPlatforms!: string[];
}

export class ExecuteWriterDto {
  topic!: string;
  targetPlatform!: string;
  keyTakeaway!: string;
  format?: 'text' | 'image' | 'carousel';
  carouselSlideCount?: number;
}

export class ExecuteDesignerDto {
  headline!: string;
  bodyText!: string;
  visualConcept?: string;
  generateImage?: boolean;
}

export class ExecuteQADto {
  targetPlatform!: string;
  caption!: string;
  hashtags?: string[];
}

