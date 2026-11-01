'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  PenTool,
  Sliders,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Share2,
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { SocialPlatform, CarouselSlide } from '@synergy/types';

export default function ContentStudioPage() {
  const { getCurrentBusiness, setTopbarLoading } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const [promptObjective, setPromptObjective] = useState(
    'Create an educational 5-slide carousel explaining how AI marketing automation frees up 15+ hours weekly for founders without sacrificing brand voice.'
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'instagram',
    'linkedin',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const [slides, setSlides] = useState<CarouselSlide[]>([
    {
      id: 's-1',
      slideNumber: 1,
      headline: 'The 15-Hour Founder Tax',
      bodyText:
        'Founders spend an average of 15-20 hours every week writing posts, resizing images, and manually scheduling content across disconnected platforms.',
      callToAction: 'Swipe to see the fix →',
      backgroundColor: '#111827',
      textColor: '#ffffff',
    },
    {
      id: 's-2',
      slideNumber: 2,
      headline: '01. Marketing Strategy on Autopilot',
      bodyText:
        'Instead of staring at a blank screen on Monday, your AI Strategist digests audience signals and prepares structured content pillars aligned to revenue.',
      backgroundColor: '#172554',
      textColor: '#ffffff',
    },
    {
      id: 's-3',
      slideNumber: 3,
      headline: '02. Platform Adaptation Matters',
      bodyText:
        'Never duplicate text blindly. A high-performing LinkedIn post fails on Instagram without visual carousels, and flops on X without concise punchlines.',
      backgroundColor: '#0f172a',
      textColor: '#ffffff',
    },
    {
      id: 's-4',
      slideNumber: 4,
      headline: '03. Deterministic Safety Gates',
      bodyText:
        'AI drafts the content, but your Brand Kit rules and QA Agent check every post before a single byte hits official social APIs.',
      backgroundColor: '#1e1e1e',
      textColor: '#ffffff',
    },
    {
      id: 's-5',
      slideNumber: 5,
      headline: 'Scale Your Brand with Synergy',
      bodyText:
        'One workspace. Multiple businesses. An entire autonomous AI marketing workforce operating 24/7 on your terms.',
      callToAction: 'Get Started Today • Link in Bio',
      backgroundColor: '#111827',
      textColor: '#ffffff',
    },
  ]);

  const togglePlatform = (p: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTopbarLoading(true);
    setTimeout(() => {
      setIsGenerating(false);
      setTopbarLoading(false);
    }, 1200);
  };

  const currentSlide = slides[activeSlideIndex] || slides[0];

  const updateCurrentSlide = (field: keyof CarouselSlide, val: any) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === activeSlideIndex ? { ...s, [field]: val } : s))
    );
  };

  const addSlide = () => {
    if (slides.length >= 10) return;
    const newSlide: CarouselSlide = {
      id: `s-${Date.now()}`,
      slideNumber: slides.length + 1,
      headline: 'New Insight Title',
      bodyText: 'Enter clear, high-value educational copy for your audience here.',
      backgroundColor: '#111827',
      textColor: '#ffffff',
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const removeSlide = (idx: number) => {
    if (slides.length <= 2) return;
    const filtered = slides.filter((_, i) => i !== idx).map((s, i) => ({ ...s, slideNumber: i + 1 }));
    setSlides(filtered);
    setActiveSlideIndex(Math.max(0, idx - 1));
  };

  return (
    <div className="animate-page-enter space-y-5">
      {/* Signature Hero Card */}
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Creative Production`}
        title="AI Content Studio & Multi-Slide Carousel Builder"
        description="Orchestrate the Content Writer and Visual Designer to draft branded multi-slide carousels, thought-leadership posts, and concise threads."
        primaryAction={
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-hero-primary"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'AI Workforce Generating...' : 'Regenerate Carousel'}</span>
          </button>
        }
      />

      {/* Main Studio Grid: Left Configuration & Input, Right Carousel Live Canvas */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column (5 Cols): Prompt, Platform Selectors, Slide Inspector */}
        <div className="col-span-5 space-y-4">
          {/* Objective Card */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-blue-600" />
                Content Objective & Prompt
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Brand Kit Active
              </span>
            </div>

            <textarea
              rows={3}
              value={promptObjective}
              onChange={(e) => setPromptObjective(e.target.value)}
              className="w-full p-3.5 bg-white border border-slate-300 rounded-lg text-[13px] text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none font-medium leading-relaxed shadow-sm"
              placeholder="Describe what content concept you want to create..."
            />

            {/* Target Platforms */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Target Platform Adapters
              </span>
              <div className="flex items-center gap-2">
                {(['instagram', 'linkedin', 'x'] as SocialPlatform[]).map((p) => {
                  const isSelected = selectedPlatforms.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'bg-white text-slate-600 border-border hover:bg-slate-100'
                      }`}
                    >
                      {p === 'x' ? 'X (Twitter)' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Slide Form Editor */}
          <div className="card p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Edit Slide {activeSlideIndex + 1} of {slides.length}
              </span>
              <button
                type="button"
                onClick={() => removeSlide(activeSlideIndex)}
                disabled={slides.length <= 2}
                className="text-[11px] font-semibold text-red-500 hover:text-red-700 disabled:opacity-30 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Slide</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Slide Headline
              </label>
              <input
                type="text"
                value={currentSlide.headline}
                onChange={(e) => updateCurrentSlide('headline', e.target.value)}
                className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-sm text-neutral-900 font-bold focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Slide Body Narrative
              </label>
              <textarea
                rows={3}
                value={currentSlide.bodyText}
                onChange={(e) => updateCurrentSlide('bodyText', e.target.value)}
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-[13px] text-neutral-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none leading-relaxed shadow-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Call to Action (Optional)
              </label>
              <input
                type="text"
                value={currentSlide.callToAction || ''}
                onChange={(e) => updateCurrentSlide('callToAction', e.target.value)}
                placeholder="e.g. Swipe to learn more →"
                className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-xs text-neutral-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
              />
            </div>

            {/* QA Agent Badge */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-sm flex items-center gap-2.5 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">QA Agent Verified:</span> Brand Kit voice 98.4% match, zero grammar or platform dimension flags.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Interactive Carousel Canvas & Slide Sequence */}
        <div className="col-span-7 space-y-4">
          <div className="card p-6 flex flex-col items-center justify-between min-h-[520px]">
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-neutral-900">
                  Carousel Visual Preview
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  (1080 x 1350 • 4:5 Instagram Ratio)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeSlideIndex === 0}
                  className="p-1 rounded-sm border border-border bg-slate-50 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-slate-600">
                  {activeSlideIndex + 1} / {slides.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))
                  }
                  disabled={activeSlideIndex === slides.length - 1}
                  className="p-1 rounded-sm border border-border bg-slate-50 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* The Branded Slide Canvas */}
            <div
              className="w-[360px] h-[450px] rounded-lg shadow-2xl p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border border-slate-700/30"
              style={{
                backgroundColor: currentSlide.backgroundColor || '#111827',
                color: currentSlide.textColor || '#ffffff',
              }}
            >
              {/* Radial gradient ambient lighting */}
              <div className="absolute -top-20 -right-20 w-52 h-52 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Slide Header: Business Name & Indicator */}
              <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white text-neutral-900 font-bold text-[10px] flex items-center justify-center">
                    {(business?.name || 'S').charAt(0)}
                  </div>
                  <span className="text-xs font-bold tracking-wide uppercase">
                    {business?.name || 'Synergy'}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold opacity-70">
                  {activeSlideIndex + 1} / {slides.length}
                </span>
              </div>

              {/* Slide Core Content */}
              <div className="my-auto relative z-10 space-y-4">
                <h2 className="font-heading font-extrabold text-2xl text-white tracking-tight leading-tight">
                  {currentSlide.headline}
                </h2>
                <p className="text-[13.5px] text-slate-300 leading-relaxed font-normal">
                  {currentSlide.bodyText}
                </p>
              </div>

              {/* Slide Footer / CTA */}
              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">
                  {currentSlide.callToAction || 'Swipe →'}
                </span>
                <span className="text-[10px] uppercase font-mono text-slate-400">
                  CrossTech • Synergy
                </span>
              </div>
            </div>

            {/* Slide Navigation Thumbnails Row */}
            <div className="w-full flex items-center justify-center gap-2.5 pt-6">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`w-9 h-11 rounded-sm text-[11px] font-bold flex flex-col items-center justify-center border transition-all ${
                    idx === activeSlideIndex
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm scale-105'
                      : 'border-border bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{idx + 1}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={addSlide}
                className="w-9 h-11 rounded-sm border border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors"
                title="Add New Slide"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="w-full flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
              <button type="button" className="btn btn-secondary">
                Save as Draft
              </button>
              <Link href="/calendar" className="btn btn-primary">
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule to Platforms</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

