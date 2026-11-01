import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createBusinessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  description: z.string().optional(),
  industry: z.string().optional(),
  timezone: z.string().default('UTC'),
});

export const updateBrandKitSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  tagline: z.string().optional(),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  logoUrl: z.string().url().optional().or(z.literal('')),
  colors: z.object({
    primary: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Must be a hex color'),
    secondary: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Must be a hex color'),
    accent: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Must be a hex color'),
    background: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Must be a hex color'),
  }),
  typography: z.object({
    headingFont: z.string(),
    bodyFont: z.string(),
  }),
  brandVoice: z.array(z.string()).min(1, 'At least one brand voice attribute required'),
  targetAudience: z.string().min(5, 'Target audience description required'),
  productsAndServices: z.array(z.string()).default([]),
  preferredHashtags: z.array(z.string()).default([]),
  contentRestrictions: z.array(z.string()).default([]),
});

export const createContentSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  objective: z.string().min(5, 'Marketing objective is required'),
  targetPlatforms: z.array(z.enum(['instagram', 'linkedin', 'x', 'facebook', 'threads', 'tiktok', 'youtube'])).min(1),
  generateImages: z.boolean().default(false),
  createCarousel: z.boolean().default(false),
  carouselSlideCount: z.number().int().min(2).max(10).optional(),
});

export const schedulePostSchema = z.object({
  contentId: z.string().uuid(),
  scheduledFor: z.string().datetime(),
  platforms: z.array(z.string()).min(1),
});

export const configurePersonaSchema = z.object({
  provider: z.enum(['openai', 'gemini', 'anthropic', 'openrouter', 'groq', 'ollama', 'replicate']),
  model: z.string().min(1, 'Model name is required'),
  apiKey: z.string().optional(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxOutputTokens: z.number().int().positive().default(2048),
  systemInstructions: z.string().min(10, 'System instructions must be at least 10 characters'),
  monthlySpendLimitUsd: z.number().positive().optional(),
  isEnabled: z.boolean().default(true),
});

export const configureWorkflowSchema = z.object({
  name: z.string().min(3, 'Workflow name is required'),
  cronSchedule: z.string().optional(),
  targetPlatforms: z.array(z.string()).min(1),
  contentCategories: z.array(z.string()).min(1),
  approvalMode: z.enum(['manual', 'conditional', 'full_auto']),
  monthlyAiBudgetUsd: z.number().positive().default(50),
  isActive: z.boolean().default(true),
});

