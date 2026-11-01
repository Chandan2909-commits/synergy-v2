'use client';

import React, { useState } from 'react';
import { X, Building2, Globe, Clock } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { Business } from '@synergy/types';

export function CreateBusinessModal() {
  const { isCreateBusinessModalOpen, setCreateBusinessModalOpen, addBusiness } = useWorkspaceStore();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');

  if (!isCreateBusinessModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      organizationId: 'org-1',
      name: name.trim(),
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      industry: industry.trim() || 'General Business',
      description: description.trim(),
      timezone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addBusiness(newBiz);
    setName('');
    setIndustry('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-border rounded-md shadow-2xl w-full max-w-lg overflow-hidden animate-modal-spring">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-neutral-900 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-neutral-900">
                Create Business Workspace
              </h3>
              <p className="text-xs text-muted">
                Each business gets isolated social accounts, AI brand kit & team roles.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCreateBusinessModalOpen(false)}
            className="p-1 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lumina Health, Quantum Robotics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3.5 bg-slate-50 border border-border rounded-sm text-sm text-neutral-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Industry / Category
              </label>
              <input
                type="text"
                placeholder="e.g. B2B SaaS, E-Commerce"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full h-10 px-3.5 bg-slate-50 border border-border rounded-sm text-sm text-neutral-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-border rounded-sm text-sm text-neutral-900 focus:bg-white focus:border-blue-600 outline-none transition-all"
              >
                <option value="America/New_York">Eastern Time (US)</option>
                <option value="America/Chicago">Central Time (US)</option>
                <option value="America/San_Francisco">Pacific Time (US)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Berlin">Berlin (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="UTC">UTC (Universal)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Short Description / Value Proposition
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of what this business does and target market..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-border rounded-sm text-sm text-neutral-900 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => setCreateBusinessModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

