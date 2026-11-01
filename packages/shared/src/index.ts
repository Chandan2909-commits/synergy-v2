// ==============================================================================
// SYNERGY SHARED UTILITIES & CONSTANTS
// A CrossTech Solutions Product
// ==============================================================================

import { AIPersonaRole, PostStatus, SocialPlatform, UserRole } from '@synergy/types';

export const APP_NAME = 'Synergy';
export const PARENT_COMPANY = 'CrossTech Solutions';
export const TAGLINE = 'Your Entire Marketing Team. One Intelligent Workspace.';

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  org_admin: 'Organization Admin',
  business_admin: 'Business Admin',
  marketing_manager: 'Marketing Manager',
  content_creator: 'Content Creator',
  designer: 'Visual Designer',
  analyst: 'Analyst',
  viewer: 'Viewer',
};

export const PLATFORM_NAMES: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
  facebook: 'Facebook',
  threads: 'Threads',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

export const POST_STATUS_CONFIG: Record<PostStatus, { label: string; color: string; bg: string }> = {
  idea: { label: 'Idea', color: '#6b7280', bg: '#f3f4f6' },
  planned: { label: 'Planned', color: '#6366f1', bg: '#eef2ff' },
  generating: { label: 'AI Generating', color: '#8b5cf6', bg: '#f5f3ff' },
  draft: { label: 'Draft', color: '#3b82f6', bg: '#eff6ff' },
  pending_approval: { label: 'Pending Approval', color: '#f59e0b', bg: '#fef3c7' },
  approved: { label: 'Approved', color: '#10b981', bg: '#ecfdf5' },
  scheduled: { label: 'Scheduled', color: '#06b6d4', bg: '#ecfeff' },
  publishing: { label: 'Publishing', color: '#d97706', bg: '#fffbeb' },
  published: { label: 'Published', color: '#059669', bg: '#d1fae5' },
  failed: { label: 'Failed', color: '#ef4444', bg: '#fee2e2' },
  cancelled: { label: 'Cancelled', color: '#9ca3af', bg: '#f3f4f6' },
};

export const MVP_PERSONAS: { role: AIPersonaRole; title: string; defaultModel: string; provider: string; description: string }[] = [
  {
    role: 'marketing_strategist',
    title: 'Marketing Strategist',
    defaultModel: 'gpt-4o',
    provider: 'openai',
    description: 'High-level campaign planning, audience persona targeting, content pillars, and task delegation.'
  },
  {
    role: 'content_writer',
    title: 'Content Writer',
    defaultModel: 'gemini-1.5-flash',
    provider: 'gemini',
    description: 'Captions, thought-leadership LinkedIn posts, punchy X threads, and carousel slide narratives.'
  },
  {
    role: 'visual_designer',
    title: 'Visual Designer',
    defaultModel: 'dall-e-3',
    provider: 'openai',
    description: 'Multi-slide carousels, branded promotional graphics, and brand kit color consistency.'
  },
  {
    role: 'quality_assurance',
    title: 'Quality Assurance Agent',
    defaultModel: 'claude-3-5-sonnet',
    provider: 'anthropic',
    description: 'Spelling, grammar, brand voice alignment, dimension checks, and factual integrity validation.'
  }
];

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
}

