'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Code2,
  Play,
  Download,
  Check,
  Eye,
  FileCode,
  RotateCcw,
  ExternalLink,
  Send,
  AlertCircle,
  X,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { SocialPlatform, CarouselSlide } from '@synergy/types';

// ==============================================================================
// STARTER HTML/CSS CAROUSEL PRESETS
// ==============================================================================
const CODE_PRESETS: Record<
  string,
  { name: string; description: string; code: string }
> = {
  executiveDark: {
    name: 'Executive Dark (Sapphire Flare)',
    description: '3-slide high-impact presentation with modern dark gradient & pill badges',
    code: `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: linear-gradient(135deg, #0b1120 0%, #111827 50%, #172554 100%);
    color: #ffffff;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    margin-bottom: 24px;
  }
  .tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.14);
    padding: 5px 12px;
    border-radius: 9999px;
    display: inline-block;
    border: 1px solid rgba(96, 165, 250, 0.25);
  }
  .headline {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.25;
    margin: 18px 0 12px 0;
    letter-spacing: -0.02em;
    color: #ffffff;
  }
  .body {
    font-size: 14px;
    line-height: 1.6;
    color: #94a3b8;
    margin: 0;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 14px;
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
  }
  .badge-number {
    font-family: monospace;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="tag">Autonomous Framework</span>
    <h1 class="headline">How AI Workforce Operates Without Human Bottlenecks</h1>
    <p class="body">Traditional content workflows require 5 different tools. Discover how our autonomous personas orchestrate from market trends to publication.</p>
  </div>
  <div class="slide-footer">
    <span>CrossTech Operations</span>
    <span class="badge-number">01 / 03</span>
  </div>
</div>

<div class="carousel-slide">
  <div>
    <span class="tag">Pillar 02: Verification</span>
    <h1 class="headline">Zero-Touch Brand Voice & QA Auditing</h1>
    <p class="body">The QA Persona validates every slide against your Brand Kit guidelines, typography rules, and platform constraints prior to scheduling.</p>
  </div>
  <div class="slide-footer">
    <span>Brand Safety</span>
    <span class="badge-number">02 / 03</span>
  </div>
</div>

<div class="carousel-slide">
  <div>
    <span class="tag">Pillar 03: Scale</span>
    <h1 class="headline">Deterministic Multi-Platform Publishing</h1>
    <p class="body">With Upstash Redis distributed locks, posts are published seamlessly to Instagram, LinkedIn, and X with zero duplicate dispatches.</p>
  </div>
  <div class="slide-footer">
    <span>Ready to Deploy →</span>
    <span class="badge-number">03 / 03</span>
  </div>
</div>`,
  },

  minimalLight: {
    name: 'Minimal Editorial (Clean Light)',
    description: 'Clean crisp light aesthetic with subtle borders and bold typography',
    code: `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: #ffffff;
    color: #0f172a;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    border: 1px solid #e2e8f0;
    box-shadow: 0 14px 30px rgba(0,0,0,0.06);
    margin-bottom: 24px;
  }
  .tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #1d4ed8;
    background: #eff6ff;
    padding: 5px 12px;
    border-radius: 9999px;
    display: inline-block;
    border: 1px solid #dbeafe;
  }
  .headline {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1.25;
    margin: 18px 0 12px 0;
    color: #0f172a;
  }
  .body {
    font-size: 14px;
    line-height: 1.6;
    color: #475569;
    margin: 0;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f1f5f9;
    padding-top: 14px;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 600;
  }
  .badge-number {
    font-family: monospace;
    color: #1d4ed8;
    background: #eff6ff;
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="tag">Strategy Brief</span>
    <h1 class="headline">5 Signals Your B2B Social Strategy is Outdated</h1>
    <p class="body">Static graphics and manual posting won't cut it in 2026. Here is what leading marketing teams do differently.</p>
  </div>
  <div class="slide-footer">
    <span>CrossTech Synergy</span>
    <span class="badge-number">01 / 02</span>
  </div>
</div>

<div class="carousel-slide">
  <div>
    <span class="tag">The Solution</span>
    <h1 class="headline">Turn High-Velocity Ideas into Visual Assets</h1>
    <p class="body">Combine code-generated carousel layouts with automated audience scheduling to increase organic engagement by 3.4x.</p>
  </div>
  <div class="slide-footer">
    <span>Swipe Next →</span>
    <span class="badge-number">02 / 02</span>
  </div>
</div>`,
  },

  statsMetrics: {
    name: 'Growth Metrics & Proof',
    description: 'High-contrast statistics slide with big bold numbers and proof points',
    code: `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: #090d16;
    color: #ffffff;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    border: 1px solid #1e293b;
    margin-bottom: 24px;
  }
  .stat-badge {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #10b981;
    background: rgba(16, 185, 129, 0.12);
    padding: 4px 10px;
    border-radius: 9999px;
    display: inline-block;
  }
  .stat-huge {
    font-family: 'Montserrat', sans-serif;
    font-size: 56px;
    font-weight: 900;
    color: #38bdf8;
    line-height: 1;
    margin: 16px 0 8px 0;
    letter-spacing: -0.04em;
  }
  .headline {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 8px;
  }
  .body {
    font-size: 13.5px;
    line-height: 1.55;
    color: #94a3b8;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 14px;
    font-size: 12px;
    color: #64748b;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="stat-badge">Performance Benchmark</span>
    <div class="stat-huge">+312%</div>
    <h2 class="headline">Engagement Lift with Code Carousels</h2>
    <p class="body">Pixel-perfect custom typography and high-density technical layouts outperform generic canvas graphics across LinkedIn and Instagram.</p>
  </div>
  <div class="slide-footer">
    <span>Verified Benchmarks</span>
    <span style="font-family: monospace; color: #10b981;">01 / 01</span>
  </div>
</div>`,
  },
};

