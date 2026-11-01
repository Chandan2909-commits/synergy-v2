'use client';

import React from 'react';
import Link from 'next/link';
import {
  Send,
  Calendar,
  Eye,
  TrendingUp,
  Sparkles,
  Bot,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import {
  DualBezierTrendChart,
  SpeedometerDialGauge,
  HorizontalConversionFunnel,
  SentimentDonutRing,
  CircularProgressRing,
} from '@/components/charts/PureSvgCharts';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { POST_STATUS_CONFIG } from '@synergy/shared';

export default function DashboardPage() {
  const { getCurrentBusiness, setCommandPaletteOpen } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const kpis = [
    {
      title: 'Published Posts',
      value: '148',
      subtitle: '+12% from last month',
      icon: Send,
      color: 'text-blue-600',
    },
    {
      title: 'Scheduled in Queue',
      value: '26',
      subtitle: 'Next post in 2h 45m',
      icon: Calendar,
      color: 'text-emerald-600',
    },
    {
      title: 'Total Impressions',
      value: '482.5K',
      subtitle: '+24.8% organic reach',
      icon: Eye,
      color: 'text-indigo-600',
    },
    {
      title: 'Engagement Rate',
      value: '4.82%',
      subtitle: '0.9% above industry avg',
      icon: TrendingUp,
      color: 'text-amber-600',
    },
  ];

  const upcomingPosts = [
    {
      id: 'p-1',
      title: '5 AI Automations Transforming Modern E-Commerce',
      platform: 'Instagram',
      format: '7-Slide Carousel',
      scheduledTime: 'Today, 4:00 PM',
      status: 'scheduled',
      author: 'Content Writer + Visual Designer',
    },
    {
      id: 'p-2',
      title: 'Why Founders Must Decouple Strategy from Pure Execution',
      platform: 'LinkedIn',
      format: 'Thought Leadership Post',
      scheduledTime: 'Tomorrow, 9:30 AM',
      status: 'approved',
      author: 'Marketing Strategist',
    },
    {
      id: 'p-3',
      title: 'Quick insight on LLM inference velocity vs output quality',
      platform: 'X (Twitter)',
      format: 'Concise Thread',
      scheduledTime: 'Tomorrow, 2:15 PM',
      status: 'pending_approval',
      author: 'Content Writer',
    },
  ];

  const aiActivities = [
    {
      persona: 'Marketing Strategist',
      action: 'Formulated weekly content pillars for Aura Apparel Q4 campaign',
      time: '18m ago',
      status: 'Complete',
    },
    {
      persona: 'Visual Designer',
      action: 'Rendered 7-slide typography carousel with brand hex #1e1e1e',
      time: '42m ago',
      status: 'Complete',
    },
    {
      persona: 'Quality Assurance',
      action: 'Verified platform image ratios & checked copy against Brand Kit rules',
      time: '1h ago',
      status: 'Score: 98.4%',
    },
  ];

  return (
    <div className="animate-page-enter space-y-5">
      {/* Signature Hero Card */}
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Marketing Operations`}
        title="Autonomous Marketing Command Center"
        description={`Real-time operations, scheduled publishing queue, and AI agent coordination for ${business?.name}. AI Workforce is actively planning and verifying content.`}
        primaryAction={
          <Link href="/content-studio" className="btn-hero-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Content</span>
          </Link>
        }
        secondaryAction={
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="btn-hero-secondary"
          >
            <span>Command Palette (⌘K)</span>
          </button>
        }
      />

      {/* 4-Column KPI Grid */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-slate-500">
                  {kpi.title}
                </span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="font-heading font-extrabold text-2xl text-neutral-900 tracking-tight">
                {kpi.value}
              </div>
              <p className="text-[11.5px] text-slate-500 mt-1 font-medium">
                {kpi.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Analytics Visualizations Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Trend Chart (2 Cols) */}
        <div className="card p-5 col-span-2 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-neutral-900">
                Audience Impressions & Engagement Velocity
              </h3>
              <p className="text-xs text-muted">
                Mathematical Cubic Bézier trend across 7-day multi-platform publishing
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Impressions (k)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Engagements (k)</span>
              </div>
            </div>
          </div>
          <DualBezierTrendChart />
        </div>

        {/* Speedometer Dial Gauge (1 Col) */}
        <div className="card p-5 flex flex-col justify-between">
          <div className="border-b border-border pb-3">
            <h3 className="font-heading font-bold text-base text-neutral-900">
              AI Workforce Quality Index
            </h3>
            <p className="text-xs text-muted">
              Brand Voice consistency & factual integrity rating
            </p>
          </div>

          <div className="my-auto py-2">
            <SpeedometerDialGauge score={98.4} label="Brand Kit Conformance" />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-slate-600">
            <span>QA Agent Audited: <strong>214 Posts</strong></span>
            <span className="text-emerald-600 font-bold">0 Policy Violations</span>
          </div>
        </div>
      </div>

      {/* Second Row: Content Funnel + Upcoming Posts + AI Workforce Stream */}
      <div className="grid grid-cols-3 gap-5">
        {/* Content Pipeline Funnel */}
        <div className="card p-5 space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="font-heading font-bold text-base text-neutral-900">
              Content Production Pipeline
            </h3>
            <p className="text-xs text-muted">
              Conversion drop-off from raw idea to validated publication
            </p>
          </div>
          <HorizontalConversionFunnel />
        </div>

        {/* Upcoming Scheduled Queue */}
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-neutral-900">
                Scheduled Queue
              </h3>
              <p className="text-xs text-muted">Next automated publishing events</p>
            </div>
            <Link
              href="/calendar"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {upcomingPosts.map((post) => {
              const statusCfg = POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG] || POST_STATUS_CONFIG.scheduled;
              return (
                <div
                  key={post.id}
                  className="p-3 rounded-md bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {post.platform} • {post.format}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-pill"
                      style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                  <div className="text-[13px] font-semibold text-neutral-900 truncate">
                    {post.title}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {post.scheduledTime}
                    </span>
                    <span className="truncate max-w-[120px]">{post.author}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live AI Activity Stream */}
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-neutral-900">
                AI Agent Operations
              </h3>
              <p className="text-xs text-muted">Active personas & background executions</p>
            </div>
            <Link
              href="/ai-workforce"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              <span>Personas</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {aiActivities.map((act, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-neutral-800" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">{act.persona}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2 mt-0.5">{act.action}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                    {act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

