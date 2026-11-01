'use client';

import React from 'react';
import { Topbar } from '@/components/topbar/Topbar';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { CommandPaletteModal } from '@/components/command/CommandPaletteModal';
import { CreateBusinessModal } from '@/components/business/CreateBusinessModal';

export function FloatingIslandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-screen bg-bg-app relative overflow-hidden select-none">
      {/* 1. Full-Width Sticky Floating Topbar */}
      <Topbar />

      {/* 2. Main Body: Floating Sidebar + Scrollable View Canvas */}
      <div className="flex flex-1 relative min-h-0 overflow-hidden">
        {/* Floating Left Sidebar */}
        <Sidebar />

        {/* Dynamic Main View Content Canvas */}
        <main
          id="main-content"
          className="flex-1 px-7 pt-4 pb-8 min-w-0 overflow-y-auto"
        >
          {children}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <CommandPaletteModal />
      <CreateBusinessModal />
    </div>
  );
}

