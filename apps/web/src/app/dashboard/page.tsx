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
      value: '0',
      subtitle: '0 posts this month',
      icon: Send,
      color: 'text-blue-600',
    },
    {
      title: 'Scheduled in Queue',
      value: '0',
      subtitle: 'No upcoming posts',
      icon: Calendar,
      color: 'text-emerald-600',
    },
    {
      title: 'Total Impressions',
      value: '0',
      subtitle: 'Baseline tracking ready',
      icon: Eye,
      color: 'text-indigo-600',
    },
    {
      title: 'Engagement Rate',
      value: '0.0%',
      subtitle: 'Awaiting first publication',
      icon: TrendingUp,
      color: 'text-amber-600',
    },
  ];

  const upcomingPosts: Array<{
    id: string;
    title: string;
    platform: string;
    format: string;
    scheduledTime: string;
    status: string;
    author: string;
  }> = [];

  const aiActivities: Array<{
    persona: string;
    action: string;
    time: string;
    status: string;
  }> = [];

  return (
    <div className="animate-page-enter space-y-5">
      {/* Signature Hero Card */}
      <SignatureHeroCard
        tagBadge={`${business?.name || 'CrossTech'} • Marketing Operations`}
        title="Autonomous Marketing Command Center"
        description={`Real-time operations, scheduled publishing queue, and AI agent coordination for ${business?.name || 'CrossTech'}. AI Workforce is ready for configuration and tasks.`}
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
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="card p-4 space-y-2 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-md bg-slate-100 ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-heading font-extrabold text-neutral-900 tracking-tight">
                {kpi.value}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {kpi.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Analytics & Conformance Row */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-neutral-900">
                Audience Reach & Publishing Velocity
              </h3>
              <p className="text-xs text-muted">
                30-day cumulative impressions and content output
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600" /> Impressions
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-sm">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> Posts
              </span>
            </div>
          </div>
          <DualBezierTrendChart />
        </div>

        {/* Brand Conformance Gauge Card */}
        <div className="card p-5 flex flex-col justify-between">
          <div className="border-b border-border pb-3">
            <h3 className="font-heading font-bold text-base text-neutral-900">
              Brand Voice Conformance
            </h3>
            <p className="text-xs text-muted">
              AI QA agent audit across active brand rules
            </p>
          </div>

          <div className="my-auto py-2">
            <SpeedometerDialGauge score={100} label="Brand Kit Conformance" />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-slate-600">
            <span>QA Agent Status: <strong>Ready</strong></span>
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
            {upcomingPosts.length === 0 ? (
              <div className="py-8 text-center text-slate-500 space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No scheduled posts yet</p>
                <p className="text-[11px] text-slate-400">
                  Posts created or scheduled will appear here in the queue
                </p>
                <Link
                  href="/content-studio"
                  className="inline-block mt-1 text-xs font-bold text-blue-600 hover:underline"
                >
                  Create Post →
                </Link>
              </div>
            ) : (
              upcomingPosts.map((post) => {
                const statusCfg =
                  POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG] ||
                  POST_STATUS_CONFIG.scheduled;
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
              })
            )}
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
            {aiActivities.length === 0 ? (
              <div className="py-8 text-center text-slate-500 space-y-2">
                <Bot className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">AI Personas on standby</p>
                <p className="text-[11px] text-slate-400">
                  Configure API keys or trigger tasks to view live agent activity
                </p>
                <Link
                  href="/ai-workforce"
                  className="inline-block mt-1 text-xs font-bold text-blue-600 hover:underline"
                >
                  Configure Workforce →
                </Link>
              </div>
            ) : (
              aiActivities.map((act, i) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
