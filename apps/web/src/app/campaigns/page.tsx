'use client';

import React, { useState } from 'react';
import { Layers, Plus, Calendar, Target, Sparkles, ArrowUpRight } from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export default function CampaignsPage() {
  const { getCurrentBusiness } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const [campaigns, setCampaigns] = useState<
    Array<{
      id: string;
      name: string;
      objective: string;
      dateRange: string;
      postsCount: number;
      publishedCount: number;
      progressPct: number;
      status: string;
      budgetSpendUsd: number;
    }>
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newObjective, setNewObjective] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;
    const newCamp = {
      id: `camp-${Date.now()}`,
      name: newCampaignName.trim(),
      objective: newObjective.trim() || 'General brand marketing and customer engagement',
      dateRange: 'Active Now',
      postsCount: 0,
      publishedCount: 0,
      progressPct: 0,
      status: 'Active',
      budgetSpendUsd: 0,
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    setNewCampaignName('');
    setNewObjective('');
    setIsModalOpen(false);
  };

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'CrossTech'} • Marketing Campaigns`}
        title="Marketing Campaigns & Content Strategies"
        description="Organize content production into high-level strategic campaigns. The Marketing Strategist persona generates content pillars mapped to explicit campaign goals."
        primaryAction={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-hero-primary cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
        }
      />

      {campaigns.length === 0 ? (
        <div className="card p-12 text-center max-w-xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-neutral-900">
            No marketing campaigns yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Group your social media posts, target pillars, and creative assets into focused campaigns.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary mt-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Your First Campaign</span>
          </button>
        </div>
      ) : (
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
      )}

      {/* Simple Create Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-lg text-neutral-900">
              Create New Campaign
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="e.g. Q1 Product Launch, Organic Growth"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Marketing Objective
                </label>
                <textarea
                  rows={3}
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="What is the key goal of this campaign?"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
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
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
