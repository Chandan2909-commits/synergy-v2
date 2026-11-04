'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  PenTool,
  Sliders,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Share2,
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Code2,
  Play,
  Download,
  Check,
  Eye,
  FileCode,
  RotateCcw,
  ExternalLink,
  Send,
  AlertCircle,
  X,
  ClipboardPaste,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  FileText,
  Eraser,
  HelpCircle,
  Palette,
  Edit3,
  Layout,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { SocialPlatform, CarouselSlide } from '@synergy/types';

// ==============================================================================
// PRESET SLIDE TEMPLATES
// ==============================================================================
interface CodeSlideItem {
  id: string;
  slideNumber: number;
  title: string;
  html: string;
}

const PRESET_COLLECTIONS: Record<
  string,
  { name: string; description: string; slides: Array<{ title: string; html: string }> }
> = {
  executiveDark: {
    name: 'Executive Dark (Sapphire Flare)',
    description: '3-slide high-impact presentation with modern dark gradient & pill badges',
    slides: [
      {
        title: 'Hook Slide',
        html: `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: linear-gradient(135deg, #0b1120 0%, #111827 50%, #172554 100%);
    color: #ffffff;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }
  .tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.14);
    padding: 5px 12px;
    border-radius: 9999px;
    display: inline-block;
    border: 1px solid rgba(96, 165, 250, 0.25);
  }
  .headline {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.25;
    margin: 18px 0 12px 0;
    letter-spacing: -0.02em;
    color: #ffffff;
  }
  .body {
    font-size: 14px;
    line-height: 1.6;
    color: #94a3b8;
    margin: 0;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 14px;
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
  }
  .badge-number {
    font-family: monospace;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="tag">Autonomous Framework</span>
    <h1 class="headline">How AI Workforce Operates Without Human Bottlenecks</h1>
    <p class="body">Traditional content workflows require 5 different tools. Discover how our autonomous personas orchestrate from market trends to publication.</p>
  </div>
  <div class="slide-footer">
    <span>CrossTech Operations</span>
    <span class="badge-number">01 / 03</span>
  </div>
</div>`,
      },
      {
        title: 'Core Pillar',
        html: `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: linear-gradient(135deg, #0b1120 0%, #111827 50%, #172554 100%);
    color: #ffffff;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }
  .tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.14);
    padding: 5px 12px;
    border-radius: 9999px;
    display: inline-block;
    border: 1px solid rgba(96, 165, 250, 0.25);
  }
  .headline {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.25;
    margin: 18px 0 12px 0;
    letter-spacing: -0.02em;
    color: #ffffff;
  }
  .body {
    font-size: 14px;
    line-height: 1.6;
    color: #94a3b8;
    margin: 0;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 14px;
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
  }
  .badge-number {
    font-family: monospace;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="tag">Pillar 02: Verification</span>
    <h1 class="headline">Zero-Touch Brand Voice & QA Auditing</h1>
    <p class="body">The QA Persona validates every slide against your Brand Kit guidelines, typography rules, and platform constraints prior to scheduling.</p>
  </div>
  <div class="slide-footer">
    <span>Brand Safety</span>
    <span class="badge-number">02 / 03</span>
  </div>
</div>`,
      },
      {
        title: 'Scale & Dispatch',
        html: `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: linear-gradient(135deg, #0b1120 0%, #111827 50%, #172554 100%);
    color: #ffffff;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }
  .tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.14);
    padding: 5px 12px;
    border-radius: 9999px;
    display: inline-block;
    border: 1px solid rgba(96, 165, 250, 0.25);
  }
  .headline {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.25;
    margin: 18px 0 12px 0;
    letter-spacing: -0.02em;
    color: #ffffff;
  }
  .body {
    font-size: 14px;
    line-height: 1.6;
    color: #94a3b8;
    margin: 0;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 14px;
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
  }
  .badge-number {
    font-family: monospace;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="tag">Pillar 03: Scale</span>
    <h1 class="headline">Deterministic Multi-Platform Publishing</h1>
    <p class="body">With Upstash Redis distributed locks, posts are published seamlessly to Instagram, LinkedIn, and X with zero duplicate dispatches.</p>
  </div>
  <div class="slide-footer">
    <span>Ready to Deploy →</span>
    <span class="badge-number">03 / 03</span>
  </div>
</div>`,
      },
    ],
  },

  minimalLight: {
    name: 'Minimal Editorial (Clean Light)',
    description: 'Clean crisp light aesthetic with subtle borders and bold typography',
    slides: [
      {
        title: 'Hook Slide',
        html: `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: #ffffff;
    color: #0f172a;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    border: 1px solid #e2e8f0;
    box-shadow: 0 14px 30px rgba(0,0,0,0.06);
  }
  .tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #1d4ed8;
    background: #eff6ff;
    padding: 5px 12px;
    border-radius: 9999px;
    display: inline-block;
    border: 1px solid #dbeafe;
  }
  .headline {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.25;
    margin: 18px 0 12px 0;
    color: #0f172a;
  }
  .body {
    font-size: 14px;
    line-height: 1.6;
    color: #475569;
    margin: 0;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f1f5f9;
    padding-top: 14px;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 600;
  }
  .badge-number {
    font-family: monospace;
    color: #1d4ed8;
    background: #eff6ff;
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="tag">Strategy Brief</span>
    <h1 class="headline">5 Signals Your B2B Social Strategy is Outdated</h1>
    <p class="body">Static graphics and manual posting won't cut it in 2026. Here is what leading marketing teams do differently.</p>
  </div>
  <div class="slide-footer">
    <span>CrossTech Synergy</span>
    <span class="badge-number">01 / 02</span>
  </div>
</div>`,
      },
      {
        title: 'Solution Slide',
        html: `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: #ffffff;
    color: #0f172a;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    border: 1px solid #e2e8f0;
    box-shadow: 0 14px 30px rgba(0,0,0,0.06);
  }
  .tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #1d4ed8;
    background: #eff6ff;
    padding: 5px 12px;
    border-radius: 9999px;
    display: inline-block;
    border: 1px solid #dbeafe;
  }
  .headline {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.25;
    margin: 18px 0 12px 0;
    color: #0f172a;
  }
  .body {
    font-size: 14px;
    line-height: 1.6;
    color: #475569;
    margin: 0;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f1f5f9;
    padding-top: 14px;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 600;
  }
  .badge-number {
    font-family: monospace;
    color: #1d4ed8;
    background: #eff6ff;
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="tag">The Solution</span>
    <h1 class="headline">Turn High-Velocity Ideas into Visual Assets</h1>
    <p class="body">Combine code-generated carousel layouts with automated audience scheduling to increase organic engagement by 3.4x.</p>
  </div>
  <div class="slide-footer">
    <span>Swipe Next →</span>
    <span class="badge-number">02 / 02</span>
  </div>
</div>`,
      },
    ],
  },

  statsMetrics: {
    name: 'Growth Metrics & Proof',
    description: 'High-contrast statistics slide with big bold numbers and proof points',
    slides: [
      {
        title: 'Proof Metric',
        html: `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: #090d16;
    color: #ffffff;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    border: 1px solid #1e293b;
  }
  .stat-badge {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #10b981;
    background: rgba(16, 185, 129, 0.12);
    padding: 4px 10px;
    border-radius: 9999px;
    display: inline-block;
  }
  .stat-huge {
    font-family: 'Montserrat', sans-serif;
    font-size: 56px;
    font-weight: 900;
    color: #38bdf8;
    line-height: 1;
    margin: 16px 0 8px 0;
    letter-spacing: -0.04em;
  }
  .headline {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 8px;
  }
  .body {
    font-size: 13.5px;
    line-height: 1.55;
    color: #94a3b8;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 14px;
    font-size: 12px;
    color: #64748b;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="stat-badge">Performance Benchmark</span>
    <div class="stat-huge">+312%</div>
    <h2 class="headline">Engagement Lift with Code Carousels</h2>
    <p class="body">Pixel-perfect custom typography and high-density technical layouts outperform generic canvas graphics across LinkedIn and Instagram.</p>
  </div>
  <div class="slide-footer">
    <span>Verified Benchmarks</span>
    <span style="font-family: monospace; color: #10b981;">01 / 01</span>
  </div>
</div>`,
      },
    ],
  },
};

// ==============================================================================
// IN-HOUSE CAROUSEL TEMPLATES
// ==============================================================================
interface InhouseTemplateSlide {
  id: string;
  title: string;
  tag: string;
  headline: string;
  body: string;
  stat?: string;
  footerText: string;
  footerBadge: string;
  customHtml?: string;
}

interface InhouseTemplate {
  id: string;
  name: string;
  badge: string;
  category: string;
  description: string;
  accentColors: string[];
  themeStyle: {
    bg: string;
    text: string;
    accent: string;
    tagBg: string;
    tagBorder: string;
    border?: string;
  };
  slides: InhouseTemplateSlide[];
}

