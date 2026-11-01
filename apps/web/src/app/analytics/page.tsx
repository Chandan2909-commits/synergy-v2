'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Share2,
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
    { label: 'Total Reach', value: '724.8K', change: '+18.4%', icon: Eye },
    { label: 'Follower Growth', value: '+3,420', change: '+8.1%', icon: Users },
    { label: 'Total Interactions', value: '38.9K', change: '+14.2%', icon: Heart },
    { label: 'Comments & Mentions', value: '4,180', change: '+9.8%', icon: MessageSquare },
  ];

  const topPosts = [
    {
      title: '5 AI Automations Transforming Modern E-Commerce',
      platform: 'Instagram',
      impressions: '142.4K',
      engagement: '9.8K (6.9%)',
      shares: '1,240',
    },
    {
      title: 'Why Founders Must Decouple Strategy from Pure Execution',
      platform: 'LinkedIn',
      impressions: '88.1K',
      engagement: '4.2K (4.8%)',
      shares: '820',
    },
    {
      title: 'The math behind continuous autonomous marketing operations',
      platform: 'X (Twitter)',
      impressions: '42.9K',
      engagement: '2.1K (4.9%)',
      shares: '410',
    },
  ];

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Performance Intelligence`}
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
              <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-block">
                {m.change} vs previous period
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
              {topPosts.map((post) => (
                <tr key={post.title} className="hover:bg-slate-50">
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
      </div>
    </div>
  );
}

