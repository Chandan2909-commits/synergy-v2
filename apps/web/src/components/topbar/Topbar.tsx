'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Layers, ChevronDown, Bell, LogOut, Plus, Check, Building2 } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export function Topbar() {
  const {
    currentOrganization,
    currentUser,
    businesses,
    currentBusinessId,
    switchBusiness,
    isTopbarLoading,
    setCreateBusinessModalOpen,
  } = useWorkspaceStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentBusiness = businesses.find((b) => b.id === currentBusinessId) || businesses[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleColorMap: Record<string, { bg: string; text: string; border: string }> = {
    super_admin: { bg: '#1e1e1e', text: '#ffffff', border: '#1e1e1e' },
    org_admin: { bg: '#eff6ff', text: '#1d4ed8', border: '#dbeafe' },
    business_admin: { bg: '#f4f5f7', text: '#374151', border: '#e5e7eb' },
    marketing_manager: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
    content_creator: { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
    designer: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
    analyst: { bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc' },
    viewer: { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' },
  };
  const roleBadgeStyle = roleColorMap[currentUser.role] || { bg: '#f4f5f7', text: '#374151', border: '#e5e7eb' };

  return (
    <header className="h-[56px] border border-border rounded-md mx-4 mt-3 flex items-center justify-between px-4 sticky top-3 z-[1000] shadow-sm bg-white shrink-0 relative overflow-visible">
      {/* Running Progress Loader Line */}
      <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
        <div id="topbar-loader-line" className={isTopbarLoading ? 'loading' : ''} />
      </div>

      {/* Left: Brand Logo & Business Workspace Switcher */}
      <div className="flex items-center gap-3">
        {/* Brand Mark */}
        <Link href="/dashboard" className="flex items-center gap-2.5 text-decoration-none group pr-1">
          <div className="w-7 h-7 rounded-sm bg-neutral-900 flex items-center justify-center shadow-sm shrink-0">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-[1.0625rem] text-neutral-900 tracking-[-0.03em] leading-tight">
              Synergy<span className="text-accent font-extrabold ml-0.5">OS</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-neutral-400 -mt-0.5">
              CrossTech
            </span>
          </div>
        </Link>

        {/* Hairline Divider */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* Business Workspace Switcher Pill Capsule */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            id="workspace-switcher-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 py-1.5 px-3 bg-secondary border border-border rounded-pill cursor-pointer transition-colors hover:bg-slate-200"
          >
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">
              {(currentBusiness?.name || 'S').charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-[13px] text-foreground max-w-[140px] truncate">
              {currentBusiness?.name || 'Select Business'}
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase tracking-wider"
              style={{
                backgroundColor: roleBadgeStyle.bg,
                color: roleBadgeStyle.text,
                border: `1px solid ${roleBadgeStyle.border}`,
              }}
            >
              {currentUser.role.replace('_', ' ')}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted transition-transform duration-150 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Business Switcher Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-[280px] bg-white border border-border rounded-md shadow-xl p-2 z-[2000] animate-fade-in">
              <div className="px-2.5 py-1.5 text-[11px] font-bold text-muted uppercase tracking-wider border-b border-border flex items-center justify-between">
                <span>Managed Businesses</span>
                <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                  {businesses.length}
                </span>
              </div>

              <div className="max-h-[220px] overflow-y-auto py-1 space-y-1">
                {businesses.map((biz) => {
                  const isSelected = biz.id === currentBusinessId;
                  return (
                    <button
                      key={biz.id}
                      onClick={() => {
                        switchBusiness(biz.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-left transition-colors text-[13px] ${
                        isSelected
                          ? 'bg-neutral-900 text-white font-semibold'
                          : 'hover:bg-secondary text-neutral-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <div className="truncate">
                          <div className="truncate">{biz.name}</div>
                          <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                            {biz.industry}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1.5 mt-1 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setCreateBusinessModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-pill bg-slate-100 hover:bg-slate-200 text-slate-800 text-[12px] font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Business</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Notifications & User Profile Capsule */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground hover:bg-slate-200 transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-2 py-1 px-3 bg-secondary border border-border rounded-pill">
          <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10.5px] font-bold">
            {currentUser.fullName.charAt(0).toUpperCase()}
          </div>
          <span className="text-[13px] font-semibold text-foreground max-w-[110px] truncate">
            {currentUser.fullName}
          </span>
          <button
            type="button"
            title="Logout"
            className="text-slate-400 hover:text-slate-700 transition-colors ml-0.5"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

