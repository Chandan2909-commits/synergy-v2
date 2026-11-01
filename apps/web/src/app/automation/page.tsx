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
  Plus,
  Workflow,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { ApprovalMode } from '@synergy/types';

export default function AutomationPage() {
  const { getCurrentBusiness, setTopbarLoading } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const [approvalMode, setApprovalMode] = useState<ApprovalMode>('conditional');
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null);

  const [workflows, setWorkflows] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      schedule: string;
      targetPlatforms: string[];
      personas: string[];
      isActive: boolean;
      lastRun: string;
      budgetUsd: number;
      currentSpendUsd: number;
    }>
  >([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWfName, setNewWfName] = useState('');
  const [newWfDesc, setNewWfDesc] = useState('');
  const [newWfSchedule, setNewWfSchedule] = useState('Every Monday at 9:00 AM UTC');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['LinkedIn', 'X']);

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName.trim()) return;

    const newWf = {
      id: `wf-${Date.now()}`,
      name: newWfName.trim(),
      description: newWfDesc.trim() || 'Autonomous content planning, generation, and validation pipeline.',
      schedule: newWfSchedule,
      targetPlatforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['LinkedIn'],
      personas: ['Strategist', 'Writer', 'Designer', 'QA Agent'],
      isActive: true,
      lastRun: 'Never',
      budgetUsd: 50,
      currentSpendUsd: 0,
    };

    setWorkflows((prev) => [newWf, ...prev]);
    setNewWfName('');
    setNewWfDesc('');
    setIsModalOpen(false);
  };

  const handleTriggerManual = (wfName: string) => {
    setTriggerStatus(null);
    setTopbarLoading(true);
    setTimeout(() => {
      setTopbarLoading(false);
      setTriggerStatus(`Pipeline "${wfName}" queued for execution in background queue.`);
      setTimeout(() => setTriggerStatus(null), 4000);
    }, 800);
  };

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'CrossTech'} • Marketing Automation`}
        title="Autonomous Marketing Engine & Workflows"
        description="Continuous marketing operations. Synergy autonomously plans, drafts, designs, validates, and queues multi-platform content on recurring schedules without manual prompt engineering."
        primaryAction={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-hero-primary cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Workflow</span>
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
            Background Queue Scheduler
          </span>
        </div>

        {workflows.length === 0 ? (
          <div className="card p-12 text-center max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <Workflow className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-neutral-900">
              No automated workflows yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Create a recurring schedule (e.g., Weekly content engine or mid-week industry reactions) to autonomously orchestrate your AI personas.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-primary mt-2 inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Workflow</span>
            </button>
          </div>
        ) : (
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
                        Active Schedule
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      {wf.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTriggerManual(wf.name)}
                    className="btn btn-secondary text-xs cursor-pointer"
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
        )}
      </div>

      {/* Create Workflow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-lg text-neutral-900">
              Create Autonomous Workflow
            </h3>
            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Workflow Name
                </label>
                <input
                  type="text"
                  required
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  placeholder="e.g. Weekly Content Production Pipeline"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newWfDesc}
                  onChange={(e) => setNewWfDesc(e.target.value)}
                  placeholder="What will this workflow plan and generate?"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Execution Schedule
                </label>
                <select
                  value={newWfSchedule}
                  onChange={(e) => setNewWfSchedule(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="Every Sunday at 10:00 AM UTC">Every Sunday at 10:00 AM UTC</option>
                  <option value="Every Monday at 9:00 AM UTC">Every Monday at 9:00 AM UTC</option>
                  <option value="Every Wednesday at 2:00 PM UTC">Every Wednesday at 2:00 PM UTC</option>
                  <option value="Daily at 8:00 AM UTC">Daily at 8:00 AM UTC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Platforms
                </label>
                <div className="flex gap-2">
                  {['Instagram', 'LinkedIn', 'X'].map((plat) => {
                    const isChecked = selectedPlatforms.includes(plat);
                    return (
                      <button
                        type="button"
                        key={plat}
                        onClick={() => {
                          setSelectedPlatforms((prev) =>
                            prev.includes(plat)
                              ? prev.filter((p) => p !== plat)
                              : [...prev, plat]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {plat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer shadow-sm"
                >
                  Save & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