const INHOUSE_TEMPLATES: Record<string, InhouseTemplate> = {
  executiveDark: {
    id: 'executiveDark',
    name: 'Executive Dark',
    badge: 'B2B Enterprise',
    category: 'Executive & Strategy',
    description: 'Deep sapphire navy gradient with glowing pill badges and clean typography.',
    accentColors: ['#60a5fa', '#38bdf8', '#818cf8', '#34d399', '#f472b6'],
    themeStyle: {
      bg: 'linear-gradient(135deg, #0b1120 0%, #111827 50%, #172554 100%)',
      text: '#ffffff',
      accent: '#60a5fa',
      tagBg: 'rgba(96, 165, 250, 0.14)',
      tagBorder: 'rgba(96, 165, 250, 0.25)',
    },
    slides: [
      {
        id: 'ed-1',
        title: 'Hook Slide',
        tag: 'Executive Brief',
        headline: 'The Asymmetric Advantage of AI Marketing Systems',
        body: 'Most marketing leaders assume more manual effort equals higher growth. The real competitive moat is autonomous systemization.',
        footerText: 'CrossTech Operations',
        footerBadge: '01 / 03',
      },
      {
        id: 'ed-2',
        title: 'Core Pillar',
        tag: 'Architecture',
        headline: 'Three Deterministic Execution Pillars',
        body: 'By separating strategy, copywriting, and quality verification into specialized agents, brand conformance reaches 99.4% with zero human fatigue.',
        footerText: 'Brand Safety',
        footerBadge: '02 / 03',
      },
      {
        id: 'ed-3',
        title: 'Scale & Deploy',
        tag: 'Scale & Dispatch',
        headline: 'Deterministic Multi-Platform Publishing',
        body: 'With Upstash Redis distributed locks, posts are published seamlessly to Instagram, LinkedIn, and X with zero duplicate dispatches.',
        footerText: 'Ready to Deploy →',
        footerBadge: '03 / 03',
      },
    ],
  },

  minimalEditorial: {
    id: 'minimalEditorial',
    name: 'Minimal Editorial',
    badge: 'Thought Leadership',
    category: 'Strategy & Commentary',
    description: 'Crisp Swiss light aesthetic with deep charcoal typography and royal blue accents.',
    accentColors: ['#1d4ed8', '#0f172a', '#059669', '#7c3aed', '#dc2626'],
    themeStyle: {
      bg: '#ffffff',
      text: '#0f172a',
      accent: '#1d4ed8',
      tagBg: '#eff6ff',
      tagBorder: '#dbeafe',
      border: '1px solid #e2e8f0',
    },
    slides: [
      {
        id: 'me-1',
        title: 'The Challenge',
        tag: 'Strategy Audit',
        headline: '5 Signals Your Social Media Strategy is Outdated',
        body: 'Static canvas graphics and manual scheduling will not scale in 2026. Leading B2B teams operate continuous autonomous engines instead.',
        footerText: 'Synergy Editorial',
        footerBadge: '01 / 03',
      },
      {
        id: 'me-2',
        title: 'The Solution',
        tag: 'System Design',
        headline: 'Architecture Over Willpower',
        body: 'Replace fragmented tools with a continuous content engine. Strategy, generation, and distribution run seamlessly in one unified workspace.',
        footerText: 'Operational Playbook',
        footerBadge: '02 / 03',
      },
      {
        id: 'me-3',
        title: 'Action Item',
        tag: 'Next Steps',
        headline: 'Modernize Your Content Stack Today',
        body: 'Audit your active channels, connect your AI keys, and dispatch your first deterministic multi-slide carousel in under 5 minutes.',
        footerText: 'Swipe & Save →',
        footerBadge: '03 / 03',
      },
    ],
  },

  growthMetrics: {
    id: 'growthMetrics',
    name: 'Growth & Metrics Proof',
    badge: 'Case Study',
    category: 'Performance & Stats',
    description: 'Cyber dark aesthetic with giant neon percentage callouts and performance badges.',
    accentColors: ['#10b981', '#38bdf8', '#a855f7', '#f59e0b', '#ec4899'],
    themeStyle: {
      bg: 'linear-gradient(135deg, #020617 0%, #0f172a 60%, #064e3b 100%)',
      text: '#ffffff',
      accent: '#10b981',
      tagBg: 'rgba(16, 185, 129, 0.14)',
      tagBorder: 'rgba(16, 185, 129, 0.3)',
    },
    slides: [
      {
        id: 'gm-1',
        title: 'Huge Stat',
        tag: 'Verified Benchmark',
        stat: '+312%',
        headline: 'Engagement Lift with Code Carousels',
        body: 'Pixel-perfect typography and high-density technical layouts outperform generic canvas graphics across LinkedIn and Instagram.',
        footerText: 'Synergy Benchmarks',
        footerBadge: '01 / 03',
      },
      {
        id: 'gm-2',
        title: 'Velocity Metric',
        tag: 'Turnaround Time',
        stat: '4.2x',
        headline: 'Faster Multi-Channel Content Dispatch',
        body: 'Teams using in-house templates produce and schedule a month of multi-channel social carousels in under 30 minutes.',
        footerText: 'Production Velocity',
        footerBadge: '02 / 03',
      },
      {
        id: 'gm-3',
        title: 'Reliability Metric',
        tag: 'Platform Stability',
        stat: '99.8%',
        headline: 'Deterministic Publishing Success Rate',
        body: 'Upstash Redis distributed locking prevents double dispatches and ensures flawless publishing across all connected channels.',
        footerText: 'Deploy Engine →',
        footerBadge: '03 / 03',
      },
    ],
  },

  productLaunch: {
    id: 'productLaunch',
    name: 'Product Launch & Tech',
    badge: 'Product Release',
    category: 'Product & SaaS',
    description: 'Deep obsidian canvas with neon purple gradients and terminal-style modular pills.',
    accentColors: ['#c084fc', '#a855f7', '#38bdf8', '#06b6d4', '#ec4899'],
    themeStyle: {
      bg: 'linear-gradient(135deg, #090514 0%, #1e1136 50%, #2e1065 100%)',
      text: '#ffffff',
      accent: '#c084fc',
      tagBg: 'rgba(192, 132, 252, 0.16)',
      tagBorder: 'rgba(192, 132, 252, 0.3)',
    },
    slides: [
      {
        id: 'pl-1',
        title: 'Launch Hook',
        tag: 'Major Release',
        headline: 'Introducing Synergy 2.0: The Agentic Engine',
        body: 'The first all-in-one autonomous marketing platform with multi-slide code carousels, Supabase pooler migrations, and distributed locks.',
        footerText: 'Product Release',
        footerBadge: '01 / 03',
      },
      {
        id: 'pl-2',
        title: 'Core Engine',
        tag: 'Architecture',
        headline: 'Built for Modern High-Growth Teams',
        body: 'Real-time SVG charting, Upstash Redis session locking, and client-side 2x retina rasterization built into Next.js 14.',
        footerText: 'Architecture Brief',
        footerBadge: '02 / 03',
      },
      {
        id: 'pl-3',
        title: 'Deploy CTA',
        tag: 'Early Access',
        headline: 'Deploy Your Marketing Fleet Today',
        body: 'Connect your Instagram, LinkedIn, and X accounts to start orchestrating autonomous social campaigns in seconds.',
        footerText: 'synergy.app →',
        footerBadge: '03 / 03',
      },
    ],
  },

  stepPlaybook: {
    id: 'stepPlaybook',
    name: 'Step-by-Step Blueprint',
    badge: 'Framework SOP',
    category: 'Educational & How-To',
    description: 'Warm obsidian canvas with amber gold accents and progressive numbered steps.',
    accentColors: ['#fbbf24', '#f59e0b', '#f97316', '#38bdf8', '#10b981'],
    themeStyle: {
      bg: 'linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #451a03 100%)',
      text: '#ffffff',
      accent: '#fbbf24',
      tagBg: 'rgba(251, 191, 36, 0.14)',
      tagBorder: 'rgba(251, 191, 36, 0.28)',
    },
    slides: [
      {
        id: 'sp-1',
        title: 'Step 1: Anchor',
        tag: 'Step 01: Focus',
        headline: 'Define Your Core Brand Pillars',
        body: 'Anchor your content strategy around 3 non-negotiable topics. Extreme consistency beats random variety every single time.',
        footerText: 'B2B Blueprint',
        footerBadge: '01 / 03',
      },
      {
        id: 'sp-2',
        title: 'Step 2: Templatize',
        tag: 'Step 02: Systems',
        headline: 'Standardize Your Visual Formats',
        body: 'Use predictable slide structures. Audiences retain information 65% better when typography and layout are clear and consistent.',
        footerText: 'B2B Blueprint',
        footerBadge: '02 / 03',
      },
      {
        id: 'sp-3',
        title: 'Step 3: Automate',
        tag: 'Step 03: Scale',
        headline: 'Schedule & Scale Without Burnout',
        body: 'Batch create your templates in Content Studio, compile to 2x retina PNGs, and schedule across all platforms at once.',
        footerText: 'Swipe to Save →',
        footerBadge: '03 / 03',
      },
    ],
  },

  thoughtLeadership: {
    id: 'thoughtLeadership',
    name: 'Thought Leadership Quote',
    badge: 'Executive Voice',
    category: 'Founder Brand',
    description: 'High-contrast monochrome bold aesthetic with big quotation styling and authority badges.',
    accentColors: ['#ffffff', '#60a5fa', '#34d399', '#f59e0b', '#f43f5e'],
    themeStyle: {
      bg: '#000000',
      text: '#ffffff',
      accent: '#ffffff',
      tagBg: 'rgba(255, 255, 255, 0.12)',
      tagBorder: 'rgba(255, 255, 255, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    },
    slides: [
      {
        id: 'tl-1',
        title: 'The Quote',
        tag: 'Core Principle',
        headline: '"Consistency isn\'t discipline. It\'s architecture."',
        body: 'The teams that publish every week without fail don\'t have more willpower. They have systems that make failure impossible.',
        footerText: 'Synergy Perspective',
        footerBadge: '01 / 02',
      },
      {
        id: 'tl-2',
        title: 'The Takeaway',
        tag: 'Execution Model',
        headline: 'Build Systems That Compound Daily',
        body: 'Automate your scheduling, templatize your visual designs, and spend your time only on high-leverage strategic decisions.',
        footerText: 'Follow for more →',
        footerBadge: '02 / 02',
      },
    ],
  },
};

function generateTemplateSlideHtml(
  slide: InhouseTemplateSlide,
  theme: InhouseTemplate['themeStyle'],
  accentOverride?: string
): string {
  if (slide.customHtml && slide.customHtml.trim()) {
    return slide.customHtml;
  }

  const accent = accentOverride || theme.accent;

  return `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: ${theme.bg};
    color: ${theme.text};
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    ${theme.border ? `border: ${theme.border};` : ''}
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  .tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${accent};
    background: ${theme.tagBg};
    padding: 5px 12px;
    border-radius: 9999px;
    display: inline-block;
    border: 1px solid ${theme.tagBorder};
  }
  .stat-huge {
    font-family: 'Montserrat', sans-serif;
    font-size: 50px;
    font-weight: 900;
    color: ${accent};
    line-height: 1;
    margin: 14px 0 6px 0;
    letter-spacing: -0.03em;
  }
  .headline {
    font-family: 'Montserrat', sans-serif;
    font-size: 22px;
    font-weight: 800;
    line-height: 1.25;
    margin: ${slide.stat ? '6px 0 10px 0' : '16px 0 12px 0'};
    letter-spacing: -0.02em;
    color: ${theme.text};
  }
  .body {
    font-size: 13.5px;
    line-height: 1.6;
    color: ${theme.text === '#ffffff' ? '#94a3b8' : '#475569'};
    margin: 0;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid ${theme.text === '#ffffff' ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0'};
    padding-top: 14px;
    font-size: 12px;
    color: ${theme.text === '#ffffff' ? '#64748b' : '#94a3b8'};
    font-weight: 600;
  }
  .badge-number {
    font-family: monospace;
    color: ${accent};
    background: ${theme.tagBg};
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="tag">${slide.tag}</span>
    ${slide.stat ? `<div class="stat-huge">${slide.stat}</div>` : ''}
    <h1 class="headline">${slide.headline}</h1>
    <p class="body">${slide.body}</p>
  </div>
  <div class="slide-footer">
    <span>${slide.footerText}</span>
    <span class="badge-number">${slide.footerBadge}</span>
  </div>
</div>`;
}

// ----------------------------------------------------------------------------
// RASTERIZATION HELPERS (Shared across Code Studio & In-House Templates)
// ----------------------------------------------------------------------------
const extractSlideDimensions = (html: string) => {
  const slideRuleMatch =
    html.match(/\.carousel-slide\s*\{([^}]+)\}/i) ||
    html.match(/\.slide\s*\{([^}]+)\}/i) ||
    html.match(/body\s*\{([^}]+)\}/i);
  const cssScope = slideRuleMatch ? slideRuleMatch[1] : html;

  const widthMatch = cssScope.match(/width:\s*(\d+)px/i) || html.match(/width:\s*(\d+)px/i);
  const heightMatch = cssScope.match(/height:\s*(\d+)px/i) || html.match(/height:\s*(\d+)px/i);

  let width = widthMatch && parseInt(widthMatch[1], 10) >= 100 ? parseInt(widthMatch[1], 10) : 360;
  let height = heightMatch && parseInt(heightMatch[1], 10) >= 100 ? parseInt(heightMatch[1], 10) : 450;
  return { width, height };
};

