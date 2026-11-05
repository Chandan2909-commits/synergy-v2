'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Play,
  Trash2,
  ExternalLink,
  Eye,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Layers,
  Wifi,
  ShieldCheck,
  X,
  RefreshCw,
  Sliders,
  Send,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { POST_STATUS_CONFIG } from '@synergy/shared';

interface ScheduledPostItem {
  id: string;
  title: string;
  caption: string;
  platform?: string;
  platforms?: string[];
  scheduledFor: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';
  slides?: string[];
  slidePaths?: string[];
  previewUrl?: string | null;
  slideCount?: number;
  createdAt?: string;
  publishedAt?: string;
  error?: string;
}

export default function CalendarPage() {
  const { getCurrentBusiness } = useWorkspaceStore();
  const business = getCurrentBusiness();

  // Navigation State
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week'>('month');

  // Posts & Queue State
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPostItem[]>([]);
  const [selectedPost, setSelectedPost] = useState<ScheduledPostItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDispatchingNow, setIsDispatchingNow] = useState<boolean>(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);

  // Sync scheduled posts from API, Bridge, and LocalStorage
  const syncScheduledPosts = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    const businessId = business?.id || 'biz-crosstech';
    const storageKey = `synergy_scheduled_posts_${businessId}`;

    const itemsMap = new Map<string, ScheduledPostItem>();

    // 1. Read from localStorage
    if (typeof window !== 'undefined') {
      try {
        const localSaved = localStorage.getItem(storageKey);
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any) => {
              if (item.id) itemsMap.set(item.id, item);
            });
          }
        }
      } catch (err) {
        console.error('Error reading localStorage scheduled posts:', err);
      }
    }

    // 2. Fetch from Next.js Schedule API (/api/instagram/schedule)
    try {
      const res = await fetch('/api/instagram/schedule');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          data.posts.forEach((item: ScheduledPostItem) => {
            if (item.id) {
              const existing = itemsMap.get(item.id);
              itemsMap.set(item.id, { ...existing, ...item });
            }
          });
        }
      }
    } catch {
      // Offline or network error
    }

    // 3. Try to fetch from Local Companion Bridge directly (127.0.0.1:4545/schedule)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const bridgeRes = await fetch('http://127.0.0.1:4545/schedule', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (bridgeRes.ok) {
        const bridgeData = await bridgeRes.json();
        if (bridgeData.success && Array.isArray(bridgeData.posts)) {
          bridgeData.posts.forEach((item: ScheduledPostItem) => {
            if (item.id) {
              const existing = itemsMap.get(item.id);
              itemsMap.set(item.id, { ...existing, ...item });
            }
          });
        }
      }
    } catch {
      // Bridge may not be running, that's fine
    }

    const merged = Array.from(itemsMap.values()).sort(
      (a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    );

    setScheduledPosts(merged);
    setIsLoading(false);
    if (isManualRefresh) setIsRefreshing(false);
  }, [business?.id]);

  // Initial load + 10s auto-polling to track status changes (publishing -> published)
  useEffect(() => {
    syncScheduledPosts();
    const interval = setInterval(() => {
      syncScheduledPosts();
    }, 10000);
    return () => clearInterval(interval);
  }, [syncScheduledPosts]);

  // Listen for Extension Communication
  useEffect(() => {
    const handleExtensionMessage = (event: MessageEvent) => {
      if (!event.data || event.data.source !== 'SYNERGY_EXTENSION') return;

      const { type, message, success, error } = event.data;

      if (type === 'PROGRESS_UPDATE' && message) {
        setDispatchStatus(message);
      }

      if (type === 'POST_RESULT') {
        setIsDispatchingNow(false);
        if (success) {
          setDispatchStatus('🎉 Successfully published to Instagram via Extension!');
          setTimeout(() => {
            syncScheduledPosts();
          }, 1500);
        } else {
          setDispatchStatus(`❌ Extension error: ${error || 'Failed to complete Instagram post'}`);
        }
      }
    };

    window.addEventListener('message', handleExtensionMessage);
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, [syncScheduledPosts]);

  // AUTOMATED DUE-POST QUEUE WATCHER (Triggers posts automatically at their exact scheduled time)
  useEffect(() => {
    const queueInterval = setInterval(() => {
      if (isDispatchingNow) return; // Strict one-by-one execution

      const now = Date.now();
      const duePost = scheduledPosts.find(
        (p) => (!p.status || p.status === 'scheduled') && new Date(p.scheduledFor).getTime() <= now
      );

      if (duePost) {
        console.log(`[Content Calendar] ⏰ Exact scheduled time arrived for "${duePost.title}". Auto-triggering...`);
        handleDispatchNow(duePost);
      }
    }, 3000);

    return () => clearInterval(queueInterval);
  }, [scheduledPosts, isDispatchingNow]);

  // Month Navigation Handlers
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    setViewDate(new Date());
  };

  // Calendar Geometry Calculations
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const today = new Date();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();

  // Leading days from previous month
  const leadingDays = Array.from({ length: firstDayOfWeek }, (_, i) => ({
    dayNumber: prevMonthTotalDays - firstDayOfWeek + i + 1,
    isCurrentMonth: false,
    date: new Date(currentYear, currentMonth - 1, prevMonthTotalDays - firstDayOfWeek + i + 1),
  }));

  // Current month days
  const currentMonthDays = Array.from({ length: totalDaysInMonth }, (_, i) => ({
    dayNumber: i + 1,
    isCurrentMonth: true,
    date: new Date(currentYear, currentMonth, i + 1),
  }));

  // Trailing days to fill 5 or 6 complete weeks
  const totalSlotsSoFar = leadingDays.length + currentMonthDays.length;
  const targetTotalSlots = totalSlotsSoFar > 35 ? 42 : 35;
  const trailingDays = Array.from({ length: targetTotalSlots - totalSlotsSoFar }, (_, i) => ({
    dayNumber: i + 1,
    isCurrentMonth: false,
    date: new Date(currentYear, currentMonth + 1, i + 1),
  }));

  const allCalendarCells = [...leadingDays, ...currentMonthDays, ...trailingDays];

  // Filter posts for a given date
  const getPostsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    return scheduledPosts.filter((item) => {
      const itemDate = new Date(item.scheduledFor);
      return (
        itemDate.getFullYear() === y &&
        itemDate.getMonth() === m &&
        itemDate.getDate() === d
      );
    }).sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
  };

  // Immediate Force Dispatch from Calendar
  const handleDispatchNow = async (post: ScheduledPostItem) => {
    setIsDispatchingNow(true);
    setDispatchStatus('Initializing immediate dispatch...');

    try {
      // 1. Mark status as publishing in local state and storage
      const updatedList = scheduledPosts.map((p) =>
        p.id === post.id ? { ...p, status: 'publishing' as const } : p
      );
      setScheduledPosts(updatedList);
      if (selectedPost && selectedPost.id === post.id) {
        setSelectedPost({ ...selectedPost, status: 'publishing' });
      }

      // 2. If Chrome Extension is available, dispatch via Extension
      const hasExtension =
        typeof document !== 'undefined' &&
        Boolean(document.documentElement.getAttribute('data-synergy-extension'));

      if (hasExtension) {
        setDispatchStatus('🚀 Triggering Synergy Extension automated posting in popup window...');
        window.postMessage(
          {
            source: 'SYNERGY_WEB_STUDIO',
            type: 'PUBLISH_INSTAGRAM',
            payload: {
              id: post.id,
              slides: post.slides || [],
              caption: post.caption,
              stealthMode: true,
            },
          },
          '*'
        );
        return; // The extension message listener will handle completion
      }

      // 3. Fallback: Dispatch via bridge or API
      let success = false;
      let errorMsg = '';

      // Try companion bridge first
      try {
        const bridgeRes = await fetch('http://127.0.0.1:4545/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slides: post.slides || [],
            caption: post.caption,
            headless: false,
            stealthMode: true,
          }),
        });
        if (bridgeRes.ok) {
          const bData = await bridgeRes.json();
          if (bData.success) success = true;
          else errorMsg = bData.error || 'Bridge publishing failed';
        }
      } catch {
        // Fallback to Next.js API
        try {
          const apiRes = await fetch('/api/instagram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              slides: post.slides || [],
              caption: post.caption,
              headless: false,
              stealthMode: true,
            }),
          });
          const apiData = await apiRes.json();
          if (apiData.success) success = true;
          else errorMsg = apiData.error || 'Serverless publishing failed';
        } catch (apiErr: any) {
          errorMsg = apiErr.message;
        }
      }

      if (success) {
        setDispatchStatus('🎉 Successfully published to Instagram!');
        const finalPublished = scheduledPosts.map((p) =>
          p.id === post.id
            ? { ...p, status: 'published' as const, publishedAt: new Date().toISOString() }
            : p
        );
        setScheduledPosts(finalPublished);
        if (selectedPost && selectedPost.id === post.id) {
          setSelectedPost({
            ...selectedPost,
            status: 'published',
            publishedAt: new Date().toISOString(),
          });
        }
      } else {
        setDispatchStatus(`❌ Failed to publish: ${errorMsg}`);
        const finalFailed = scheduledPosts.map((p) =>
          p.id === post.id ? { ...p, status: 'failed' as const, error: errorMsg } : p
        );
        setScheduledPosts(finalFailed);
      }
    } finally {
      setIsDispatchingNow(false);
      setTimeout(() => {
        setDispatchStatus(null);
        syncScheduledPosts();
      }, 4000);
    }
  };

  // Delete / Cancel Scheduled Post
  const handleCancelPost = async (postId: string) => {
    if (!confirm('Are you sure you want to cancel this scheduled post?')) return;

    // 1. Remove from local storage
    const businessId = business?.id || 'biz-crosstech';
    const storageKey = `synergy_scheduled_posts_${businessId}`;
    if (typeof window !== 'undefined') {
      try {
        const localSaved = localStorage.getItem(storageKey);
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          if (Array.isArray(parsed)) {
            const updated = parsed.filter((p: any) => p.id !== postId);
            localStorage.setItem(storageKey, JSON.stringify(updated));
          }
        }
      } catch {}
    }

    // 2. Call API DELETE
    try {
      await fetch(`/api/instagram/schedule?id=${encodeURIComponent(postId)}`, {
        method: 'DELETE',
      });
    } catch {}

    // 3. Call Bridge DELETE
    try {
      await fetch(`http://127.0.0.1:4545/schedule?id=${encodeURIComponent(postId)}`, {
        method: 'DELETE',
      });
    } catch {}

    setScheduledPosts((prev) => prev.filter((p) => p.id !== postId));
    setSelectedPost(null);
  };

  // Copy caption helper
  const handleCopyCaption = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  // Compute countdown string
  const getCountdownString = (isoDate: string) => {
    const diffMs = new Date(isoDate).getTime() - Date.now();
    if (diffMs <= 0) return 'Due now (Queue processing)';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `In ${days} day${days > 1 ? 's' : ''} ${hours % 24}h`;
    }
    if (hours > 0) return `In ${hours}h ${minutes}m`;
    return `In ${minutes} minutes`;
  };

  // Summary Metrics
  const totalScheduled = scheduledPosts.filter((p) => p.status === 'scheduled').length;
  const totalPublished = scheduledPosts.filter((p) => p.status === 'published').length;
  const postsThisMonth = scheduledPosts.filter((p) => {
    const d = new Date(p.scheduledFor);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).length;

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Content Calendar`}
        title="Multi-Platform Publishing Schedule"
        description="Unified calendar across Instagram, LinkedIn, and X. Autonomous background workers dispatch content at scheduled timestamps one-by-one with zero browser conflicts."
        primaryAction={
          <Link href="/content-studio" className="btn-hero-primary">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Post</span>
          </Link>
        }
      />

      {/* Autonomous Queue Health & Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-border rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Scheduled Queue</div>
              <div className="text-lg font-extrabold text-neutral-900">{totalScheduled} Posts</div>
            </div>
          </div>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
            Pending
          </span>
        </div>

        <div className="p-3.5 bg-white border border-border rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Published</div>
              <div className="text-lg font-extrabold text-neutral-900">{totalPublished} Done</div>
            </div>
          </div>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Live
          </span>
        </div>

        <div className="p-3.5 bg-white border border-border rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">This Month</div>
              <div className="text-lg font-extrabold text-neutral-900">{postsThisMonth} Posts</div>
            </div>
          </div>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
            {monthName.split(' ')[0]}
          </span>
        </div>

        <div className="p-3.5 bg-white border border-border rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Queue Worker</div>
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active (10s Interval)</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => syncScheduledPosts(true)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
            title="Refresh Scheduled Queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Calendar Controls Bar */}
      <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-border bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-border bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleGoToToday}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-border bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              Today
            </button>
          </div>
          <h2 className="font-heading font-extrabold text-lg text-neutral-900 tracking-tight">
            {monthName}
          </h2>
        </div>

        <div className="flex items-center gap-3">
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

          <Link
            href="/content-studio"
            className="btn btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Post</span>
          </Link>
        </div>
      </div>

      {/* ======================================================================
          VIEW A: MONTH VIEW GRID (With multi-post per day support)
          ====================================================================== */}
      {currentView === 'month' && (
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
          <div className="grid grid-cols-7 auto-rows-[135px] divide-x divide-y divide-border bg-white">
            {allCalendarCells.map((cell, idx) => {
              const dayPosts = getPostsForDate(cell.date);
              const isToday =
                cell.isCurrentMonth &&
                cell.dayNumber === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <div
                  key={idx}
                  className={`p-2 flex flex-col justify-between transition-colors overflow-hidden ${
                    cell.isCurrentMonth ? 'bg-white hover:bg-slate-50/50' : 'bg-slate-50/40 text-slate-400'
                  }`}
                >
                  {/* Cell Header: Day Number + Count */}
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-mono font-bold text-xs ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs'
                          : cell.isCurrentMonth
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {dayPosts.length > 0 && (
                      <span className="text-[10px] font-semibold font-mono text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded-full">
                        {dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Cell Posts (Supports multiple posts chronologically) */}
                  <div className="space-y-1 my-auto overflow-y-auto max-h-[96px] pr-0.5">
                    {dayPosts.map((post) => {
                      const postDate = new Date(post.scheduledFor);
                      const timeStr = postDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const statusCfg =
                        POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG] ||
                        POST_STATUS_CONFIG.scheduled;

                      const isCarousel = (post.slides && post.slides.length > 1) || (post.slideCount && post.slideCount > 1);

                      return (
                        <div
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className="px-2 py-1 rounded text-[11px] font-medium border truncate transition-all cursor-pointer hover:shadow-md hover:scale-[1.01]"
                          style={{
                            backgroundColor: statusCfg.bg,
                            borderColor: statusCfg.color + '40',
                            color: statusCfg.color,
                          }}
                          title={`Click to inspect or dispatch: ${post.title}`}
                        >
                          <div className="flex items-center justify-between gap-1 font-bold text-[10px]">
                            <div className="flex items-center gap-1 truncate">
                              <Instagram className="w-2.5 h-2.5 shrink-0 text-pink-600" />
                              <span>{timeStr}</span>
                            </div>
                            {isCarousel && (
                              <span className="text-[9px] font-mono opacity-80 shrink-0">
                                {post.slides?.length || post.slideCount} slides
                              </span>
                            )}
                          </div>
                          <div className="truncate text-slate-900 font-semibold text-[10.5px] mt-0.5">
                            {post.title || post.caption}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================
          VIEW B: WEEK VIEW
          ====================================================================== */}
      {currentView === 'week' && (
        <div className="card overflow-hidden">
          <div className="p-3 border-b border-border bg-slate-50 flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>Showing current week: 7-day chronological dispatch schedule</span>
            <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              One-by-One Residential Execution
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-border bg-white min-h-[400px]">
            {Array.from({ length: 7 }, (_, i) => {
              const startOfWeek = new Date(viewDate);
              startOfWeek.setDate(viewDate.getDate() - viewDate.getDay() + i);
              const weekPosts = getPostsForDate(startOfWeek);
              const isToday =
                startOfWeek.getDate() === today.getDate() &&
                startOfWeek.getMonth() === today.getMonth() &&
                startOfWeek.getFullYear() === today.getFullYear();

              return (
                <div key={i} className="p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase">
                          {startOfWeek.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div
                          className={`font-mono font-bold text-sm ${
                            isToday ? 'text-purple-600' : 'text-neutral-900'
                          }`}
                        >
                          {startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      {weekPosts.length > 0 && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          {weekPosts.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mt-3">
                      {weekPosts.map((post) => {
                        const statusCfg =
                          POST_STATUS_CONFIG[post.status as keyof typeof POST_STATUS_CONFIG] ||
                          POST_STATUS_CONFIG.scheduled;
                        const timeStr = new Date(post.scheduledFor).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <div
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="p-2.5 rounded-xl border text-xs cursor-pointer hover:shadow-md transition-all space-y-1.5"
                            style={{
                              backgroundColor: statusCfg.bg,
                              borderColor: statusCfg.color + '40',
                            }}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold flex items-center gap-1" style={{ color: statusCfg.color }}>
                                <Clock className="w-3 h-3" />
                                <span>{timeStr}</span>
                              </span>
                              <span className="text-[10px] font-mono uppercase font-bold" style={{ color: statusCfg.color }}>
                                {statusCfg.label}
                              </span>
                            </div>
                            <p className="font-semibold text-neutral-900 line-clamp-2 text-[11px]">
                              {post.title}
                            </p>
                          </div>
                        );
                      })}
                      {weekPosts.length === 0 && (
                        <div className="py-8 text-center text-slate-400 text-xs">
                          No posts scheduled
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/content-studio"
                    className="mt-3 py-1.5 text-center text-[11px] font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                  >
                    + Add Post
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================
          INTERACTIVE POST INSPECTION & DISPATCH MODAL
          ====================================================================== */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-xl w-full p-6 space-y-5 animate-scale-up max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-pink-100 text-pink-700">
                    <Instagram className="w-4 h-4" />
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-neutral-900">
                    {selectedPost.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Scheduled for:</span>
                  <span className="font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded font-mono">
                    {new Date(selectedPost.scheduledFor).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Countdown Bar */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Status:</span>
                <span
                  className="px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider"
                  style={{
                    backgroundColor:
                      (POST_STATUS_CONFIG[selectedPost.status as keyof typeof POST_STATUS_CONFIG] ||
                        POST_STATUS_CONFIG.scheduled).bg,
                    color:
                      (POST_STATUS_CONFIG[selectedPost.status as keyof typeof POST_STATUS_CONFIG] ||
                        POST_STATUS_CONFIG.scheduled).color,
                  }}
                >
                  {selectedPost.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-purple-900 bg-purple-100/70 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>{getCountdownString(selectedPost.scheduledFor)}</span>
              </div>
            </div>

            {/* Carousel Slide Previews (Horizontal Thumbnail Gallery) */}
            {selectedPost.slides && selectedPost.slides.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    <span>Carousel Slides ({selectedPost.slides.length})</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">High-Res PNGs</span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1">
                  {selectedPost.slides.map((slide, sIdx) => (
                    <div
                      key={sIdx}
                      className="relative shrink-0 w-24 h-32 rounded-lg border border-slate-300 overflow-hidden shadow-xs bg-slate-900"
                    >
                      <img
                        src={slide}
                        alt={`Slide ${sIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 bg-black/75 text-white text-[9px] font-mono font-bold rounded">
                        #{sIdx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Predefined Caption & Hashtags */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-700">
                  Predefined Caption &amp; Hashtags
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCaption(selectedPost.caption)}
                  className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 text-[11px]"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-neutral-800 leading-relaxed max-h-32 overflow-y-auto font-medium whitespace-pre-wrap">
                {selectedPost.caption || 'No caption provided.'}
              </div>
            </div>

            {/* One-by-One Queue Notice */}
            <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 text-[11px] text-purple-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Synergy Autonomous Residential Worker</span>
              </div>
              <p className="leading-relaxed">
                At the exact moment of <strong>{new Date(selectedPost.scheduledFor).toLocaleTimeString()}</strong>, the companion runner will launch the desktop browser and execute the post one-by-one.
              </p>
            </div>

            {/* Dispatch Status Alert */}
            {dispatchStatus && (
              <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-600 animate-spin shrink-0" />
                <span>{dispatchStatus}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => handleCancelPost(selectedPost.id)}
                disabled={isDispatchingNow}
                className="btn btn-secondary text-xs text-rose-700 hover:bg-rose-50 hover:border-rose-200 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel Post</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="btn btn-secondary text-xs"
                >
                  Close
                </button>

                {selectedPost.status !== 'published' && (
                  <button
                    type="button"
                    onClick={() => handleDispatchNow(selectedPost)}
                    disabled={isDispatchingNow}
                    className="btn btn-primary text-xs flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold shadow-md disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 fill-current ${isDispatchingNow ? 'animate-spin' : ''}`} />
                    <span>{isDispatchingNow ? 'Dispatching...' : '⚡ Dispatch Now'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
