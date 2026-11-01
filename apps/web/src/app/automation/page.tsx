'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Shield,
  Bot,
  Zap,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { ApprovalMode } from '@synergy/types';

export default function AutomationPage() {
  const { getCurrentBusiness, setTopbarLoading } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const [approvalMode, setApprovalMode] = useState<ApprovalMode>('conditional');
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null);

  const workflows = [
    {
      id: 'wf-1',
      name: 'Autonomous Weekly Marketing Engine',
      description:
        'Every Sunday at 10:00 AM, Marketing Strategist plans content pillars, Content Writer drafts captions & carousels, Visual Designer formats slides, and QA verifies.',
      schedule: 'Every Sunday at 10:00 AM UTC',
      targetPlatforms: ['Instagram', 'LinkedIn', 'X'],
      personas: ['Strategist', 'Writer', 'Designer', 'QA Agent'],
      isActive: true,
      lastRun: 'Oct 29, 2026 • Generated 8 Posts',
      budgetUsd: 50,
      currentSpendUsd: 14.2,
    },
    {
      id: 'wf-2',
      name: 'Mid-Week Engagement & Industry Pulse',
      description:
        'Every Wednesday at 2:00 PM, identifies industry news trends and creates short-form reaction posts for LinkedIn & X.',
      schedule: 'Every Wednesday at 2:00 PM UTC',
      targetPlatforms: ['LinkedIn', 'X'],
      personas: ['Strategist', 'Writer', 'QA Agent'],
      isActive: true,
      lastRun: 'Oct 25, 2026 • Generated 3 Posts',
      budgetUsd: 30,
      currentSpendUsd: 8.5,
    },
  ];

  const handleTriggerManual = (wfName: string) => {
    setTriggerStatus(null);
    setTopbarLoading(true);
    setTimeout(() => {
      setTopbarLoading(false);
      setTriggerStatus(`Pipeline "${wfName}" queued for BullMQ background execution.`);
      setTimeout(() => setTriggerStatus(null), 4000);
    }, 900);
  };

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Marketing Automation`}
        title="Autonomous Marketing Engine & Workflows"
        description="Continuous marketing operations. Synergy autonomously plans, drafts, designs, validates, and queues multi-platform content on recurring schedules without manual prompt engineering."
        primaryAction={
          <button
            type="button"
            onClick={() => handleTriggerManual('Autonomous Weekly Marketing Engine')}
            className="btn-hero-primary"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Pipeline Now</span>
          </button>
        }
      />

      {triggerStatus && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs font-bold text-blue-900 animate-fade-in flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{triggerStatus}</span>
        </div>
      )}

      {/* Global Safety & Approval Mode Selector Card */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="font-heading font-bold text-base text-neutral-900">
              Autonomous Approval & Safety Policy
            </h3>
            <p className="text-xs text-muted">
              Configure human oversight level before background queue publishing
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 uppercase">
            Mode: {approvalMode.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-1">
          {[
            {
              id: 'manual',
              title: 'Mode A — Manual Approval',
              desc: 'AI drafts & QA validates all content, but an authorized human team member must explicitly approve each post before publishing.',
            },
            {
              id: 'conditional',
              title: 'Mode B — Conditional Autonomy',
              desc: 'Content passing strict Brand Kit score (>95%) and zero policy flags publishes automatically. Edge cases or low confidence escalate to human review.',
            },
            {
              id: 'full_auto',
              title: 'Mode C — Full Auto-Publishing',
              desc: 'Continuous autonomous planning and publishing directly into verified platform queues within configured monthly budget limits.',
            },
          ].map((mode) => {
            const isSelected = approvalMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => setApprovalMode(mode.id as ApprovalMode)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-neutral-900 bg-slate-50 shadow-sm'
                    : 'border-border bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-bold text-sm text-neutral-900">
                    {mode.title}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {mode.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Automation Pipelines */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-neutral-900">
            Active Marketing Pipelines
          </h3>
          <span className="text-xs text-muted font-medium">
            Powered by BullMQ Scheduler & Redis Workers
          </span>
        </div>

        <div className="space-y-4">
          {workflows.map((wf) => (
            <div key={wf.id} className="card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-heading font-bold text-base text-neutral-900">
                      {wf.name}
                    </h4>
                    <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-pill border border-emerald-200">
                      Active Cron
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {wf.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTriggerManual(wf.name)}
                  className="btn btn-secondary text-xs"
                >
                  <Play className="w-3 h-3" />
                  <span>Execute Now</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 p-3 bg-slate-50 rounded-md border border-border text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Execution Schedule
                  </span>
                  <span className="font-semibold text-slate-800">{wf.schedule}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Target Platforms
                  </span>
                  <span className="font-semibold text-slate-800">
                    {wf.targetPlatforms.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Personas Orchestrated
                  </span>
                  <span className="font-semibold text-slate-800">
                    {wf.personas.join(' → ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Last Execution Run
                  </span>
                  <span className="font-semibold text-slate-800">{wf.lastRun}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

