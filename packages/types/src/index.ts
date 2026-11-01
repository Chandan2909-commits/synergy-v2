// ==============================================================================
// SYNERGY CORE DOMAIN TYPES
// A CrossTech Solutions Product
// ==============================================================================

export type UserRole = 
  | 'super_admin'
  | 'org_admin'
  | 'business_admin'
  | 'marketing_manager'
  | 'content_creator'
  | 'designer'
  | 'analyst'
  | 'viewer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  plan: 'free' | 'pro' | 'agency' | 'enterprise';
  createdAt: string;
}

export interface Business {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  industry?: string;
  timezone: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandKit {
  id: string;
  businessId: string;
  brandName: string;
  tagline?: string;
  websiteUrl?: string;
  logoUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  brandVoice: string[]; // e.g. ["Professional", "Visionary", "Data-Driven"]
  targetAudience: string;
  productsAndServices: string[];
  preferredHashtags: string[];
  contentRestrictions: string[];
  updatedAt: string;
}

export type SocialPlatform = 'instagram' | 'linkedin' | 'x' | 'facebook' | 'threads' | 'tiktok' | 'youtube';

export interface SocialAccount {
  id: string;
  businessId: string;
  platform: SocialPlatform;
  platformAccountId: string;
  accountName: string;
  avatarUrl?: string;
  isConnected: boolean;
  tokenExpiresAt?: string;
  lastSyncAt?: string;
  permissions: string[];
}

export type PostStatus = 
  | 'idea'
  | 'planned'
  | 'generating'
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'cancelled';

export interface CarouselSlide {
  id: string;
  slideNumber: number;
  headline: string;
  bodyText: string;
  imageUrl?: string;
  callToAction?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface ContentItem {
  id: string;
  businessId: string;
  campaignId?: string;
  title: string;
  masterCopy: string;
  targetPlatforms: SocialPlatform[];
  status: PostStatus;
  scheduledFor?: string;
  publishedAt?: string;
  mediaUrls: string[];
  carouselSlides?: CarouselSlide[];
  variants?: Record<SocialPlatform, {
    text: string;
    hashtags: string[];
    mediaUrls: string[];
  }>;
  createdByUserId: string;
  createdById?: string;
  creatorPersona?: AIPersonaRole;
  createdAt: string;
  updatedAt: string;
}

export type AIPersonaRole = 
  | 'marketing_strategist'
  | 'market_researcher'
  | 'content_writer'
  | 'visual_designer'
  | 'video_creator'
  | 'platform_specialist'
  | 'quality_assurance'
  | 'publishing_agent'
  | 'community_manager'
  | 'analytics_agent';

export type AIProviderName = 
  | 'openai'
  | 'gemini'
  | 'anthropic'
  | 'openrouter'
  | 'groq'
  | 'ollama'
  | 'replicate';

export interface AIPersonaConfig {
  id: string;
  businessId?: string;
  role: AIPersonaRole;
  name: string;
  description: string;
  provider: AIProviderName;
  model: string;
  temperature: number;
  maxOutputTokens: number;
  systemInstructions: string;
  monthlyTokenLimit?: number;
  currentMonthTokensUsed: number;
  monthlySpendLimitUsd?: number;
  currentMonthSpendUsd: number;
  isEnabled: boolean;
}

export type ApprovalMode = 'manual' | 'conditional' | 'full_auto';

export interface AutomationWorkflow {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  triggerType: 'cron' | 'event' | 'manual';
  cronSchedule?: string; // e.g. "0 10 * * 0" (Every Sunday at 10 AM)
  targetPlatforms: SocialPlatform[];
  contentCategories: string[];
  assignedPersonas: AIPersonaRole[];
  approvalMode: ApprovalMode;
  isActive: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  monthlyAiBudgetUsd: number;
  currentSpendUsd: number;
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  businessId: string;
  status: 'running' | 'success' | 'failed' | 'requires_approval';
  stepResults: {
    persona: AIPersonaRole;
    action: string;
    timestamp: string;
    status: 'success' | 'failed';
    summary: string;
  }[];
  generatedPostIds: string[];
  tokensConsumed: number;
  costUsd: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface DashboardKPIMetrics {
  totalPublished: number;
  scheduledPosts: number;
  totalImpressions: number;
  totalReach: number;
  engagementCount: number;
  engagementRate: number;
  followerGrowth: number;
  totalComments: number;
  publishingFailureCount: number;
}

