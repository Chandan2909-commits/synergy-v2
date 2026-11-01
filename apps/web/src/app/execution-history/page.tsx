'use client';

import React from 'react';
import { History, CheckCircle2, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export default function ExecutionHistoryPage() {
  const { getCurrentBusiness } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const executions = [
    {
      id: 'exec-1049',
      workflowName: 'Autonomous Weekly Marketing Engine',
      trigger: 'Cron (Scheduled)',
      status: 'Success',
      postsGenerated: 7,
      tokensUsed: '24,810',
      costUsd: '$0.49',
      duration: '42s',
      timestamp: 'Today at 10:00:14 AM UTC',
      steps: ['Strategist Plan', 'Writer Narrative', 'Visual Carousel Slides', 'QA Gate Pass'],
    },
    {
      id: 'exec-1048',
      workflowName: 'Mid-Week Engagement & Industry Pulse',
      trigger: 'Cron (Scheduled)',
      status: 'Success',
      postsGenerated: 3,
      tokensUsed: '11,200',
      costUsd: '$0.22',
      duration: '18s',
      timestamp: 'Oct 28 at 2:00:08 PM UTC',
      steps: ['Strategist Trend', 'Writer Posts', 'QA Gate Pass'],
    },
    {
      id: 'exec-1047',
      workflowName: 'Campaign Flash Content Generation',
      trigger: 'Manual API Trigger',
      status: 'Requires Approval',
      postsGenerated: 2,
      tokensUsed: '8,400',
      costUsd: '$0.17',
      duration: '14s',
      timestamp: 'Oct 26 at 6:45:00 PM UTC',
      steps: ['Writer Posts', 'QA Flag: Brand Voice Borderline (Score 89%)'],
    },
  ];

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Automation History`}
        title="Pipeline Execution Logs & Audit Trail"
        description="Comprehensive audit of all autonomous agent workflows, step-by-step persona execution telemetry, tokens consumed, and external publishing API dispatch results."
      />

      <div className="card p-5 space-y-4">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-neutral-900">
            Recent Workflow Executions
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">
            Showing last 3 executions
          </span>
        </div>

        <div className="space-y-4">
          {executions.map((exec) => (
            <div
              key={exec.id}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {exec.id}
                  </span>
                  <span className="font-heading font-bold text-sm text-neutral-900">
                    {exec.workflowName}
                  </span>
                  <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-medium">
                    {exec.trigger}
                  </span>
                </div>

                <span
                  className={`text-[10.5px] font-bold px-2 py-0.5 rounded-pill ${
                    exec.status === 'Success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {exec.status}
                </span>
              </div>

              {/* Step Sequence Badges */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                {exec.steps.map((step, idx) => (
                  <React.Fragment key={step}>
                    <span className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-700 font-medium">
                      {step}
                    </span>
                    {idx < exec.steps.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Metrics Row */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 font-mono">
                <span>Timestamp: {exec.timestamp}</span>
                <div className="flex items-center gap-4">
                  <span>Duration: {exec.duration}</span>
                  <span>Tokens: {exec.tokensUsed}</span>
                  <span className="font-bold text-slate-800">Cost: {exec.costUsd}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

