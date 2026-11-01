'use client';

import React from 'react';
import Link from 'next/link';
import { History, CheckCircle2, AlertTriangle, Clock, ArrowRight, Play } from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export default function ExecutionHistoryPage() {
  const { getCurrentBusiness } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const executions: Array<{
    id: string;
    workflowName: string;
    trigger: string;
    status: string;
    postsGenerated: number;
    tokensUsed: string;
    costUsd: string;
    duration: string;
    timestamp: string;
    steps: string[];
  }> = [];

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'CrossTech'} • Automation History`}
        title="Pipeline Execution Logs & Audit Trail"
        description="Comprehensive audit of all autonomous agent workflows, step-by-step persona execution telemetry, tokens consumed, and external publishing API dispatch results."
      />

      <div className="card p-5 space-y-4">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-neutral-900">
            Recent Workflow Executions
          </h3>
          <span className="text-xs font-mono font-medium text-slate-400">
            {executions.length} executions recorded
          </span>
        </div>

        {executions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <History className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No execution logs recorded yet</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Automated cron schedules and manual pipeline triggers will generate audit logs, step sequences, and token consumption reports here.
            </p>
            <Link
              href="/automation"
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Go to Workflows</span>
            </Link>
          </div>
        ) : (
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
                    <React.Fragment key={idx}>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700">
                        {step}
                      </span>
                      {idx < exec.steps.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60 font-mono">
                  <span>{exec.timestamp}</span>
                  <div className="flex items-center gap-4">
                    <span>Generated: <strong>{exec.postsGenerated} posts</strong></span>
                    <span>Tokens: {exec.tokensUsed}</span>
                    <span>Cost: {exec.costUsd}</span>
                    <span>Duration: {exec.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
