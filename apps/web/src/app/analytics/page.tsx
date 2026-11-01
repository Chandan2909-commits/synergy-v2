'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import {
  DualBezierTrendChart,
  SentimentDonutRing,
  SpeedometerDialGauge,
} from '@/components/charts/PureSvgCharts';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export default function AnalyticsPage() {
  const { getCurrentBusiness } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const metrics = [
    { label: 'Total Reach', value: '0', change: '0.0%', icon: Eye },
    { label: 'Follower Growth', value: '0', change: '0.0%', icon: Users },
    { label: 'Total Interactions', value: '0', change: '0.0%', icon: Heart },
    { label: 'Comments & Mentions', value: '0', change: '0.0%', icon: MessageSquare },
  ];

  const topPosts: Array<{
    title: string;
    platform: string;
    impressions: string;
    engagement: string;
    shares: string;
  }> = [];

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'CrossTech'} • Performance Intelligence`}
        title="Cross-Platform Analytics & Audience Telemetry"
        description="Unified metrics across connected social platforms. Historical engagement snapshots, reach attribution, and AI content performance ranking."
      />

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">{m.label}</span>
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="font-heading font-extrabold text-2xl text-neutral-900 tracking-tight">
                {m.value}
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-1 inline-block">
                No telemetry data yet
              </span>
            </div>
          );
        })}
      </div>

      {/* Chart + Donut Split */}
      <div className="grid grid-cols-3 gap-5">
        <div className="card p-5 col-span-2 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-neutral-900">
                Weekly Engagement Trajectory
              </h3>
              <p className="text-xs text-muted">
                Mathematical Cubic Bézier multi-curve comparison
              </p>
            </div>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              Baseline Ready
            </span>
          </div>
          <DualBezierTrendChart />
        </div>

        <div className="card p-5 space-y-3 flex flex-col justify-between">
          <div className="border-b border-border pb-3">
            <h3 className="font-heading font-bold text-base text-neutral-900">
              Platform Share of Engagement
            </h3>
            <p className="text-xs text-muted">Distribution of audience interactions</p>
          </div>
          <div className="my-auto py-3 flex justify-center">
            <SentimentDonutRing />
          </div>
          <div className="pt-2 border-t border-border text-center text-xs text-slate-400">
            Awaiting first social post interaction
          </div>
        </div>
      </div>

      {/* Top Performing Content Table */}
      <div className="card p-5 space-y-3">
        <div className="border-b border-border pb-3">
          <h3 className="font-heading font-bold text-base text-neutral-900">
            Top Performing Content
          </h3>
          <p className="text-xs text-muted">Ranked by organic reach and engagement rate</p>
        </div>

        {topPosts.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <BarChart3 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No content analytics available yet</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Publish posts through your connected platforms to begin tracking reach, impressions, and engagement metrics.
            </p>
            <Link
              href="/content-studio"
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create First Post</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Post Content / Headline</th>
                  <th className="py-2.5">Platform</th>
                  <th className="py-2.5">Impressions</th>
                  <th className="py-2.5">Engagement</th>
                  <th className="py-2.5">Shares</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topPosts.map((post, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 font-semibold text-neutral-900">{post.title}</td>
                    <td className="py-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[10.5px]">
                        {post.platform}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-medium">{post.impressions}</td>
                    <td className="py-3 font-mono font-bold text-emerald-600">{post.engagement}</td>
                    <td className="py-3 font-mono">{post.shares}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
