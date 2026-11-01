'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Instagram,
  Linkedin,
  Twitter,
  Sparkles,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { POST_STATUS_CONFIG } from '@synergy/shared';

export default function CalendarPage() {
  const { getCurrentBusiness } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const [currentView, setCurrentView] = useState<'month' | 'week'>('month');

  const scheduledEvents = [
    {
      id: 'e-1',
      day: 3,
      platform: 'instagram',
      title: '7 Benefits of AI Marketing Automation',
      time: '16:00',
      status: 'scheduled',
    },
    {
      id: 'e-2',
      day: 5,
      platform: 'linkedin',
      title: 'Decoupling Strategy from Execution in SaaS',
      time: '09:30',
      status: 'approved',
    },
    {
      id: 'e-3',
      day: 7,
      platform: 'x',
      title: '5 Lessons scaling to $50k MRR without ads',
      time: '14:15',
      status: 'pending_approval',
    },
    {
      id: 'e-4',
      day: 10,
      platform: 'instagram',
      title: 'Customer Showcase: Aura Apparel Autumn Drop',
      time: '18:00',
      status: 'scheduled',
    },
    {
      id: 'e-5',
      day: 12,
      platform: 'linkedin',
      title: 'How Multi-Tenant AI Workforces Replace Generic Tools',
      time: '11:00',
      status: 'draft',
    },
    {
      id: 'e-6',
      day: 15,
      platform: 'x',
      title: 'The future of autonomous publishing is deterministic queues',
      time: '15:30',
      status: 'scheduled',
    },
  ];

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Content Calendar`}
        title="Multi-Platform Publishing Schedule"
        description="Unified calendar across Instagram, LinkedIn, and X. Autonomous background workers dispatch content at scheduled timestamps using idempotent tokens."
        primaryAction={
          <Link href="/content-studio" className="btn-hero-primary">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Post</span>
          </Link>
        }
      />

      {/* Calendar Controls Bar */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 rounded-sm border border-border bg-slate-50 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-sm border border-border bg-slate-50 hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <h2 className="font-heading font-extrabold text-lg text-neutral-900 tracking-tight">
            November 2026
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 border border-border rounded-pill">
            <button
              type="button"
              onClick={() => setCurrentView('month')}
              className={`px-3 py-1 rounded-pill text-xs font-bold transition-colors ${
                currentView === 'month'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-neutral-900'
              }`}
            >
              Month View
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('week')}
              className={`px-3 py-1 rounded-pill text-xs font-bold transition-colors ${
                currentView === 'week'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-neutral-900'
              }`}
            >
              Week View
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Month Grid */}
      <div className="card overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-border bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider py-2.5 text-center">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 auto-rows-[120px] divide-x divide-y divide-border bg-white">
          {daysInMonth.map((day) => {
            const dayEvents = scheduledEvents.filter((e) => e.day === day);
            return (
              <div
                key={day}
                className="p-2 flex flex-col justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-mono font-bold ${day === 3 ? 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center' : 'text-slate-600'}`}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {dayEvents.length} post{dayEvents.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="space-y-1 my-auto overflow-hidden">
                  {dayEvents.map((evt) => {
                    const statusCfg = POST_STATUS_CONFIG[evt.status as keyof typeof POST_STATUS_CONFIG] || POST_STATUS_CONFIG.scheduled;
                    return (
                      <div
                        key={evt.id}
                        className="px-2 py-1 rounded text-[11px] font-medium border truncate transition-all cursor-pointer hover:shadow-sm"
                        style={{
                          backgroundColor: statusCfg.bg,
                          borderColor: statusCfg.color + '40',
                          color: statusCfg.color,
                        }}
                      >
                        <div className="flex items-center gap-1 font-bold text-[10.5px]">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="truncate text-slate-800 font-semibold">{evt.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

