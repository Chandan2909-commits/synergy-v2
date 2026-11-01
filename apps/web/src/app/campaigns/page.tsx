'use client';

import React from 'react';
import { Layers, Plus, Calendar, Target, Sparkles, ArrowUpRight } from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export default function CampaignsPage() {
  const { getCurrentBusiness } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const campaigns = [
    {
      id: 'c-1',
      name: 'Q4 Autumn Drop & Sustainable Capsule',
      objective: 'Brand awareness & conversion for new organic streetwear collection',
      dateRange: 'Oct 15 - Nov 30, 2026',
      postsCount: 24,
      publishedCount: 16,
      progressPct: 67,
      status: 'Active',
      budgetSpendUsd: 42.5,
    },
    {
      id: 'c-2',
      name: 'Thought Leadership: AI in Modern Commerce',
      objective: 'Position founder as voice in sustainable supply chains & AI efficiency',
      dateRange: 'Nov 01 - Dec 15, 2026',
      postsCount: 18,
      publishedCount: 4,
      progressPct: 22,
      status: 'Active',
      budgetSpendUsd: 14.8,
    },
  ];

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Marketing Campaigns`}
        title="Marketing Campaigns & Content Strategies"
        description="Organize content production into high-level strategic campaigns. The Marketing Strategist persona generates content pillars mapped to explicit campaign goals."
        primaryAction={
          <button type="button" className="btn-hero-primary">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-5">
        {campaigns.map((camp) => (
          <div key={camp.id} className="card p-6 space-y-4 hover:border-slate-400 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
                  {camp.status}
                </span>
                <h3 className="font-heading font-bold text-base text-neutral-900 mt-2">
                  {camp.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1">{camp.objective}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border text-xs">
              <div className="flex items-center justify-between text-slate-500 font-medium">
                <span>Date Schedule</span>
                <span className="font-mono text-slate-700">{camp.dateRange}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 font-medium">
                <span>Content Progress</span>
                <span className="font-mono font-bold text-slate-800">
                  {camp.publishedCount} / {camp.postsCount} Posts ({camp.progressPct}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${camp.progressPct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

