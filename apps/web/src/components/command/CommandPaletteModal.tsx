'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  PenTool,
  Calendar,
  Bot,
  Settings,
  Share2,
  Building2,
  BarChart3,
  X,
} from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspaceStore';

interface CommandItem {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export function CommandPaletteModal() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    businesses,
    switchBusiness,
  } = useWorkspaceStore();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const defaultCommands: CommandItem[] = [
    {
      id: 'cmd-create-content',
      category: 'Actions',
      title: 'Generate New Content / Carousel',
      description: 'Trigger Content Writer & Visual Designer personas',
      icon: PenTool,
      action: () => {
        router.push('/content-studio');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-run-workflow',
      category: 'Automation',
      title: 'Trigger Autonomous Marketing Workflow',
      description: 'Run weekly multi-platform content generation pipeline',
      icon: Sparkles,
      action: () => {
        router.push('/automation');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-calendar',
      category: 'Navigation',
      title: 'Open Content Calendar',
      description: 'View scheduled posts across all connected platforms',
      icon: Calendar,
      action: () => {
        router.push('/calendar');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-ai-workforce',
      category: 'AI Workforce',
      title: 'Configure AI Personas',
      description: 'Strategist, Writer, Designer, QA Agent parameters',
      icon: Bot,
      action: () => {
        router.push('/ai-workforce');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-analytics',
      category: 'Analytics',
      title: 'Performance & KPI Reports',
      description: 'Impressions, reach, engagement, and follower growth',
      icon: BarChart3,
      action: () => {
        router.push('/analytics');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-integrations',
      category: 'Integrations',
      title: 'Manage Social Media Connections',
      description: 'Connect Instagram, LinkedIn, and X via official OAuth',
      icon: Share2,
      action: () => {
        router.push('/integrations');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cmd-settings-brandkit',
      category: 'Settings',
      title: 'Edit Business Brand Kit',
      description: 'Manage brand voice, logo, colors, and content rules',
      icon: Settings,
      action: () => {
        router.push('/settings?tab=brand-kit');
        setCommandPaletteOpen(false);
      },
    },
  ];

  // Business switcher items
  const businessCommands: CommandItem[] = businesses.map((b) => ({
    id: `biz-${b.id}`,
    category: 'Switch Business',
    title: `Switch to ${b.name}`,
    description: b.industry || 'Business Workspace',
    icon: Building2,
    action: () => {
      switchBusiness(b.id);
      setCommandPaletteOpen(false);
    },
  }));

  const allItems = [...defaultCommands, ...businessCommands];
  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-start justify-center pt-24 px-4 animate-fade-in"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-[560px] bg-white border border-slate-300 rounded-[20px] overflow-hidden shadow-2xl animate-modal-spring"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-5 h-5 text-neutral-800 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search workspace..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-[15px] bg-transparent border-none outline-none text-neutral-900 placeholder-slate-400 font-medium"
            autoFocus
          />
          <kbd className="bg-slate-100 border border-slate-300 rounded px-2 py-0.5 text-[10px] font-mono text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Filterable Results List */}
        <div className="max-h-[340px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-slate-700 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold text-neutral-900 group-hover:text-neutral-950 truncate">
                        {item.title}
                      </div>
                      <div className="text-[11.5px] text-slate-500 truncate">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 shrink-0 ml-2">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

