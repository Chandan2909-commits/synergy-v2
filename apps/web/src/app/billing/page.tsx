'use client';

import React from 'react';
import { CreditCard, Zap, Check, ArrowUpRight, DollarSign } from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export default function BillingPage() {
  const { currentOrganization, businesses } = useWorkspaceStore();

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${currentOrganization?.name || 'CrossTech'} • Subscription`}
        title="Subscription Plans & AI Usage Quotas"
        description="Monitor organization-wide token consumption, provider billing breakdown, and manage multi-business workspace allotments."
        primaryAction={
          <button type="button" className="btn-hero-primary cursor-pointer">
            <Zap className="w-3.5 h-3.5" />
            <span>Manage Plan</span>
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-5">
        <div className="card p-6 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Tier
          </span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900">
            Professional Plan
          </div>
          <p className="text-xs text-slate-600">
            Multi-business management, autonomous publishing queue, and 4 concurrent AI personas.
          </p>
          <div className="pt-3 border-t border-border font-bold text-sm text-neutral-900">
            Active Workspace
          </div>
        </div>

        <div className="card p-6 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Monthly AI Token Usage
          </span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900">
            $0.00 / $100.00
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '0%' }} />
          </div>
          <p className="text-xs text-slate-500 font-mono">
            0% consumed • Direct API keys configured per persona
          </p>
        </div>

        <div className="card p-6 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Workspaces Quota
          </span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900">
            {businesses.length} / 10 Workspaces
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${Math.min(businesses.length * 10, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 font-mono">
            {10 - businesses.length} business slots available
          </p>
        </div>
      </div>
    </div>
  );
}