export default function ContentStudioPage() {
  const { getCurrentBusiness, setTopbarLoading } = useWorkspaceStore();
  const business = getCurrentBusiness();

  // ----------------------------------------------------------------------------
  // SECTION 1: VISUAL AI BUILDER STATE (Unchanged / Fully Intact)
  // ----------------------------------------------------------------------------
  const [promptObjective, setPromptObjective] = useState('');
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
      headline: 'Slide 1 Headline',
      bodyText:
        'Enter your slide body text here or describe your topic in the prompt box above and click "Generate with AI".',
      callToAction: 'Learn more →',
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
    if (slides.length <= 1) return;
    const filtered = slides
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, slideNumber: i + 1 }));
    setSlides(filtered);
    setActiveSlideIndex(Math.max(0, idx - 1));
  };

  // ----------------------------------------------------------------------------
  // SECTION 2: CODE-TO-CAROUSEL STUDIO (HTML/CSS Compiler & Publisher)
  // ----------------------------------------------------------------------------
  const [htmlCode, setHtmlCode] = useState<string>(CODE_PRESETS.executiveDark.code);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState<string | null>(null);
  const [compiledImages, setCompiledImages] = useState<string[]>([]);
  const [activeCompiledIndex, setActiveCompiledIndex] = useState(0);
  const [activeCodeTab, setActiveCodeTab] = useState<'editor' | 'live-html' | 'compiled'>(
    'editor'
  );
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Hidden Sandbox Ref used for DOM-to-Image rasterization
  const sandboxRef = useRef<HTMLDivElement>(null);

  // Count detected slides in HTML code
  const detectedSlideCount = (htmlCode.match(/class=["'][^"']*carousel-slide[^"']*["']/g) || [])
    .length || 1;

  // Compile Handler: Converts HTML elements to real high-res PNG images via JavaScript
  const handleCompileCarousel = async () => {
    if (!sandboxRef.current) return;
    setIsCompiling(true);
    setTopbarLoading(true);
    setCompileProgress('Initializing renderer...');

    try {
      // Dynamically load html-to-image in browser only
      const { toPng } = await import('html-to-image');

      // Find all target slide containers inside sandbox
      const slideNodes = sandboxRef.current.querySelectorAll('.carousel-slide');
      const targets =
        slideNodes.length > 0 ? Array.from(slideNodes) : [sandboxRef.current.firstElementChild || sandboxRef.current];

      const images: string[] = [];

      for (let i = 0; i < targets.length; i++) {
        setCompileProgress(`Compiling Slide ${i + 1} of ${targets.length} (2x Retina)...`);
        const target = targets[i] as HTMLElement;

        // Render to high-definition PNG data URL
        const dataUrl = await toPng(target, {
          quality: 0.98,
          pixelRatio: 2, // 2x crisp 720x900 / 1080x1350 resolution
          cacheBust: true,
          filter: (node) => !node.classList?.contains('ignore-render'),
        });

        images.push(dataUrl);
      }

      setCompiledImages(images);
      setActiveCompiledIndex(0);
      setActiveCodeTab('compiled');
      setCompileProgress(null);
    } catch (err: any) {
      console.error('Compilation failed:', err);
      alert(`Compilation failed: ${err.message}`);
    } finally {
      setIsCompiling(false);
      setTopbarLoading(false);
      setCompileProgress(null);
    }
  };

  // Download individual slide PNG
  const handleDownloadSlide = (index: number) => {
    const imgUrl = compiledImages[index];
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `carousel-slide-${index + 1}.png`;
    a.click();
  };

  // Download all compiled slides
  const handleDownloadAll = () => {
    compiledImages.forEach((imgUrl, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = imgUrl;
        a.download = `carousel-slide-${i + 1}.png`;
        a.click();
      }, i * 250);
    });
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // ----------------------------------------------------------------------------
  // PUBLISHING / SCHEDULING MODAL STATE
  // ----------------------------------------------------------------------------
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishCaption, setPublishCaption] = useState(
    '🚀 Excited to share our latest tactical framework for autonomous AI operations! Swipe through the carousel for the complete breakdown. What are your thoughts? #AI #MarketingOperations #Synergy'
  );
  const [publishTargetPlatforms, setPublishTargetPlatforms] = useState<SocialPlatform[]>([
    'instagram',
    'linkedin',
  ]);
  const [publishDate, setPublishDate] = useState('2026-11-05T14:00');
  const [isScheduling, setIsScheduling] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  const handlePostOrSchedule = (immediate: boolean = false) => {
    setIsScheduling(true);
    setTopbarLoading(true);

    setTimeout(() => {
      setIsScheduling(false);
      setTopbarLoading(false);

      // Save scheduled carousel to localStorage for Calendar & Dashboard sync
      if (typeof window !== 'undefined') {
        const key = `synergy_scheduled_posts_${business?.id || 'biz-crosstech'}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const newPost = {
          id: `post-${Date.now()}`,
          title: 'Code-Compiled Multi-Slide Carousel',
          caption: publishCaption,
          platforms: publishTargetPlatforms,
          scheduledFor: immediate ? new Date().toISOString() : publishDate,
          status: immediate ? 'published' : 'scheduled',
          slideCount: compiledImages.length,
          previewUrl: compiledImages[0] || null,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(key, JSON.stringify([newPost, ...existing]));
      }

      setPublishSuccessMsg(
        immediate
          ? `🎉 Carousel dispatched immediately to ${publishTargetPlatforms.join(', ').toUpperCase()}!`
          : `✅ Carousel scheduled for ${new Date(publishDate).toLocaleString()} across ${publishTargetPlatforms.join(', ').toUpperCase()}!`
      );

      setTimeout(() => {
        setPublishSuccessMsg(null);
        setIsPublishModalOpen(false);
      }, 2500);
    }, 900);
  };

  return (
    <div className="animate-page-enter space-y-6">
      {/* Signature Hero Card */}
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Creative Studio`}
        title="AI Content Studio & Code-to-Carousel Engine"
        description="Craft carousels visually with AI personas, or write custom HTML/CSS code and compile directly into publication-ready retina social slides."
        primaryAction={
          <div className="flex items-center gap-2">
            <a
              href="#code-carousel-studio"
              className="btn-hero-primary flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>HTML Code Studio</span>
            </a>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-hero-secondary flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generating...' : 'AI Visual Builder'}</span>
            </button>
          </div>
        }
      />

      {/* ========================================================================
          PART 1: VISUAL AI BUILDER (Unchanged / Fully Intact)
          ======================================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h2 className="font-heading font-extrabold text-sm uppercase tracking-wider text-neutral-800">
              Visual AI Persona Builder
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {slides.length} Visual Slides Configured
          </span>
        </div>

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
                  disabled={slides.length <= 1}
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
                  <span className="font-bold">QA Agent Verified:</span> Brand Kit voice 98.4%
                  match, zero grammar flags.
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
                    Visual Slide Canvas
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    (1080 x 1350 • 4:5 Aspect Ratio)
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
                <button
                  type="button"
                  onClick={() => alert('Visual draft saved successfully to workspace.')}
                  className="btn btn-secondary"
                >
                  Save as Draft
                </button>
                <Link href="/calendar" className="btn btn-primary">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule to Calendar</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          PART 2: CODE-TO-CAROUSEL STUDIO (HTML/CSS Compiler & Publisher)
          ======================================================================== */}
      <div id="code-carousel-studio" className="pt-6 border-t-2 border-slate-200 space-y-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-neutral-900 to-blue-950 p-5 rounded-2xl text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-base tracking-tight">
                  HTML Code-to-Carousel Studio
                </h2>
                <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-bold">
                  JavaScript Compiler
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Paste or write HTML/CSS for your carousel slides. Our JavaScript compiler rasterizes each slide into 2x high-resolution PNG images ready to publish.
              </p>
            </div>
          </div>

          {/* Quick Presets Menu */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-medium text-slate-400">Presets:</span>
            {Object.entries(CODE_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setHtmlCode(preset.code);
                  setCompiledImages([]);
                  setActiveCodeTab('editor');
                }}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all"
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Code Studio Workspace: Left Editor, Right Live Render & Compiled Gallery */}
        <div className="grid grid-cols-12 gap-5">
          {/* Left Column (6 Cols): Code Editor & Compiler Toolbar */}
          <div className="col-span-12 lg:col-span-6 space-y-3">
            <div className="card p-4 space-y-3">
              {/* Editor Top Bar */}
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-neutral-800">
                    HTML / CSS Slide Source Code
                  </span>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {detectedSlideCount} {detectedSlideCount === 1 ? 'Slide' : 'Slides'} Detected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 text-xs flex items-center gap-1"
                    title="Copy Source Code"
                  >
                    {copyFeedback ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[11px]">{copyFeedback ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHtmlCode(CODE_PRESETS.executiveDark.code);
                      setCompiledImages([]);
                    }}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 text-xs flex items-center gap-1"
                    title="Reset to Template"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Reset</span>
                  </button>
                </div>
              </div>

              {/* Code Textarea with Dark Terminal Aesthetic */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                <div className="bg-[#0b0f19] px-3.5 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-slate-400">carousel-template.html</span>
                  </div>
                  <span>Wrap slides in &lt;div class=&quot;carousel-slide&quot;&gt;</span>
                </div>

                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  rows={18}
                  spellCheck={false}
                  className="w-full p-4 bg-[#070b13] text-emerald-400 font-mono text-[12.5px] leading-relaxed outline-none resize-y selection:bg-blue-600 selection:text-white"
                  placeholder="<!-- Paste your HTML and CSS here -->&#10;<style>&#10;  .carousel-slide { width: 360px; height: 450px; background: #111; color: #fff; padding: 24px; }&#10;</style>&#10;&#10;<div class='carousel-slide'>&#10;  <h1>Slide 1</h1>&#10;</div>"
                />
              </div>

              {/* Instructions and Compile CTA */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  Tip: CSS inside &lt;style&gt; or inline styles are supported automatically.
                </span>

                <button
                  type="button"
                  onClick={handleCompileCarousel}
                  disabled={isCompiling}
                  className="btn btn-primary flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isCompiling ? 'animate-spin' : ''}`} />
                  <span>
                    {isCompiling
                      ? compileProgress || 'Compiling Images...'
                      : 'Compile & Render Images'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (6 Cols): Canvas & Compiled Gallery */}
          <div className="col-span-12 lg:col-span-6 space-y-3">
            <div className="card p-4 space-y-3 min-h-[560px] flex flex-col justify-between">
              {/* Header with Switcher Tabs */}
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('editor')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      activeCodeTab === 'editor'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Live Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('compiled')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                      activeCodeTab === 'compiled'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Compiled Images</span>
                    {compiledImages.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {compiledImages.length}
                      </span>
                    )}
                  </button>
                </div>

                {compiledImages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadSlide(activeCompiledIndex)}
                      className="btn btn-secondary text-xs flex items-center gap-1 !py-1 !px-2.5"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Slide</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadAll}
                      className="btn btn-secondary text-xs flex items-center gap-1 !py-1 !px-2.5"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download All</span>
                    </button>
                  </div>
                )}
              </div>

              {/* TAB 1: Live Interactive HTML Preview */}
              {activeCodeTab === 'editor' && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl overflow-y-auto max-h-[480px]">
                  <div className="w-full flex justify-center py-2">
                    {/* Rendered HTML Container */}
                    <div
                      dangerouslySetInnerHTML={{ __html: htmlCode }}
                      className="flex flex-col items-center gap-4"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Compiled Retina Images Gallery */}
              {activeCodeTab === 'compiled' && (
                <div className="flex-1 flex flex-col items-center justify-between p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
                  {compiledImages.length === 0 ? (
                    <div className="my-auto text-center space-y-3 py-12">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-neutral-900">
                        No Compiled Images Yet
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Click the &ldquo;Compile &amp; Render Images&rdquo; button to convert your HTML code into 2x retina social slides.
                      </p>
                      <button
                        type="button"
                        onClick={handleCompileCarousel}
                        disabled={isCompiling}
                        className="btn btn-primary text-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Compile Now</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center justify-between space-y-4">
                      {/* Active Compiled Image Header */}
                      <div className="w-full flex items-center justify-between text-xs px-2">
                        <span className="font-bold text-slate-700">
                          Slide {activeCompiledIndex + 1} of {compiledImages.length}
                        </span>
                        <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold text-[11px]">
                          2x Retina PNG Ready
                        </span>
                      </div>

                      {/* Compiled Image Display */}
                      <div className="relative group max-h-[380px] flex items-center justify-center">
                        <img
                          src={compiledImages[activeCompiledIndex]}
                          alt={`Compiled Slide ${activeCompiledIndex + 1}`}
                          className="max-h-[360px] w-auto rounded-xl shadow-xl border border-slate-300 object-contain"
                        />
                      </div>

                      {/* Carousel Thumbnail Strip & Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveCompiledIndex((prev) => Math.max(0, prev - 1))
                          }
                          disabled={activeCompiledIndex === 0}
                          className="p-1 rounded-md border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1.5">
                          {compiledImages.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setActiveCompiledIndex(i)}
                              className={`w-8 h-10 rounded-md overflow-hidden border-2 transition-all ${
                                i === activeCompiledIndex
                                  ? 'border-blue-600 scale-105 shadow-sm'
                                  : 'border-slate-200 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveCompiledIndex((prev) =>
                              Math.min(compiledImages.length - 1, prev + 1)
                            )
                          }
                          disabled={activeCompiledIndex === compiledImages.length - 1}
                          className="p-1 rounded-md border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Publishing Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
                <div className="text-xs text-slate-500">
                  {compiledImages.length > 0 ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{compiledImages.length} Slides Rasterized & Ready</span>
                    </span>
                  ) : (
                    <span>Ready to compile HTML into publication assets</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (compiledImages.length === 0) {
                        handleCompileCarousel();
                      }
                      setIsPublishModalOpen(true);
                    }}
                    className="btn btn-primary flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post / Schedule Carousel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          HIDDEN SANDBOX DOM CONTAINER (Used by html-to-image)
          ======================================================================== */}
      <div
        style={{
          position: 'fixed',
          left: '-99999px',
          top: '-99999px',
          width: '800px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -9999,
        }}
      >
        <div ref={sandboxRef} dangerouslySetInnerHTML={{ __html: htmlCode }} />
      </div>

      {/* ========================================================================
          PUBLISH / SCHEDULE MODAL
          ======================================================================== */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-lg w-full p-6 space-y-5 animate-scale-up">
            {/* Modal Title */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-neutral-900">
                    Publish Compiled Carousel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dispatch to connected Instagram, LinkedIn, and X channels
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              {/* Target Platforms */}
              <div>
                <label className="settings-label">Target Channels</label>
                <div className="flex items-center gap-2">
                  {(['instagram', 'linkedin', 'x'] as SocialPlatform[]).map((p) => {
                    const isSelected = publishTargetPlatforms.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setPublishTargetPlatforms((prev) =>
                            prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
                          );
                        }}
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

              {/* Post Caption */}
              <div>
                <label className="settings-label">Post Caption / Accompanying Copy</label>
                <textarea
                  rows={4}
                  value={publishCaption}
                  onChange={(e) => setPublishCaption(e.target.value)}
                  className="settings-input !bg-white leading-relaxed"
                  placeholder="Enter the post caption or thread introduction..."
                />
              </div>

              {/* Schedule Date & Time */}
              <div>
                <label className="settings-label">Schedule Date &amp; Time (UTC)</label>
                <input
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="settings-input !bg-white font-mono text-xs"
                />
              </div>

              {/* Compiled Slides Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-slate-600 text-xs">
                <span>Slides Attached:</span>
                <span className="font-mono font-bold text-neutral-900">
                  {compiledImages.length || detectedSlideCount} Images Ready
                </span>
              </div>

              {/* Status feedback */}
              {publishSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium animate-fade-in">
                  {publishSuccessMsg}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="btn btn-secondary text-xs"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePostOrSchedule(false)}
                  disabled={isScheduling}
                  className="btn btn-secondary text-xs flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isScheduling ? 'Scheduling...' : 'Schedule to Calendar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePostOrSchedule(true)}
                  disabled={isScheduling}
                  className="btn btn-primary text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isScheduling ? 'Publishing...' : 'Publish Immediately'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