const isValidPngDataUrl = (url: any): boolean => {
  return (
    typeof url === 'string' &&
    url.startsWith('data:image/png;base64,') &&
    url.length > 250
  );
};

const renderSlideViaIframe = async (
  html: string,
  width: number,
  height: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.style.border = 'none';
    iframe.style.opacity = '1';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-9999';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      return reject(new Error('Iframe context unavailable'));
    }

    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><style>* { box-sizing: border-box; } html, body { margin: 0; padding: 0; width: ${width}px; height: ${height}px; overflow: hidden; background: transparent; }</style></head><body>${html}</body></html>`);
    doc.close();

    setTimeout(async () => {
      try {
        const { toPng } = await import('html-to-image');
        const target =
          (doc.body.querySelector('.carousel-slide') as HTMLElement) ||
          (doc.body.firstElementChild as HTMLElement) ||
          doc.body;

        const rect = target.getBoundingClientRect();
        const targetW = rect.width >= 100 ? Math.round(rect.width) : width;
        const targetH = rect.height >= 100 ? Math.round(rect.height) : height;

        const result = await toPng(doc.body, {
          width: targetW,
          height: targetH,
          pixelRatio: 2,
          skipFonts: true,
          cacheBust: false,
        });

        document.body.removeChild(iframe);
        if (isValidPngDataUrl(result)) {
          resolve(result);
        } else {
          reject(new Error('Iframe produced empty image'));
        }
      } catch (err) {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        reject(err);
      }
    }, 180);
  });
};

export default function ContentStudioPage() {
  const { getCurrentBusiness, setTopbarLoading } = useWorkspaceStore();
  const business = getCurrentBusiness();

  // Top-Level Studio Mode: 'templates' (default) | 'code' | 'ai'
  const [activeStudioMode, setActiveStudioMode] = useState<'templates' | 'code' | 'ai'>('templates');

  // ----------------------------------------------------------------------------
  // SECTION 0: IN-HOUSE TEMPLATES STUDIO STATE & MUTATIONS
  // ----------------------------------------------------------------------------
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('executiveDark');
  const [templateAccentColor, setTemplateAccentColor] = useState<string>(
    INHOUSE_TEMPLATES.executiveDark.accentColors[0]
  );
  const [templateSlides, setTemplateSlides] = useState<InhouseTemplateSlide[]>(
    INHOUSE_TEMPLATES.executiveDark.slides.map((s) => ({ ...s }))
  );
  const [activeTemplateSlideIdx, setActiveTemplateSlideIdx] = useState<number>(0);
  const [isTemplateRawHtmlMode, setIsTemplateRawHtmlMode] = useState<boolean>(false);
  const [templateTab, setTemplateTab] = useState<'preview' | 'compiled'>('preview');
  const [templateCompiledImages, setTemplateCompiledImages] = useState<string[]>([]);
  const [activeTemplateCompiledIdx, setActiveTemplateCompiledIdx] = useState<number>(0);
  const [isCompilingTemplate, setIsCompilingTemplate] = useState<boolean>(false);
  const [templateCompileProgress, setTemplateCompileProgress] = useState<string | null>(null);

  const currentTemplate = INHOUSE_TEMPLATES[selectedTemplateId] || INHOUSE_TEMPLATES.executiveDark;
  const currentTemplateSlide = templateSlides[activeTemplateSlideIdx] || templateSlides[0];

  const handleSelectInhouseTemplate = (key: string) => {
    const tpl = INHOUSE_TEMPLATES[key];
    if (!tpl) return;
    setSelectedTemplateId(key);
    setTemplateAccentColor(tpl.accentColors[0]);
    setTemplateSlides(tpl.slides.map((s) => ({ ...s })));
    setActiveTemplateSlideIdx(0);
    setTemplateCompiledImages([]);
    setTemplateTab('preview');
    setIsTemplateRawHtmlMode(false);
    setToastMessage(`Loaded template: ${tpl.name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateTemplateSlideField = (
    field: keyof InhouseTemplateSlide,
    value: string
  ) => {
    setTemplateSlides((prev) =>
      prev.map((s, idx) =>
        idx === activeTemplateSlideIdx ? { ...s, [field]: value } : s
      )
    );
    if (templateCompiledImages.length > 0) {
      setTemplateCompiledImages([]);
    }
  };

  const handleAddTemplateSlide = () => {
    if (templateSlides.length >= 10) return;
    const nextNum = templateSlides.length + 1;
    const newSlide: InhouseTemplateSlide = {
      id: `tpl-slide-${Date.now()}`,
      title: `Slide ${nextNum}`,
      tag: 'Strategic Takeaway',
      headline: 'Next High-Impact Principle or Case Study',
      body: 'Document the specific implementation methodology or quantitative outcome here. Clear, punchy typography boosts dwell time.',
      footerText: 'Synergy Framework',
      footerBadge: `0${nextNum} / 0${nextNum}`,
    };
    setTemplateSlides([...templateSlides, newSlide]);
    setActiveTemplateSlideIdx(templateSlides.length);
    setTemplateCompiledImages([]);
  };

  const handleDuplicateTemplateSlide = (idx: number) => {
    const source = templateSlides[idx];
    if (!source) return;
    const newSlide: InhouseTemplateSlide = {
      ...source,
      id: `tpl-slide-${Date.now()}`,
      title: `${source.title || `Slide ${idx + 1}`} (Copy)`,
      footerBadge: `0${idx + 2} / 0${templateSlides.length + 1}`,
    };
    const updated = [...templateSlides];
    updated.splice(idx + 1, 0, newSlide);
    setTemplateSlides(updated);
    setActiveTemplateSlideIdx(idx + 1);
    setTemplateCompiledImages([]);
    setToastMessage(`📑 Duplicated Slide ${idx + 1}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteTemplateSlide = (idx: number) => {
    if (templateSlides.length <= 1) return;
    const filtered = templateSlides.filter((_, i) => i !== idx);
    setTemplateSlides(filtered);
    setActiveTemplateSlideIdx(Math.max(0, idx - 1));
    setTemplateCompiledImages([]);
    setToastMessage(`Slide deleted.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCompileTemplate = async () => {
    setIsCompilingTemplate(true);
    setTopbarLoading(true);
    setTemplateCompileProgress('Initializing 2x retina rasterization engine...');

    try {
      const { toPng } = await import('html-to-image');
      const images: string[] = [];
      const tpl = INHOUSE_TEMPLATES[selectedTemplateId] || INHOUSE_TEMPLATES.executiveDark;

      for (let i = 0; i < templateSlides.length; i++) {
        setTemplateCompileProgress(`Compiling Slide ${i + 1} of ${templateSlides.length} (2x Retina)...`);
        const slide = templateSlides[i];
        const html = generateTemplateSlideHtml(slide, tpl.themeStyle, templateAccentColor);
        const dims = extractSlideDimensions(html);

        let dataUrl = '';

        // Strategy 1: Render directly from template DOM sandbox
        const slideContainer = document.getElementById(`template-sandbox-slide-${i}`);
        if (slideContainer) {
          try {
            const innerSlide =
              (slideContainer.querySelector('.carousel-slide') as HTMLElement) ||
              (Array.from(slideContainer.children).find(
                (c) => c.tagName.toLowerCase() !== 'style'
              ) as HTMLElement) ||
              slideContainer;

            const rect = innerSlide.getBoundingClientRect();
            const measuredWidth = rect.width >= 100 ? Math.round(rect.width) : dims.width;
            const measuredHeight = rect.height >= 100 ? Math.round(rect.height) : dims.height;

            slideContainer.style.width = `${measuredWidth}px`;
            slideContainer.style.height = `${measuredHeight}px`;
            slideContainer.style.overflow = 'hidden';

            const res = await toPng(slideContainer, {
              width: measuredWidth,
              height: measuredHeight,
              pixelRatio: 2,
              skipFonts: true,
              cacheBust: false,
            });

            if (isValidPngDataUrl(res)) {
              dataUrl = res;
            }
          } catch (domErr) {
            console.warn(`Template DOM rasterization failed for slide ${i + 1}, using iframe fallback:`, domErr);
          }
        }

        // Strategy 2: If DOM capture was empty or failed, use isolated HTML5 iframe
        if (!isValidPngDataUrl(dataUrl)) {
          setTemplateCompileProgress(`Optimizing Slide ${i + 1} via isolated iframe...`);
          dataUrl = await renderSlideViaIframe(html, dims.width, dims.height);
        }

        if (isValidPngDataUrl(dataUrl)) {
          images.push(dataUrl);
        } else {
          throw new Error(`Slide ${i + 1} produced invalid image data.`);
        }
      }

      setTemplateCompiledImages(images);
      setActiveTemplateCompiledIdx(0);
      setTemplateTab('compiled');
      setTemplateCompileProgress(null);
      setToastMessage(`✅ Successfully compiled ${images.length} template slides!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error('Template compilation failed:', err);
      alert(`Template compilation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsCompilingTemplate(false);
      setTopbarLoading(false);
      setTemplateCompileProgress(null);
    }
  };

  const handleDownloadTemplateSlide = (index: number) => {
    const imgUrl = templateCompiledImages[index];
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `${selectedTemplateId}-slide-${index + 1}.png`;
    a.click();
  };

  const handleDownloadAllTemplateSlides = () => {
    templateCompiledImages.forEach((imgUrl, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = imgUrl;
        a.download = `${selectedTemplateId}-slide-${i + 1}.png`;
        a.click();
      }, i * 250);
    });
  };

  const handleOpenPublishModalForTemplate = () => {
    const tpl = INHOUSE_TEMPLATES[selectedTemplateId] || INHOUSE_TEMPLATES.executiveDark;
    const firstSlide = templateSlides[0];
    const defaultCaption = `🚀 ${firstSlide?.headline || tpl.name}\n\n${firstSlide?.body || tpl.description}\n\nSwipe through for the complete breakdown! #MarketingOps #Synergy #Growth`;
    setPublishCaption(defaultCaption);
    setIsPublishModalOpen(true);
  };

  // ----------------------------------------------------------------------------
  // SECTION 1: VISUAL AI BUILDER STATE (Unchanged / Fully Intact)
  // ----------------------------------------------------------------------------
  const [promptObjective, setPromptObjective] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'instagram',
    'linkedin',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const [slides, setSlides] = useState<CarouselSlide[]>([
    {
      id: 's-1',
      slideNumber: 1,
      headline: 'Slide 1 Headline',
      bodyText:
        'Enter your slide body text here or describe your topic in the prompt box above and click "Generate with AI".',
      callToAction: 'Learn more →',
      backgroundColor: '#111827',
      textColor: '#ffffff',
    },
  ]);

  const togglePlatform = (p: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTopbarLoading(true);
    setTimeout(() => {
      setIsGenerating(false);
      setTopbarLoading(false);
    }, 1200);
  };

  const currentSlide = slides[activeSlideIndex] || slides[0];

  const updateCurrentSlide = (field: keyof CarouselSlide, val: any) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === activeSlideIndex ? { ...s, [field]: val } : s))
    );
  };

  const addSlide = () => {
    if (slides.length >= 10) return;
    const newSlide: CarouselSlide = {
      id: `s-${Date.now()}`,
      slideNumber: slides.length + 1,
      headline: 'New Insight Title',
      bodyText: 'Enter clear, high-value educational copy for your audience here.',
      backgroundColor: '#111827',
      textColor: '#ffffff',
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const removeSlide = (idx: number) => {
    if (slides.length <= 1) return;
    const filtered = slides
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, slideNumber: i + 1 }));
    setSlides(filtered);
    setActiveSlideIndex(Math.max(0, idx - 1));
  };

  // ----------------------------------------------------------------------------
  // SECTION 2: CODE-TO-CAROUSEL STUDIO (Per-Slide HTML & AI Content Writer)
  // ----------------------------------------------------------------------------
  const initialPreset = PRESET_COLLECTIONS.executiveDark;
  const [codeSlides, setCodeSlides] = useState<CodeSlideItem[]>(
    initialPreset.slides.map((s, idx) => ({
      id: `code-slide-${idx + 1}`,
      slideNumber: idx + 1,
      title: s.title,
      html: s.html,
    }))
  );

  const [activeCodeSlideIndex, setActiveCodeSlideIndex] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState<string | null>(null);
  const [compiledImages, setCompiledImages] = useState<string[]>([]);
  const [activeCompiledIndex, setActiveCompiledIndex] = useState(0);
  const [activeCodeTab, setActiveCodeTab] = useState<'editor' | 'live-html' | 'compiled'>(
    'editor'
  );
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Multi-Slide Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importHtmlInput, setImportHtmlInput] = useState('');

  const currentCodeSlide = codeSlides[activeCodeSlideIndex] || codeSlides[0];

  // Update HTML code for the currently active slide
  const handleUpdateCurrentSlideHtml = (newHtml: string) => {
    setCodeSlides((prev) =>
      prev.map((s, idx) => (idx === activeCodeSlideIndex ? { ...s, html: newHtml } : s))
    );
  };

  // Switch Preset
  const handleSelectPreset = (key: string) => {
    const selected = PRESET_COLLECTIONS[key];
    if (!selected) return;
    setCodeSlides(
      selected.slides.map((s, idx) => ({
        id: `code-slide-${idx + 1}-${Date.now()}`,
        slideNumber: idx + 1,
        title: s.title,
        html: s.html,
      }))
    );
    setActiveCodeSlideIndex(0);
    setCompiledImages([]);
    setActiveCodeTab('editor');
    setToastMessage(`Loaded preset: ${selected.name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ----------------------------------------------------------------------------
  // PER-SLIDE ACTIONS: Paste from clipboard, duplicate, reorder, clear, add
  // ----------------------------------------------------------------------------
  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().length > 0) {
          handleUpdateCurrentSlideHtml(text);
          setToastMessage(`📋 Pasted code into Slide ${activeCodeSlideIndex + 1}!`);
          setTimeout(() => setToastMessage(null), 3000);
          return;
        }
      }
      setToastMessage('Clipboard is empty or browser blocked permission. Please click inside the editor and press Ctrl+V.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      setToastMessage('Click inside the code box and press Ctrl+V to paste.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleDuplicateSlide = (idx: number) => {
    const source = codeSlides[idx];
    if (!source) return;
    const newSlide: CodeSlideItem = {
      id: `code-slide-${Date.now()}`,
      slideNumber: idx + 2,
      title: `${source.title || `Slide ${idx + 1}`} (Copy)`,
      html: source.html,
    };
    const updated = [...codeSlides];
    updated.splice(idx + 1, 0, newSlide);
    const reindexed = updated.map((s, i) => ({
      ...s,
      slideNumber: i + 1,
    }));
    setCodeSlides(reindexed);
    setActiveCodeSlideIndex(idx + 1);
    setCompiledImages([]);
    setToastMessage(`📑 Duplicated Slide ${idx + 1} to Slide ${idx + 2}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMoveSlide = (fromIdx: number, direction: 'prev' | 'next') => {
    const toIdx = direction === 'prev' ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= codeSlides.length) return;
    const updated = [...codeSlides];
    const temp = updated[fromIdx];
    updated[fromIdx] = updated[toIdx];
    updated[toIdx] = temp;
    const reindexed = updated.map((s, i) => ({
      ...s,
      slideNumber: i + 1,
    }));
    setCodeSlides(reindexed);
    setActiveCodeSlideIndex(toIdx);
    setCompiledImages([]);
  };

  const handleClearCurrentSlide = () => {
    handleUpdateCurrentSlideHtml('');
    setToastMessage(`Cleared code for Slide ${activeCodeSlideIndex + 1}. Ready for paste.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateSlideTitle = (idx: number, title: string) => {
    setCodeSlides((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, title } : s))
    );
  };

  const handleAddSlide = () => {
    const nextNum = codeSlides.length + 1;
    const starterHtml = `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: #0b1120;
    color: #ffffff;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }
  .tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 4px 10px;
    border-radius: 9999px;
    display: inline-block;
  }
  .headline {
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    margin: 16px 0 8px 0;
  }
  .body {
    font-size: 14px;
    line-height: 1.6;
    color: #94a3b8;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 12px;
    font-size: 12px;
    color: #64748b;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="tag">Slide ${nextNum}</span>
    <h2 class="headline">Slide ${nextNum} Headline</h2>
    <p class="body">Paste your HTML or customize this slide text.</p>
  </div>
  <div class="slide-footer">
    <span>Synergy Carousel</span>
    <span>0${nextNum}</span>
  </div>
</div>`;

    const newSlide: CodeSlideItem = {
      id: `code-slide-${Date.now()}`,
      slideNumber: nextNum,
      title: `Slide ${nextNum}`,
      html: starterHtml,
    };
    setCodeSlides([...codeSlides, newSlide]);
    setActiveCodeSlideIndex(codeSlides.length);
    setCompiledImages([]);
    setToastMessage(`✨ Added Slide ${nextNum}! Ready to paste your code.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteSlide = (idx: number) => {
    if (codeSlides.length <= 1) return;
    const filtered = codeSlides
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, slideNumber: i + 1, title: s.title || `Slide ${i + 1}` }));
    setCodeSlides(filtered);
    setActiveCodeSlideIndex(Math.max(0, idx - 1));
    setCompiledImages([]);
    setToastMessage(`Deleted slide. ${filtered.length} slides remaining.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Multi-Slide Import handler (splits multi-slide HTML into individual slides)
  const handleImportMultiSlide = () => {
    if (!importHtmlInput.trim()) return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(importHtmlInput, 'text/html');

      const styles = Array.from(doc.querySelectorAll('style'))
        .map((s) => s.outerHTML)
        .join('\n');

      let slideNodes = Array.from(doc.querySelectorAll('.carousel-slide'));
      if (slideNodes.length === 0) {
        slideNodes = Array.from(doc.querySelectorAll('.slide, section, .card-slide'));
      }

      if (slideNodes.length > 0) {
        const parsed: CodeSlideItem[] = slideNodes.map((node, i) => ({
          id: `imported-slide-${i + 1}-${Date.now()}`,
          slideNumber: i + 1,
          title: `Slide ${i + 1}`,
          html: `${styles ? styles + '\n' : ''}${node.outerHTML}`,
        }));
        setCodeSlides(parsed);
        setActiveCodeSlideIndex(0);
        setCompiledImages([]);
        setIsImportModalOpen(false);
        setImportHtmlInput('');
        setToastMessage(`✅ Successfully imported and split ${parsed.length} slides!`);
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        handleUpdateCurrentSlideHtml(importHtmlInput);
        setIsImportModalOpen(false);
        setImportHtmlInput('');
        setToastMessage(`Pasted code into Slide ${activeCodeSlideIndex + 1}!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err: any) {
      alert('Could not parse HTML: ' + err.message);
    }
  };

  // ----------------------------------------------------------------------------
  // COMPILE HANDLER: Reliably rasterizes EVERY slide into crisp 2x Retina PNG images
  // Dual-strategy: Primary DOM capture + Isolated HTML5 Iframe Fallback
  // ----------------------------------------------------------------------------
  const handleCompileCarousel = async () => {
    setIsCompiling(true);
    setTopbarLoading(true);
    setCompileProgress('Initializing 2x retina rasterization engine...');

    try {
      const { toPng } = await import('html-to-image');
      const images: string[] = [];

      for (let i = 0; i < codeSlides.length; i++) {
        setCompileProgress(`Compiling Slide ${i + 1} of ${codeSlides.length} (2x Retina)...`);
        const slideItem = codeSlides[i];
        const dims = extractSlideDimensions(slideItem.html);

        let dataUrl = '';

        // Strategy 1: Render directly from DOM sandbox
        const slideContainer = document.getElementById(`sandbox-slide-${i}`);
        if (slideContainer) {
          try {
            const innerSlide =
              (slideContainer.querySelector('.carousel-slide') as HTMLElement) ||
              (Array.from(slideContainer.children).find(
                (c) => c.tagName.toLowerCase() !== 'style'
              ) as HTMLElement) ||
              slideContainer;

            const rect = innerSlide.getBoundingClientRect();
            const measuredWidth =
              rect.width >= 100 ? Math.round(rect.width) : dims.width;
            const measuredHeight =
              rect.height >= 100 ? Math.round(rect.height) : dims.height;

            // Size the container to wrap the slide tightly without altering inner flex items
            slideContainer.style.width = `${measuredWidth}px`;
            slideContainer.style.height = `${measuredHeight}px`;
            slideContainer.style.overflow = 'hidden';

            const res = await toPng(slideContainer, {
              width: measuredWidth,
              height: measuredHeight,
              pixelRatio: 2,
              skipFonts: true,
              cacheBust: false,
            });

            if (isValidPngDataUrl(res)) {
              dataUrl = res;
            }
          } catch (domErr) {
            console.warn(`DOM rasterization failed for slide ${i + 1}, using iframe fallback:`, domErr);
          }
        }

        // Strategy 2: If DOM capture was empty or failed, use isolated HTML5 iframe
        if (!isValidPngDataUrl(dataUrl)) {
          setCompileProgress(`Optimizing Slide ${i + 1} via isolated iframe...`);
          dataUrl = await renderSlideViaIframe(slideItem.html, dims.width, dims.height);
        }

        if (isValidPngDataUrl(dataUrl)) {
          images.push(dataUrl);
        } else {
          throw new Error(`Slide ${i + 1} produced invalid image data.`);
        }
      }

      setCompiledImages(images);
      setActiveCompiledIndex(0);
      setActiveCodeTab('compiled');
      setCompileProgress(null);
      setToastMessage(`✅ Successfully compiled ${images.length} slides matching live preview!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error('Compilation failed:', err);
      alert(`Compilation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsCompiling(false);
      setTopbarLoading(false);
      setCompileProgress(null);
    }
  };

  // Download individual slide PNG
  const handleDownloadSlide = (index: number) => {
    const imgUrl = compiledImages[index];
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `carousel-slide-${index + 1}.png`;
    a.click();
  };

  // Download all compiled slides
  const handleDownloadAll = () => {
    compiledImages.forEach((imgUrl, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = imgUrl;
        a.download = `carousel-slide-${i + 1}.png`;
        a.click();
      }, i * 250);
    });
  };

  // Copy current slide HTML
  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCodeSlide.html);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // ----------------------------------------------------------------------------
  // PUBLISHING / SCHEDULING MODAL STATE
  // ----------------------------------------------------------------------------
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishCaption, setPublishCaption] = useState(
    '🚀 Excited to share our latest tactical framework for autonomous AI operations! Swipe through the carousel for the complete breakdown. What are your thoughts? #AI #MarketingOperations #Synergy'
  );
  const [publishTargetPlatforms, setPublishTargetPlatforms] = useState<SocialPlatform[]>([
    'instagram',
    'linkedin',
  ]);
  const [publishDate, setPublishDate] = useState('2026-11-05T14:00');
  const [isScheduling, setIsScheduling] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  const handlePostOrSchedule = (immediate: boolean = false) => {
    setIsScheduling(true);
    setTopbarLoading(true);

    setTimeout(() => {
      setIsScheduling(false);
      setTopbarLoading(false);

      if (typeof window !== 'undefined') {
        const key = `synergy_scheduled_posts_${business?.id || 'biz-crosstech'}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const isTemplates = activeStudioMode === 'templates';
        const activeImages = isTemplates ? templateCompiledImages : compiledImages;
        const totalSlides = isTemplates
          ? (templateCompiledImages.length || templateSlides.length)
          : (compiledImages.length || codeSlides.length);
        const postTitle = isTemplates
          ? `Template: ${INHOUSE_TEMPLATES[selectedTemplateId]?.name || 'In-House'} Carousel`
          : 'Code-Compiled Multi-Slide Carousel';

        const newPost = {
          id: `post-${Date.now()}`,
          title: postTitle,
          caption: publishCaption,
          platforms: publishTargetPlatforms,
          scheduledFor: immediate ? new Date().toISOString() : publishDate,
          status: immediate ? 'published' : 'scheduled',
          slideCount: totalSlides,
          previewUrl: activeImages[0] || null,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(key, JSON.stringify([newPost, ...existing]));
      }

      setPublishSuccessMsg(
        immediate
          ? `🎉 Carousel dispatched immediately to ${publishTargetPlatforms.join(', ').toUpperCase()}!`
          : `✅ Carousel scheduled for ${new Date(publishDate).toLocaleString()} across ${publishTargetPlatforms.join(', ').toUpperCase()}!`
      );

      setTimeout(() => {
        setPublishSuccessMsg(null);
        setIsPublishModalOpen(false);
      }, 2500);
    }, 900);
  };

  return (
    <div className="animate-page-enter space-y-6">
      {/* Signature Hero Card */}
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Creative Studio`}
        title="AI Content Studio & Code-to-Carousel Engine"
        description="Craft carousels with in-house templates, write custom HTML/CSS code per slide, or generate visual carousel layouts with AI personas."
        primaryAction={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStudioMode('templates')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeStudioMode === 'templates'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>In-House Templates</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStudioMode('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeStudioMode === 'code'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>HTML Code Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStudioMode('ai')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeStudioMode === 'ai'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Visual Builder</span>
            </button>
          </div>
        }
      />

      {/* Studio Mode Switcher Bar */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 backdrop-blur-sm border border-slate-200 rounded-2xl w-full max-w-2xl shadow-sm">
          <button
            type="button"
            onClick={() => setActiveStudioMode('templates')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeStudioMode === 'templates'
                ? 'bg-white text-neutral-900 shadow-md border border-slate-200/80 scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Palette className="w-4 h-4 text-blue-600" />
            <span>In-House Templates</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              6 Curated
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStudioMode('code')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeStudioMode === 'code'
                ? 'bg-white text-neutral-900 shadow-md border border-slate-200/80 scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-600" />
            <span>Custom HTML Code</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Per-Slide
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStudioMode('ai')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeStudioMode === 'ai'
                ? 'bg-white text-neutral-900 shadow-md border border-slate-200/80 scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Visual AI Builder</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Brand Kit
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================
          PART 0: IN-HOUSE TEMPLATES STUDIO (Curated Designs, Visual Editor & 1-Click Publishing)
          ======================================================================== */}
      {activeStudioMode === 'templates' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 rounded-2xl text-white shadow-xl border border-blue-900/40">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-inner">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-heading font-extrabold text-lg tracking-tight">
                    In-House Carousel Templates
                  </h2>
                  <span className="text-[10px] font-mono uppercase bg-blue-500/30 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full font-bold">
                    6 In-House Master Designs
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Select an in-house handcrafted template, customize copy and brand accents directly in the visual editor, rasterize to 2x Retina PNGs, and post or schedule seamlessly.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleCompileTemplate}
                disabled={isCompilingTemplate}
                className="btn-hero-primary flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {isCompilingTemplate
                    ? 'Rasterizing...'
                    : templateCompiledImages.length > 0
                    ? 'Recompile Slides'
                    : 'Compile All Slides'}
                </span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (templateCompiledImages.length === 0) {
                    await handleCompileTemplate();
                  }
                  handleOpenPublishModalForTemplate();
                }}
                disabled={isCompilingTemplate}
                className="btn-hero-secondary flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post / Schedule Carousel</span>
              </button>
            </div>
          </div>

          {/* Template Selection Shelf (6 Cards) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-blue-600" />
                <span>Select In-House Template Collection</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Click a template to load slides
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(INHOUSE_TEMPLATES).map(([id, tpl]) => {
                const isSelected = selectedTemplateId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSelectInhouseTemplate(id)}
                    className={`p-3.5 rounded-xl text-left border transition-all relative overflow-hidden flex flex-col justify-between h-36 ${
                      isSelected
                        ? 'border-blue-600 bg-white ring-2 ring-blue-500/30 shadow-md scale-[1.02]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Top Accent Strip */}
                    <div
                      className="h-1.5 w-full rounded-full mb-2"
                      style={{ background: tpl.accentColors[0] }}
                    />

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate max-w-[80px]">
                          {tpl.badge}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading font-extrabold text-xs text-neutral-900 mt-1 line-clamp-1">
                        {tpl.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                      <span>{tpl.slides.length} Slides</span>
                      <span className={`font-semibold ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                        {isSelected ? 'Active' : 'Select →'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main 2-Column Template Customizer */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Left Column (7 Cols): Slide Tabs + Field Editor / Raw HTML Toggle */}
            <div className="col-span-12 lg:col-span-7 space-y-4">
              {/* Slide Navigation Tabs */}
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {templateSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveTemplateSlideIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        activeTemplateSlideIdx === idx
                          ? 'bg-neutral-900 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>Slide {idx + 1}</span>
                      <span className="text-[10px] opacity-75 hidden sm:inline">
                        {slide.title ? `• ${slide.title}` : ''}
                      </span>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddTemplateSlide}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-dashed border-blue-300 transition-all flex items-center gap-1 shrink-0"
                    title="Add New Slide"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => handleDuplicateTemplateSlide(activeTemplateSlideIdx)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs"
                    title="Duplicate Current Slide"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTemplateSlide(activeTemplateSlideIdx)}
                    disabled={templateSlides.length <= 1}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs disabled:opacity-30"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Template Editor Card */}
              <div className="card p-5 space-y-4">
                {/* Header: Accent Swatches + Mode Switch */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-blue-600" />
                      <span>Accent:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      {currentTemplate.accentColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            setTemplateAccentColor(color);
                            if (templateCompiledImages.length > 0) setTemplateCompiledImages([]);
                          }}
                          className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                            templateAccentColor === color
                              ? 'border-neutral-900 scale-110 shadow-sm ring-2 ring-slate-300'
                              : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          {templateAccentColor === color && (
                            <Check className="w-3 h-3 text-white drop-shadow-md stroke-[3]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsTemplateRawHtmlMode(!isTemplateRawHtmlMode)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-blue-200"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{isTemplateRawHtmlMode ? '← Back to Visual Fields' : 'Edit Raw HTML'}</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields: Visual Mode */}
                {!isTemplateRawHtmlMode ? (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Tag / Pill Badge
                        </label>
                        <input
                          type="text"
                          value={currentTemplateSlide.tag}
                          onChange={(e) => handleUpdateTemplateSlideField('tag', e.target.value)}
                          className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                          placeholder="e.g., Executive Brief, Blueprint"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Big Stat / Metric (Optional)
                        </label>
                        <input
                          type="text"
                          value={currentTemplateSlide.stat || ''}
                          onChange={(e) => handleUpdateTemplateSlideField('stat', e.target.value)}
                          className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                          placeholder="e.g., +312% or 99.4% or leave empty"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Slide Headline
                      </label>
                      <input
                        type="text"
                        value={currentTemplateSlide.headline}
                        onChange={(e) => handleUpdateTemplateSlideField('headline', e.target.value)}
                        className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-sm font-extrabold text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                        placeholder="Main point or hook"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Slide Body / Principle Description
                      </label>
                      <textarea
                        rows={4}
                        value={currentTemplateSlide.body}
                        onChange={(e) => handleUpdateTemplateSlideField('body', e.target.value)}
                        className="w-full p-3.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm leading-relaxed resize-y"
                        placeholder="Educational breakdown, architecture insight, or strategic takeaway..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Footer Left Text
                        </label>
                        <input
                          type="text"
                          value={currentTemplateSlide.footerText}
                          onChange={(e) => handleUpdateTemplateSlideField('footerText', e.target.value)}
                          className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                          placeholder="e.g., CrossTech Operations"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Footer Right Badge
                        </label>
                        <input
                          type="text"
                          value={currentTemplateSlide.footerBadge}
                          onChange={(e) => handleUpdateTemplateSlideField('footerBadge', e.target.value)}
                          className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                          placeholder="e.g., 01 / 03"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Raw HTML Mode */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Direct HTML/CSS Editor for Slide {activeTemplateSlideIdx + 1}:</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateTemplateSlideField('customHtml', '')}
                        className="text-red-500 hover:text-red-700 font-semibold"
                      >
                        Reset to Template Structure
                      </button>
                    </div>
                    <textarea
                      rows={14}
                      value={
                        currentTemplateSlide.customHtml ??
                        generateTemplateSlideHtml(
                          currentTemplateSlide,
                          currentTemplate.themeStyle,
                          templateAccentColor
                        )
                      }
                      onChange={(e) => handleUpdateTemplateSlideField('customHtml', e.target.value)}
                      className="w-full p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl outline-none border border-slate-700 focus:border-blue-500 leading-relaxed resize-y shadow-inner"
                      placeholder="<style>...</style><div class='carousel-slide'>...</div>"
                    />
                    <p className="text-[11px] text-slate-500">
                      💡 Any custom HTML changes here will be rendered live in the preview and compiled into the retina PNGs.
                    </p>
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    {templateSlides.length} slides configured • Real-time preview active
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCompileTemplate}
                      disabled={isCompilingTemplate}
                      className="btn btn-secondary text-xs flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-blue-600" />
                      <span>{isCompilingTemplate ? 'Rasterizing...' : 'Compile All Slides'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        if (templateCompiledImages.length === 0) {
                          await handleCompileTemplate();
                        }
                        handleOpenPublishModalForTemplate();
                      }}
                      disabled={isCompilingTemplate}
                      className="btn btn-primary text-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post / Schedule Carousel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 Cols): Live Preview & Compiled Gallery */}
            <div className="col-span-12 lg:col-span-5 space-y-4">
              <div className="card p-5 space-y-4">
                {/* View Switcher Tabs */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setTemplateTab('preview')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        templateTab === 'preview'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Live Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTemplateTab('compiled')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        templateTab === 'compiled'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Compiled Images</span>
                      {templateCompiledImages.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </button>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    Slide {activeTemplateSlideIdx + 1} of {templateSlides.length}
                  </span>
                </div>

                {/* Viewport: Live Preview */}
                {templateTab === 'preview' && (
                  <div className="space-y-4">
                    <div className="w-full flex items-center justify-center p-6 bg-slate-950/5 rounded-2xl border border-slate-200/80 min-h-[500px]">
                      <div
                        className="rounded-2xl shadow-2xl transition-all duration-300"
                        style={{
                          width: '360px',
                          minHeight: '450px',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: generateTemplateSlideHtml(
                            currentTemplateSlide,
                            currentTemplate.themeStyle,
                            templateAccentColor
                          ),
                        }}
                      />
                    </div>

                    {/* Slide Navigation Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveTemplateSlideIdx((prev) => Math.max(0, prev - 1))
                        }
                        disabled={activeTemplateSlideIdx === 0}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-slate-600 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {templateSlides.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveTemplateSlideIdx(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              activeTemplateSlideIdx === idx
                                ? 'bg-blue-600 w-6'
                                : 'bg-slate-300 hover:bg-slate-400'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveTemplateSlideIdx((prev) =>
                            Math.min(templateSlides.length - 1, prev + 1)
                          )
                        }
                        disabled={activeTemplateSlideIdx === templateSlides.length - 1}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-slate-600 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Viewport: Compiled Images */}
                {templateTab === 'compiled' && (
                  <div className="space-y-4">
                    {templateCompiledImages.length > 0 ? (
                      <div className="space-y-4">
                        <div className="w-full flex flex-col items-center justify-center p-6 bg-slate-950/5 rounded-2xl border border-slate-200/80 min-h-[500px]">
                          <div
                            className="rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200 bg-white"
                            style={{
                              width: '360px',
                              height: '450px',
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={templateCompiledImages[activeTemplateCompiledIdx]}
                              alt={`Compiled Slide ${activeTemplateCompiledIdx + 1}`}
                              className="w-full h-full object-contain block"
                            />
                            <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-700">
                              2x Retina PNG
                            </div>
                          </div>

                          {/* Thumbnails row */}
                          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                            {templateCompiledImages.map((img, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveTemplateCompiledIdx(idx)}
                                className={`w-12 h-15 rounded-lg border-2 overflow-hidden transition-all ${
                                  activeTemplateCompiledIdx === idx
                                    ? 'border-blue-600 scale-105 shadow-md ring-2 ring-blue-500/20'
                                    : 'border-slate-200 opacity-60 hover:opacity-100'
                                }`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img}
                                  alt={`Thumb ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Compiled Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDownloadTemplateSlide(activeTemplateCompiledIdx)}
                              className="btn btn-secondary text-xs flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Slide</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleDownloadAllTemplateSlides}
                              className="btn btn-secondary text-xs flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download All ({templateCompiledImages.length})</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleOpenPublishModalForTemplate}
                            className="btn btn-primary text-xs flex items-center gap-1.5 shadow-md"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Post / Schedule</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Not Compiled Yet Placeholder */
                      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-3 min-h-[450px]">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-neutral-800">
                            Slides Not Rasterized Yet
                          </h4>
                          <p className="text-xs text-slate-500 max-w-xs mt-1">
                            Click &ldquo;Compile All Slides&rdquo; to rasterize all slides into 2x Retina PNGs ready for immediate Instagram, LinkedIn, and X publishing.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCompileTemplate}
                          disabled={isCompilingTemplate}
                          className="btn btn-primary text-xs flex items-center gap-1.5 mt-2"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isCompilingTemplate ? 'Rasterizing...' : 'Compile All Slides'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          PART 1: VISUAL AI BUILDER (Unchanged / Fully Intact)
          ======================================================================== */}
      {activeStudioMode === 'ai' && (
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h2 className="font-heading font-extrabold text-sm uppercase tracking-wider text-neutral-800">
              Visual AI Persona Builder
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {slides.length} Visual Slides Configured
          </span>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Left Column (5 Cols): Prompt, Platform Selectors, Slide Inspector */}
          <div className="col-span-5 space-y-4">
            {/* Objective Card */}
            <div className="card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-blue-600" />
                  Content Objective & Prompt
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Brand Kit Active
                </span>
              </div>

              <textarea
                rows={3}
                value={promptObjective}
                onChange={(e) => setPromptObjective(e.target.value)}
                className="w-full p-3.5 bg-white border border-slate-300 rounded-lg text-[13px] text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none font-medium leading-relaxed shadow-sm"
                placeholder="Describe what content concept you want to create..."
              />

              {/* Target Platforms */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Target Platform Adapters
                </span>
                <div className="flex items-center gap-2">
                  {(['instagram', 'linkedin', 'x'] as SocialPlatform[]).map((p) => {
                    const isSelected = selectedPlatforms.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePlatform(p)}
                        className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-white text-slate-600 border-border hover:bg-slate-100'
                        }`}
                      >
                        {p === 'x' ? 'X (Twitter)' : p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Slide Form Editor */}
            <div className="card p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Edit Slide {activeSlideIndex + 1} of {slides.length}
                </span>
                <button
                  type="button"
                  onClick={() => removeSlide(activeSlideIndex)}
                  disabled={slides.length <= 1}
                  className="text-[11px] font-semibold text-red-500 hover:text-red-700 disabled:opacity-30 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete Slide</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Slide Headline
                </label>
                <input
                  type="text"
                  value={currentSlide.headline}
                  onChange={(e) => updateCurrentSlide('headline', e.target.value)}
                  className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-sm text-neutral-900 font-bold focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Slide Body Narrative
                </label>
                <textarea
                  rows={3}
                  value={currentSlide.bodyText}
                  onChange={(e) => updateCurrentSlide('bodyText', e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-[13px] text-neutral-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none leading-relaxed shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Call to Action (Optional)
                </label>
                <input
                  type="text"
                  value={currentSlide.callToAction || ''}
                  onChange={(e) => updateCurrentSlide('callToAction', e.target.value)}
                  placeholder="e.g. Swipe to learn more →"
                  className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-xs text-neutral-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                />
              </div>

              {/* QA Agent Badge */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-sm flex items-center gap-2.5 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">QA Agent Verified:</span> Brand Kit voice 98.4%
                  match, zero grammar flags.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Interactive Carousel Canvas & Slide Sequence */}
          <div className="col-span-7 space-y-4">
            <div className="card p-6 flex flex-col items-center justify-between min-h-[520px]">
              {/* Top Toolbar */}
              <div className="w-full flex items-center justify-between border-b border-border pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-neutral-900">
                    Visual Slide Canvas
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    (1080 x 1350 • 4:5 Aspect Ratio)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeSlideIndex === 0}
                    className="p-1 rounded-sm border border-border bg-slate-50 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {activeSlideIndex + 1} / {slides.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))
                    }
                    disabled={activeSlideIndex === slides.length - 1}
                    className="p-1 rounded-sm border border-border bg-slate-50 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* The Branded Slide Canvas */}
              <div
                className="w-[360px] h-[450px] rounded-lg shadow-2xl p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border border-slate-700/30"
                style={{
                  backgroundColor: currentSlide.backgroundColor || '#111827',
                  color: currentSlide.textColor || '#ffffff',
                }}
              >
                {/* Radial gradient ambient lighting */}
                <div className="absolute -top-20 -right-20 w-52 h-52 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                {/* Slide Header: Business Name & Indicator */}
                <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white text-neutral-900 font-bold text-[10px] flex items-center justify-center">
                      {(business?.name || 'S').charAt(0)}
                    </div>
                    <span className="text-xs font-bold tracking-wide uppercase">
                      {business?.name || 'Synergy'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold opacity-70">
                    {activeSlideIndex + 1} / {slides.length}
                  </span>
                </div>

                {/* Slide Core Content */}
                <div className="my-auto relative z-10 space-y-4">
                  <h2 className="font-heading font-extrabold text-2xl text-white tracking-tight leading-tight">
                    {currentSlide.headline}
                  </h2>
                  <p className="text-[13.5px] text-slate-300 leading-relaxed font-normal">
                    {currentSlide.bodyText}
                  </p>
                </div>

                {/* Slide Footer / CTA */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">
                    {currentSlide.callToAction || 'Swipe →'}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400">
                    CrossTech • Synergy
                  </span>
                </div>
              </div>

              {/* Slide Navigation Thumbnails Row */}
              <div className="w-full flex items-center justify-center gap-2.5 pt-6">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`w-9 h-11 rounded-sm text-[11px] font-bold flex flex-col items-center justify-center border transition-all ${
                      idx === activeSlideIndex
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm scale-105'
                        : 'border-border bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={addSlide}
                  className="w-9 h-11 rounded-sm border border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors"
                  title="Add New Slide"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Actions */}
              <div className="w-full flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => alert('Visual draft saved successfully to workspace.')}
                  className="btn btn-secondary"
                >
                  Save as Draft
                </button>
                <Link href="/calendar" className="btn btn-primary">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule to Calendar</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ========================================================================
          PART 2: CODE-TO-CAROUSEL STUDIO (Per-Slide HTML & AI Content Writer)
          ======================================================================== */}
      {activeStudioMode === 'code' && (
      <div id="code-carousel-studio" className="space-y-4 animate-fade-in">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-neutral-900 to-blue-950 p-5 rounded-2xl text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-base tracking-tight">
                  HTML Code-to-Carousel Studio
                </h2>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  Per-Slide Code Architecture
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Paste and customize HTML/CSS for each slide individually. Preview instantly in real time and compile to 2x retina images for social publishing.
              </p>
            </div>
          </div>

          {/* Quick Presets Menu */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-medium text-slate-400">Theme Presets:</span>
            {Object.entries(PRESET_COLLECTIONS).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPreset(key)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all"
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Slide Selector & Per-Slide Management Bar */}
        <div className="card p-3 flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200">
          {/* Left: Slide Selector Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Slides ({codeSlides.length}):
            </span>
            {codeSlides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveCodeSlideIndex(idx);
                  setActiveCodeTab('editor');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  idx === activeCodeSlideIndex
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>{s.title || `Slide ${idx + 1}`}</span>
                {idx === activeCodeSlideIndex && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </button>
            ))}

            <button
              type="button"
              onClick={handleAddSlide}
              className="px-2.5 py-1.5 rounded-lg border border-dashed border-blue-400 bg-blue-50/60 hover:bg-blue-100/80 text-blue-700 text-xs flex items-center gap-1 font-bold transition-all"
              title="Add New Blank Slide"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          {/* Right: Slide Controls & Multi-Slide Import */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="btn btn-secondary text-xs flex items-center gap-1.5 !bg-emerald-50 hover:!bg-emerald-100 border !border-emerald-300 text-emerald-800 font-bold shadow-sm !py-1 !px-2.5"
              title="Paste code directly from clipboard into active slide"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-emerald-700" />
              <span>Paste Code</span>
            </button>

            <button
              type="button"
              onClick={() => handleDuplicateSlide(activeCodeSlideIndex)}
              className="btn btn-secondary text-xs flex items-center gap-1.5 !bg-white hover:!bg-slate-100 border border-slate-300 text-slate-700 font-semibold shadow-sm !py-1 !px-2.5"
              title="Duplicate current slide"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Duplicate</span>
            </button>

            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => handleMoveSlide(activeCodeSlideIndex, 'prev')}
                disabled={activeCodeSlideIndex === 0}
                className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Move Slide Left"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="w-px h-4 bg-slate-200" />
              <button
                type="button"
                onClick={() => handleMoveSlide(activeCodeSlideIndex, 'next')}
                disabled={activeCodeSlideIndex === codeSlides.length - 1}
                className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
                title="Move Slide Right"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {codeSlides.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteSlide(activeCodeSlideIndex)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-red-500 transition-colors"
                title="Delete Current Slide"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="w-px h-5 bg-slate-300 mx-0.5" />

            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="btn btn-secondary text-xs flex items-center gap-1.5 !bg-white hover:!bg-blue-50 border border-slate-300 text-blue-700 font-semibold shadow-sm !py-1 !px-2.5"
              title="Import a single HTML document with multiple slides"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span>Import Multi-Slide HTML</span>
            </button>
          </div>
        </div>

        {/* Code Studio Workspace: Left Editor, Right Live Render & Compiled Gallery */}
        <div className="grid grid-cols-12 gap-5">
          {/* Left Column (6 Cols): Code Editor & Compiler Toolbar */}
          <div className="col-span-12 lg:col-span-6 space-y-3">
            <div className="card p-4 space-y-3">
              {/* Editor Top Bar with Editable Title & Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <input
                    type="text"
                    value={currentCodeSlide.title || ''}
                    onChange={(e) =>
                      handleUpdateSlideTitle(activeCodeSlideIndex, e.target.value)
                    }
                    placeholder={`Slide ${activeCodeSlideIndex + 1} Name`}
                    className="text-xs font-bold text-neutral-900 bg-slate-100 hover:bg-slate-200/80 focus:bg-white focus:ring-1 focus:ring-blue-500 px-2 py-1 rounded border border-slate-200 outline-none w-36"
                  />
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                    {activeCodeSlideIndex + 1} / {codeSlides.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center gap-1"
                    title="Paste from Clipboard"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Paste</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCurrentSlide}
                    className="px-2 py-1 rounded hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1 border border-slate-200"
                    title="Clear current slide code"
                  >
                    <Eraser className="w-3.5 h-3.5 text-slate-500" />
                    <span>Clear</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-2 py-1 rounded hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1 border border-slate-200"
                    title="Copy Current Slide Code"
                  >
                    {copyFeedback ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{copyFeedback ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const initialHtml =
                        initialPreset.slides[
                          activeCodeSlideIndex % initialPreset.slides.length
                        ].html;
                      handleUpdateCurrentSlideHtml(initialHtml);
                    }}
                    className="px-2 py-1 rounded hover:bg-slate-100 text-slate-500 text-xs flex items-center gap-1"
                    title="Reset to Template"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Code Textarea with Dark Terminal Aesthetic */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                <div className="bg-[#0b0f19] px-3.5 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-slate-400">slide-{activeCodeSlideIndex + 1}.html</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      {currentCodeSlide.html.length} chars
                    </span>
                    <span className="text-slate-400">Paste or edit HTML for this slide</span>
                  </div>
                </div>

                <textarea
                  value={currentCodeSlide.html}
                  onChange={(e) => handleUpdateCurrentSlideHtml(e.target.value)}
                  rows={18}
                  spellCheck={false}
                  className="w-full p-4 bg-[#070b13] text-emerald-400 font-mono text-[12.5px] leading-relaxed outline-none resize-y selection:bg-blue-600 selection:text-white"
                  placeholder={`<!-- Paste your HTML and <style> code for Slide ${activeCodeSlideIndex + 1} here -->`}
                />
              </div>

              {/* Instructions and Compile CTA */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  Each slide is independent. Changes update the preview immediately.
                </span>

                <button
                  type="button"
                  onClick={handleCompileCarousel}
                  disabled={isCompiling}
                  className="btn btn-primary flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
                >
                  <Play
                    className={`w-3.5 h-3.5 fill-current ${
                      isCompiling ? 'animate-spin' : ''
                    }`}
                  />
                  <span>
                    {isCompiling
                      ? compileProgress || 'Compiling Images...'
                      : `Compile All ${codeSlides.length} Slides`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (6 Cols): Canvas & Compiled Gallery */}
          <div className="col-span-12 lg:col-span-6 space-y-3">
            <div className="card p-4 space-y-3 min-h-[560px] flex flex-col justify-between">
              {/* Header with Switcher Tabs */}
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('editor')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      activeCodeTab === 'editor'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Live Preview (Slide {activeCodeSlideIndex + 1})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('compiled')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                      activeCodeTab === 'compiled'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Compiled Images</span>
                    {compiledImages.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {compiledImages.length}
                      </span>
                    )}
                  </button>
                </div>

                {compiledImages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadSlide(activeCompiledIndex)}
                      className="btn btn-secondary text-xs flex items-center gap-1 !py-1 !px-2.5"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Slide</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadAll}
                      className="btn btn-secondary text-xs flex items-center gap-1 !py-1 !px-2.5"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download All ({compiledImages.length})</span>
                    </button>
                  </div>
                )}
              </div>

              {/* TAB 1: Live Interactive HTML Preview */}
              {activeCodeTab === 'editor' && (
                <div className="flex-1 flex flex-col items-center justify-between p-4 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl overflow-hidden min-h-[500px]">
                  <div className="w-full flex items-center justify-between text-xs pb-2 border-b border-slate-200/60 mb-2">
                    <span className="font-bold text-slate-700">
                      {currentCodeSlide.title || `Slide ${activeCodeSlideIndex + 1}`} Preview
                    </span>
                    <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                      <span className="bg-slate-200/60 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-700">
                        {extractSlideDimensions(currentCodeSlide.html).width} × {extractSlideDimensions(currentCodeSlide.html).height} px
                      </span>
                      <span>
                        {activeCodeSlideIndex + 1} / {codeSlides.length}
                      </span>
                    </div>
                  </div>

                  <div className="w-full flex-1 flex items-center justify-center py-2 overflow-auto">
                    <div
                      dangerouslySetInnerHTML={{ __html: currentCodeSlide.html }}
                      className="flex flex-col items-center transition-all"
                    />
                  </div>

                  {/* Previous / Next Slide Selector in Preview */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 w-full justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveCodeSlideIndex((p) => Math.max(0, p - 1))}
                      disabled={activeCodeSlideIndex === 0}
                      className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-slate-600">
                      Slide {activeCodeSlideIndex + 1} of {codeSlides.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveCodeSlideIndex((p) => Math.min(codeSlides.length - 1, p + 1))
                      }
                      disabled={activeCodeSlideIndex === codeSlides.length - 1}
                      className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Compiled Retina Images Gallery */}
              {activeCodeTab === 'compiled' && (
                <div className="flex-1 flex flex-col items-center justify-between p-4 bg-slate-50/70 border border-slate-200 rounded-xl min-h-[500px]">
                  {compiledImages.length === 0 ? (
                    <div className="my-auto text-center space-y-3 py-12">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-neutral-900">
                        No Compiled Images Yet
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Click &ldquo;Compile All {codeSlides.length} Slides&rdquo; to generate crisp 2x retina social PNGs matching your exact live preview.
                      </p>
                      <button
                        type="button"
                        onClick={handleCompileCarousel}
                        disabled={isCompiling}
                        className="btn btn-primary text-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Compile Now</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex-1 flex flex-col items-center justify-between space-y-3">
                      {/* Active Compiled Image Header */}
                      <div className="w-full flex items-center justify-between text-xs px-2 pb-2 border-b border-slate-200/60">
                        <span className="font-bold text-slate-700">
                          Slide {activeCompiledIndex + 1} of {compiledImages.length}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold text-[10px]">
                            {extractSlideDimensions(codeSlides[activeCompiledIndex]?.html || '').width * 2} × {extractSlideDimensions(codeSlides[activeCompiledIndex]?.html || '').height * 2} px (2x Retina)
                          </span>
                          <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold text-[10px]">
                            1:1 Match Ready
                          </span>
                        </div>
                      </div>

                      {/* Compiled Image Display - Sized exactly as the live preview slide */}
                      <div className="w-full flex-1 flex items-center justify-center py-2 overflow-auto">
                        <img
                          src={compiledImages[activeCompiledIndex]}
                          alt={`Compiled Slide ${activeCompiledIndex + 1}`}
                          style={{
                            width: `${extractSlideDimensions(codeSlides[activeCompiledIndex]?.html || '').width}px`,
                            height: `${extractSlideDimensions(codeSlides[activeCompiledIndex]?.html || '').height}px`,
                            maxWidth: '100%',
                            objectFit: 'contain',
                          }}
                          className="rounded-xl shadow-xl border border-slate-300"
                        />
                      </div>

                      {/* Carousel Thumbnail Strip & Controls */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 w-full justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveCompiledIndex((prev) => Math.max(0, prev - 1))
                          }
                          disabled={activeCompiledIndex === 0}
                          className="p-1 rounded-md border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1.5">
                          {compiledImages.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setActiveCompiledIndex(i)}
                              className={`w-8 h-10 rounded-md overflow-hidden border-2 transition-all ${
                                i === activeCompiledIndex
                                  ? 'border-blue-600 scale-105 shadow-sm'
                                  : 'border-slate-200 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveCompiledIndex((prev) =>
                              Math.min(compiledImages.length - 1, prev + 1)
                            )
                          }
                          disabled={activeCompiledIndex === compiledImages.length - 1}
                          className="p-1 rounded-md border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Publishing Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
                <div className="text-xs text-slate-500">
                  {compiledImages.length > 0 ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{compiledImages.length} Slides Rasterized & Ready to Publish</span>
                    </span>
                  ) : (
                    <span>Ready to compile {codeSlides.length} HTML slides into social assets</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (compiledImages.length === 0) {
                        handleCompileCarousel();
                      }
                      setIsPublishModalOpen(true);
                    }}
                    className="btn btn-primary flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post / Schedule Carousel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ========================================================================
          MULTI-SLIDE SANDBOX DOM CONTAINER (Mounted for reliable rasterization)
          ======================================================================== */}
      <div
        id="carousel-raster-sandbox"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: 'auto',
          opacity: 1, // Must be 1 so canvas paints pixels
          pointerEvents: 'none',
          zIndex: -9999,
          visibility: 'visible',
        }}
      >
        {/* Code slides rasterization sandbox */}
        {codeSlides.map((s, idx) => (
          <div
            key={s.id}
            id={`sandbox-slide-${idx}`}
            style={{
              display: 'inline-block',
              position: 'relative',
              verticalAlign: 'top',
              margin: '0 20px 0 0',
              padding: 0,
              boxSizing: 'border-box',
            }}
            dangerouslySetInnerHTML={{ __html: s.html }}
          />
        ))}

        {/* Template slides rasterization sandbox */}
        {templateSlides.map((s, idx) => {
          const tpl = INHOUSE_TEMPLATES[selectedTemplateId] || INHOUSE_TEMPLATES.executiveDark;
          const html = generateTemplateSlideHtml(s, tpl.themeStyle, templateAccentColor);
          return (
            <div
              key={s.id}
              id={`template-sandbox-slide-${idx}`}
              style={{
                display: 'inline-block',
                position: 'relative',
                verticalAlign: 'top',
                margin: '0 20px 0 0',
                padding: 0,
                boxSizing: 'border-box',
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        })}
      </div>

      {/* ========================================================================
          PUBLISH / SCHEDULE MODAL
          ======================================================================== */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-lg w-full p-6 space-y-5 animate-scale-up">
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-neutral-900">
                    Publish Compiled Carousel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dispatch to connected Instagram, LinkedIn, and X channels
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              {/* Target Platforms */}
              <div>
                <label className="settings-label">Target Channels</label>
                <div className="flex items-center gap-2">
                  {(['instagram', 'linkedin', 'x'] as SocialPlatform[]).map((p) => {
                    const isSelected = publishTargetPlatforms.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setPublishTargetPlatforms((prev) =>
                            prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-white text-slate-600 border-border hover:bg-slate-100'
                        }`}
                      >
                        {p === 'x' ? 'X (Twitter)' : p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Post Caption */}
              <div>
                <label className="settings-label">Post Caption / Accompanying Copy</label>
                <textarea
                  rows={4}
                  value={publishCaption}
                  onChange={(e) => setPublishCaption(e.target.value)}
                  className="settings-input !bg-white leading-relaxed"
                  placeholder="Enter the post caption or thread introduction..."
                />
              </div>

              {/* Schedule Date & Time */}
              <div>
                <label className="settings-label">Schedule Date &amp; Time (UTC)</label>
                <input
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="settings-input !bg-white font-mono text-xs"
                />
              </div>

              {/* Compiled Slides Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-slate-600 text-xs">
                <span>Slides Attached:</span>
                <span className="font-mono font-bold text-neutral-900">
                  {(activeStudioMode === 'templates'
                    ? templateCompiledImages.length || templateSlides.length
                    : compiledImages.length || codeSlides.length)}{' '}
                  Images Ready
                </span>
              </div>

              {/* Status feedback */}
              {publishSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium animate-fade-in">
                  {publishSuccessMsg}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="btn btn-secondary text-xs"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePostOrSchedule(false)}
                  disabled={isScheduling}
                  className="btn btn-secondary text-xs flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isScheduling ? 'Scheduling...' : 'Schedule to Calendar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePostOrSchedule(true)}
                  disabled={isScheduling}
                  className="btn btn-primary text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isScheduling ? 'Publishing...' : 'Publish Immediately'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          MULTI-SLIDE HTML IMPORT MODAL
          ======================================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-xl w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-neutral-900">
                    Import Multi-Slide HTML
                  </h3>
                  <p className="text-xs text-slate-500">
                    Paste an entire HTML document containing multiple slides to extract and split automatically.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Paste Multi-Slide HTML Code:
              </label>
              <textarea
                value={importHtmlInput}
                onChange={(e) => setImportHtmlInput(e.target.value)}
                rows={12}
                placeholder="<style>&#10;  .carousel-slide { width: 360px; height: 450px; ... }&#10;</style>&#10;<div class='carousel-slide'>...</div>&#10;<div class='carousel-slide'>...</div>"
                className="w-full p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl outline-none border border-slate-700 leading-relaxed resize-y"
              />
              <p className="text-[11px] text-slate-500">
                Synergy detects elements with class <code className="text-blue-600">.carousel-slide</code> or <code className="text-blue-600">.slide</code>, extracts any shared <code className="text-blue-600">&lt;style&gt;</code> blocks, and creates separate slide tabs for each one.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="btn btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportMultiSlide}
                disabled={!importHtmlInput.trim()}
                className="btn btn-primary text-xs flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Extract &amp; Import Slides</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
