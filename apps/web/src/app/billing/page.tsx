'use client';

import React from 'react';
import { CreditCard, Zap, Check, ArrowUpRight, DollarSign } from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export default function BillingPage() {
  const { currentOrganization } = useWorkspaceStore();

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge="CrossTech Solutions • Enterprise SaaS"
        title="Subscription Plans & AI Usage Quotas"
        description="Monitor organization-wide token consumption, provider billing breakdown, and manage multi-business workspace allotments."
        primaryAction={
          <button type="button" className="btn-hero-primary">
            <Zap className="w-3.5 h-3.5" />
            <span>Upgrade Subscription</span>
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-5">
        <div className="card p-6 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Tier
          </span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900">
            Growth Agency Plan
          </div>
          <p className="text-xs text-slate-600">
            Up to 10 Managed Businesses, Unlimited Scheduled Posts, and 4 Concurrent AI Personas.
          </p>
          <div className="pt-3 border-t border-border font-bold text-sm text-neutral-900">
            $199 / month
          </div>
        </div>

        <div className="card p-6 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Monthly AI Token Budget
          </span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900">
            $73.60 / $250.00
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '29.4%' }} />
          </div>
          <p className="text-xs text-slate-500 font-mono">
            29.4% consumed • 18 days remaining in billing cycle
          </p>
        </div>

        <div className="card p-6 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Workspaces Quota
          </span>
          <div className="font-heading font-extrabold text-2xl text-neutral-900">
            3 / 10 Workspaces
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '30%' }} />
          </div>
          <p className="text-xs text-slate-500 font-mono">
            7 business slots available for allocation
          </p>
        </div>
      </div>
    </div>
  );
}

