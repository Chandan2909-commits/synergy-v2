'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PenTool,
  Calendar,
  Layers,
  Sparkles,
  BarChart3,
  Bot,
  History,
  Users,
  Share2,
  FolderOpen,
  Settings,
  CreditCard,
  PanelLeftClose,
  PanelLeftOpen,
  Command,
} from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspaceStore';

interface NavSection {
  title: string;
  items: {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Workspace',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Content Studio', path: '/content-studio', icon: PenTool },
      { label: 'Content Calendar', path: '/calendar', icon: Calendar },
      { label: 'Campaigns', path: '/campaigns', icon: Layers },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'AI Workforce', path: '/ai-workforce', icon: Bot, badge: '4 Active' },
      { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Automation',
    items: [
      { label: 'Workflows', path: '/automation', icon: Sparkles },
      { label: 'Execution History', path: '/execution-history', icon: History },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Team & Roles', path: '/team', icon: Users },
      { label: 'Integrations', path: '/integrations', icon: Share2, badge: 'OAuth' },
      { label: 'Media Library', path: '/media-library', icon: FolderOpen },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', path: '/settings', icon: Settings },
      { label: 'Billing & Usage', path: '/billing', icon: CreditCard },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, setCommandPaletteOpen } = useWorkspaceStore();

  const sidebarWidth = isSidebarCollapsed ? 'w-[64px]' : 'w-[224px]';

  return (
    <aside
      className={`${sidebarWidth} h-[calc(100vh-80px)] my-3 ml-4 bg-white border border-border rounded-lg shadow-sm flex flex-col shrink-0 z-10 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden`}
    >
      {/* Sidebar Header & Toggle */}
      <div
        className={`p-3 pb-2 flex items-center ${
          isSidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!isSidebarCollapsed && (
          <span className="font-heading font-extrabold text-[10px] text-slate-400 uppercase tracking-widest pl-2">
            Navigation
          </span>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1 rounded-sm border border-border bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-3.5 h-3.5" />
          ) : (
            <PanelLeftClose className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-2 pt-1 overflow-y-auto space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <ul className="space-y-0.5 list-none p-0 m-0">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-pill text-[13px] transition-all ${
                        isSidebarCollapsed ? 'justify-center px-0' : 'justify-between'
                      } ${
                        isActive
                          ? 'bg-neutral-900 text-white font-bold shadow-sm'
                          : 'text-slate-700 font-medium hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        {!isSidebarCollapsed && <span>{item.label}</span>}
                      </div>
                      {!isSidebarCollapsed && item.badge && !isActive && (
                        <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Command Palette (⌘K) Trigger */}
      <div className="p-2 border-t border-border mt-auto bg-white">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className={`w-full flex items-center py-2 px-2.5 bg-slate-50 hover:bg-slate-100 border border-border rounded-sm text-xs text-slate-600 transition-colors ${
            isSidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5 text-slate-500" />
            {!isSidebarCollapsed && <span>Command Center</span>}
          </div>
          {!isSidebarCollapsed && (
            <kbd className="bg-white border border-border rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
              ⌘K
            </kbd>
          )}
        </button>
      </div>
    </aside>
  );
}

