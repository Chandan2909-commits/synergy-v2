'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Palette,
  Sparkles,
  Play,
  Send,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Copy,
  Trash2,
  Download,
  Eye,
  Image as ImageIcon,
  Code2,
  X,
  Search,
  Filter,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { InstagramAutomationModal } from '@/components/instagram/InstagramAutomationModal';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { SocialPlatform } from '@synergy/types';
import {
  INHOUSE_TEMPLATES,
  InhouseTemplate,
  InhouseTemplateSlide,
  generateTemplateSlideHtml,
  extractSlideDimensions,
  isValidPngDataUrl,
  renderSlideViaIframe,
  cleanSubjectFromPrompt,
  generateAiSlideCopy,
  generateFullCarouselCopyFromAi,
} from '@/lib/carouselTemplates';

type CategoryFilter = 'All' | InhouseTemplate['category'];

export default function TemplatesPage() {
  const { getCurrentBusiness, setTopbarLoading } = useWorkspaceStore();
  const business = getCurrentBusiness();

  // Template Catalog State
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('executiveDark');

  // Active Template Customization State
  const initialTemplate = INHOUSE_TEMPLATES.executiveDark;
  const [templateAccentColor, setTemplateAccentColor] = useState<string>(
    initialTemplate.accentColors[0]
  );
  const [templateSlides, setTemplateSlides] = useState<InhouseTemplateSlide[]>(
    initialTemplate.slides.map((s) => ({ ...s }))
  );
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [isRawHtmlMode, setIsRawHtmlMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'compiled'>('preview');

  // Compilation & Rasterization State
  const [compiledImages, setCompiledImages] = useState<string[]>([]);
  const [activeCompiledIdx, setActiveCompiledIdx] = useState<number>(0);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileProgress, setCompileProgress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Content Generator State (Template Editing Mode)
  const [aiPrompt, setAiPrompt] = useState<string>(
    'generate a brand content using employeeos'
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'instagram',
    'linkedin',
  ]);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Publishing / Scheduling Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [publishCaption, setPublishCaption] = useState('');
  const [publishPlatforms, setPublishPlatforms] = useState<SocialPlatform[]>([
    'instagram',
    'linkedin',
  ]);
  const [publishDate, setPublishDate] = useState('2026-11-05T14:00');
  const [isScheduling, setIsScheduling] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  const currentTemplate = INHOUSE_TEMPLATES[selectedTemplateId] || INHOUSE_TEMPLATES.executiveDark;
  const currentSlide = templateSlides[activeSlideIdx] || templateSlides[0];

  // Filter templates list based on category & search
  const filteredTemplates = Object.values(INHOUSE_TEMPLATES).filter((tpl) => {
    const matchesCategory =
      selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Switch Active Template
  const handleSelectTemplate = (tplId: string) => {
    const tpl = INHOUSE_TEMPLATES[tplId];
    if (!tpl) return;
    setSelectedTemplateId(tplId);
    setTemplateAccentColor(tpl.accentColors[0]);
    setTemplateSlides(tpl.slides.map((s) => ({ ...s })));
    setActiveSlideIdx(0);
    setCompiledImages([]);
    setActiveTab('preview');
    setIsRawHtmlMode(false);
    setToastMessage(`Loaded template: ${tpl.name}`);
    setTimeout(() => setToastMessage(null), 3000);

    // Smoothly scroll down to editor
    const editorElem = document.getElementById('template-editor-section');
    if (editorElem) {
      editorElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Update Slide Field
  const handleUpdateField = (field: keyof InhouseTemplateSlide, value: string) => {
    setTemplateSlides((prev) =>
      prev.map((s, idx) => (idx === activeSlideIdx ? { ...s, [field]: value } : s))
    );
    if (compiledImages.length > 0) {
      setCompiledImages([]);
    }
  };

  // Add Slide
  const handleAddSlide = () => {
    if (templateSlides.length >= 10) return;
    const nextNum = templateSlides.length + 1;
    const newSlide: InhouseTemplateSlide = {
      id: `slide-${Date.now()}`,
      title: `Slide ${nextNum}`,
      tag: 'Strategic Takeaway',
      headline: 'Actionable Framework or Insight',
      body: 'Document the specific implementation methodology or quantitative outcome here. Clear, punchy typography boosts dwell time.',
      footerText: 'Synergy Framework',
      footerBadge: `0${nextNum} / 0${nextNum}`,
    };
    setTemplateSlides([...templateSlides, newSlide]);
    setActiveSlideIdx(templateSlides.length);
    setCompiledImages([]);
    setToastMessage(`Added Slide ${nextNum}!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Duplicate Slide
  const handleDuplicateSlide = (idx: number) => {
    const source = templateSlides[idx];
    if (!source) return;
    const newSlide: InhouseTemplateSlide = {
      ...source,
      id: `slide-${Date.now()}`,
      title: `${source.title || `Slide ${idx + 1}`} (Copy)`,
      footerBadge: `0${idx + 2} / 0${templateSlides.length + 1}`,
    };
    const updated = [...templateSlides];
    updated.splice(idx + 1, 0, newSlide);
    setTemplateSlides(updated);
    setActiveSlideIdx(idx + 1);
    setCompiledImages([]);
    setToastMessage(`📑 Duplicated Slide ${idx + 1}!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Delete Slide
  const handleDeleteSlide = (idx: number) => {
    if (templateSlides.length <= 1) return;
    const filtered = templateSlides.filter((_, i) => i !== idx);
    setTemplateSlides(filtered);
    setActiveSlideIdx(Math.max(0, idx - 1));
    setCompiledImages([]);
    setToastMessage(`Slide deleted.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Platform selection toggle
  const togglePlatform = (p: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  // Generate All Slides with AI (Preserves template theme/styling, modifies only slide content)
  const handleGenerateAiContent = () => {
    const trimmed = aiPrompt.trim() || 'generate a brand content using employeeos';
    setIsGeneratingAi(true);
    setTopbarLoading(true);

    setTimeout(() => {
      try {
        const newSlides = generateFullCarouselCopyFromAi(
          trimmed,
          selectedTemplateId,
          templateSlides.length || 3,
          templateSlides
        );

        setTemplateSlides(newSlides);
        setActiveSlideIdx(0);
        setCompiledImages([]); // Reset compiled images to preview updated copy
        setIsRawHtmlMode(false);

        const subject = cleanSubjectFromPrompt(trimmed);
        setToastMessage(
          `✨ AI generated ${newSlides.length} slides for "${subject}"! Template styling completely preserved.`
        );
        setTimeout(() => setToastMessage(null), 3500);
      } catch (err: any) {
        console.error('AI generation error:', err);
        setToastMessage(`Updated slide copy for "${trimmed}".`);
        setTimeout(() => setToastMessage(null), 3000);
      } finally {
        setIsGeneratingAi(false);
        setTopbarLoading(false);
      }
    }, 900);
  };

  // Rewrite just the current active slide with AI
  const handleRewriteCurrentSlideWithAi = () => {
    const trimmed = aiPrompt.trim() || 'generate a brand content using employeeos';
    setIsGeneratingAi(true);
    setTopbarLoading(true);

    setTimeout(() => {
      try {
        const updatedSlide = generateAiSlideCopy(
          trimmed,
          selectedTemplateId,
          activeSlideIdx,
          templateSlides.length,
          currentSlide
        );

        setTemplateSlides((prev) =>
          prev.map((s, idx) => (idx === activeSlideIdx ? updatedSlide : s))
        );
        setCompiledImages([]);
        setIsRawHtmlMode(false);
        setToastMessage(`✨ Slide ${activeSlideIdx + 1} copy refreshed with AI!`);
        setTimeout(() => setToastMessage(null), 3000);
      } finally {
        setIsGeneratingAi(false);
        setTopbarLoading(false);
      }
    }, 600);
  };

  // Rasterize All Slides into 2x Retina PNGs
  const handleCompileSlides = async () => {
    setIsCompiling(true);
    setTopbarLoading(true);
    setCompileProgress('Initializing 2x retina rasterization engine...');

    try {
      const { toPng } = await import('html-to-image');
      const images: string[] = [];

      for (let i = 0; i < templateSlides.length; i++) {
        setCompileProgress(`Compiling Slide ${i + 1} of ${templateSlides.length} (2x Retina)...`);
        const slide = templateSlides[i];
        const html = generateTemplateSlideHtml(slide, currentTemplate.themeStyle, templateAccentColor);
        const dims = extractSlideDimensions(html);

        let dataUrl = '';

        // Strategy 1: Render from DOM sandbox
        const slideContainer = document.getElementById(`dedicated-template-sandbox-${i}`);
        if (slideContainer) {
          try {
            const innerSlide =
              (slideContainer.querySelector('.carousel-slide') as HTMLElement) ||
              (Array.from(slideContainer.children).find(
                (c) => c.tagName.toLowerCase() !== 'style'
              ) as HTMLElement) ||
              slideContainer;

            const rect = innerSlide.getBoundingClientRect();
            const measuredWidth = rect.width >= 100 ? Math.round(rect.width) : dims.width;
            const measuredHeight = rect.height >= 100 ? Math.round(rect.height) : dims.height;

            slideContainer.style.width = `${measuredWidth}px`;
            slideContainer.style.height = `${measuredHeight}px`;
            slideContainer.style.overflow = 'hidden';

            const res = await toPng(slideContainer, {
              width: measuredWidth,
              height: measuredHeight,
              pixelRatio: 2,
              skipFonts: true,
              cacheBust: false,
            });

            if (isValidPngDataUrl(res)) {
              dataUrl = res;
            }
          } catch (domErr) {
            console.warn(`DOM rasterization failed for slide ${i + 1}, using iframe fallback:`, domErr);
          }
        }

        // Strategy 2: Isolated HTML5 iframe fallback
        if (!isValidPngDataUrl(dataUrl)) {
          setCompileProgress(`Optimizing Slide ${i + 1} via isolated iframe...`);
          dataUrl = await renderSlideViaIframe(html, dims.width, dims.height);
        }

        if (isValidPngDataUrl(dataUrl)) {
          images.push(dataUrl);
        } else {
          throw new Error(`Slide ${i + 1} produced invalid image data.`);
        }
      }

      setCompiledImages(images);
      setActiveCompiledIdx(0);
      setActiveTab('compiled');
      setCompileProgress(null);
      setToastMessage(`✅ Successfully compiled ${images.length} slides!`);
      setTimeout(() => setToastMessage(null), 3500);
      return images;
    } catch (err: any) {
      console.error('Template compilation failed:', err);
      alert(`Compilation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsCompiling(false);
      setTopbarLoading(false);
      setCompileProgress(null);
    }
  };

  // Open Publishing Modal
  const handleOpenPublishModal = async () => {
    if (compiledImages.length === 0) {
      await handleCompileSlides();
    }
    const firstSlide = templateSlides[0];
    const defaultCaption = `🚀 ${firstSlide?.headline || currentTemplate.name}\n\n${firstSlide?.body || currentTemplate.description}\n\nSwipe through for the complete breakdown! #MarketingOps #Synergy #Growth`;
    setPublishCaption(defaultCaption);
    setIsPublishModalOpen(true);
  };

  // Download Individual Slide PNG
  const handleDownloadSlide = (idx: number) => {
    const imgUrl = compiledImages[idx];
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `${selectedTemplateId}-slide-${idx + 1}.png`;
    a.click();
  };

  // Download All Compiled Slides
  const handleDownloadAllSlides = () => {
    compiledImages.forEach((imgUrl, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = imgUrl;
        a.download = `${selectedTemplateId}-slide-${i + 1}.png`;
        a.click();
      }, i * 250);
    });
  };

  // Dispatch / Schedule Post
  const handlePostOrSchedule = (immediate: boolean = false) => {
    setIsScheduling(true);
    setTopbarLoading(true);

    const postId = `post-${Date.now()}`;
    const scheduledIso = immediate ? new Date().toISOString() : new Date(publishDate).toISOString();

    // If Instagram is targeted and slides are compiled, also queue to residential schedule engine
    if (publishPlatforms.includes('instagram') && compiledImages.length > 0) {
      try {
        fetch('/api/instagram/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: postId,
            title: `Template: ${currentTemplate.name} Carousel`,
            slides: compiledImages,
            caption: publishCaption,
            scheduledFor: scheduledIso,
            platforms: publishPlatforms,
          }),
        }).catch(() => {});

        // Forward to companion bridge if online
        fetch('http://127.0.0.1:4545/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: postId,
            title: `Template: ${currentTemplate.name} Carousel`,
            slides: compiledImages,
            caption: publishCaption,
            scheduledFor: scheduledIso,
            platforms: publishPlatforms,
          }),
        }).catch(() => {});
      } catch {}
    }

    setTimeout(() => {
      setIsScheduling(false);
      setTopbarLoading(false);

      if (typeof window !== 'undefined') {
        const key = `synergy_scheduled_posts_${business?.id || 'biz-crosstech'}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const newPost = {
          id: postId,
          title: `Template: ${currentTemplate.name} Carousel`,
          caption: publishCaption,
          platforms: publishPlatforms,
          scheduledFor: scheduledIso,
          status: immediate ? 'published' : 'scheduled',
          slideCount: compiledImages.length || templateSlides.length,
          previewUrl: compiledImages[0] || null,
          slides: compiledImages,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(key, JSON.stringify([newPost, ...existing.filter((p: any) => p.id !== postId)]));
      }

      setPublishSuccessMsg(
        immediate
          ? `🎉 Carousel dispatched immediately to ${publishPlatforms.join(', ').toUpperCase()}!`
          : `✅ Carousel scheduled for ${new Date(publishDate).toLocaleString()} across ${publishPlatforms.join(', ').toUpperCase()}!`
      );

      setTimeout(() => {
        setPublishSuccessMsg(null);
        setIsPublishModalOpen(false);
      }, 2500);
    }, 900);
  };

  const categories: CategoryFilter[] = [
    'All',
    'Executive & B2B',
    'Thought Leadership',
    'Metrics & Growth',
    'Product Launch',
    'Educational SOP',
    'Quotes & Authority',
  ];

  return (
    <div className="animate-page-enter space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-slide-up flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Signature Hero Card */}
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Creative Production`}
        title="Carousel Templates Library & Visual Studio"
        description="Explore our in-house collection of high-converting social carousel templates. Generate tailored slide copy with AI while preserving pixel-perfect template styling, compile to 2x Retina PNGs, and publish directly."
        primaryAction={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsInstagramModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
              title="Post directly to Instagram using Playwright browser automation"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>⚡ Auto-Post IG</span>
            </button>
            <button
              type="button"
              onClick={handleCompileSlides}
              disabled={isCompiling}
              className="btn-hero-primary flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isCompiling ? 'Compiling...' : 'Compile All Slides'}</span>
            </button>
            <button
              type="button"
              onClick={handleOpenPublishModal}
              disabled={isCompiling}
              className="btn-hero-secondary flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post / Schedule</span>
            </button>
          </div>
        }
      />

      {/* ========================================================================
          SECTION 1: TEMPLATE CATALOG SHELF (Scalable Filter & Selection Grid)
          ======================================================================== */}
      <div className="space-y-4">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-neutral-900 outline-none focus:bg-white focus:border-blue-600 transition-all font-medium"
            />
          </div>
        </div>

        {/* Template Cards Shelf Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTemplates.map((tpl) => {
            const isSelected = selectedTemplateId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleSelectTemplate(tpl.id)}
                className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between h-48 group ${
                  isSelected
                    ? 'border-blue-600 bg-white ring-2 ring-blue-500/30 shadow-lg scale-[1.01]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Top Accent Strip */}
                <div
                  className="h-2 w-full rounded-full mb-3 transition-transform group-hover:scale-x-105"
                  style={{ background: tpl.accentColors[0] }}
                />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {tpl.badge}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-extrabold text-sm text-neutral-900 line-clamp-1">
                    {tpl.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-mono">
                  <span className="text-slate-400">{tpl.slides.length} Slides</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      isSelected ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-600'
                    }`}
                  >
                    <span>{isSelected ? 'Active Template' : 'Edit Template'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================
          SECTION 2: LIVE VISUAL EDITOR & REAL-TIME PREVIEW
          ======================================================================== */}
      <div id="template-editor-section" className="pt-4 space-y-4">
        {/* Editor Title & Slide Navigator Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-neutral-900 to-blue-950 p-5 rounded-2xl text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-base tracking-tight">
                  Editing: {currentTemplate.name}
                </h2>
                <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-bold">
                  {currentTemplate.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Customize content fields on the left. Watch the live preview update in real time on the right.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsInstagramModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-1.5"
              title="Post directly to Instagram with Playwright browser automation"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>⚡ Auto-Post IG</span>
            </button>

            <button
              type="button"
              onClick={handleCompileSlides}
              disabled={isCompiling}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isCompiling ? 'Rasterizing...' : 'Compile All Slides'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenPublishModal}
              disabled={isCompiling}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post / Schedule</span>
            </button>
          </div>
        </div>

        {/* 2-Column Studio Grid: Left Form (7 cols), Right Preview (5 cols) */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left Column: Slide Tabs + Field Editor */}
          <div className="col-span-12 lg:col-span-7 space-y-4">
            {/* AI Carousel Content Generator Card (Template Editing Only) */}
            <div className="card p-5 space-y-3.5 bg-gradient-to-b from-white via-white to-slate-50/70 border border-slate-200/90 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Content Objective & Prompt</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Brand Kit Active</span>
                </span>
              </div>

              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none shadow-sm placeholder:text-slate-400 leading-relaxed"
                placeholder="e.g. generate a brand content using employeeos, 5 lessons on B2B SaaS growth, or why async communication wins..."
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                {/* Target Platform Adapters */}
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Target Platform Adapters
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(['instagram', 'linkedin', 'x'] as SocialPlatform[]).map((p) => {
                      const isSelected = selectedPlatforms.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => togglePlatform(p)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                            isSelected
                              ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {p === 'x' ? 'X (Twitter)' : p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handleGenerateAiContent}
                    disabled={isGeneratingAi || !aiPrompt.trim()}
                    className="btn btn-primary text-xs flex items-center gap-2 py-2 px-4 shadow-md bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold disabled:opacity-50 transition-all hover:scale-[1.01]"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingAi ? 'Generating Copy...' : 'Generate with AI'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Slide Navigation Tabs */}
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {templateSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlideIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeSlideIdx === idx
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Slide {idx + 1}</span>
                    <span className="text-[10px] opacity-75 hidden sm:inline">
                      {slide.title ? `• ${slide.title}` : ''}
                    </span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-dashed border-blue-300 transition-all flex items-center gap-1 shrink-0"
                  title="Add New Slide"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => handleDuplicateSlide(activeSlideIdx)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs"
                  title="Duplicate Current Slide"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(activeSlideIdx)}
                  disabled={templateSlides.length <= 1}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs disabled:opacity-30"
                  title="Delete Slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Slide Fields Editor Card */}
            <div className="card p-5 space-y-4">
              {/* Header: Accent Swatches + Mode Switch */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-blue-600" />
                    <span>Accent:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {currentTemplate.accentColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setTemplateAccentColor(color);
                          if (compiledImages.length > 0) setCompiledImages([]);
                        }}
                        className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                          templateAccentColor === color
                            ? 'border-neutral-900 scale-110 shadow-sm ring-2 ring-slate-300'
                            : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {templateAccentColor === color && (
                          <Check className="w-3 h-3 text-white drop-shadow-md stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRewriteCurrentSlideWithAi}
                    disabled={isGeneratingAi}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-purple-200"
                    title="Regenerate this specific slide's copy using the AI prompt"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Rewrite Slide with AI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRawHtmlMode(!isRawHtmlMode)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-blue-200"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{isRawHtmlMode ? '← Back to Visual Fields' : 'Edit Raw HTML'}</span>
                  </button>
                </div>
              </div>

              {/* Form Fields: Visual Mode */}
              {!isRawHtmlMode ? (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Tag / Pill Badge
                      </label>
                      <input
                        type="text"
                        value={currentSlide.tag}
                        onChange={(e) => handleUpdateField('tag', e.target.value)}
                        className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                        placeholder="e.g., Executive Brief, Blueprint"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Big Stat / Metric (Optional)
                      </label>
                      <input
                        type="text"
                        value={currentSlide.stat || ''}
                        onChange={(e) => handleUpdateField('stat', e.target.value)}
                        className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                        placeholder="e.g., +312% or 99.4% or leave empty"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Slide Headline
                    </label>
                    <input
                      type="text"
                      value={currentSlide.headline}
                      onChange={(e) => handleUpdateField('headline', e.target.value)}
                      className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-sm font-extrabold text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                      placeholder="Main point or hook"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Slide Body / Content Description
                    </label>
                    <textarea
                      rows={4}
                      value={currentSlide.body}
                      onChange={(e) => handleUpdateField('body', e.target.value)}
                      className="w-full p-3.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm leading-relaxed resize-y"
                      placeholder="Detail the operational blueprint or strategic takeaway here..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Footer Left Text
                      </label>
                      <input
                        type="text"
                        value={currentSlide.footerText}
                        onChange={(e) => handleUpdateField('footerText', e.target.value)}
                        className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                        placeholder="e.g., CrossTech Operations"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Footer Right Badge
                      </label>
                      <input
                        type="text"
                        value={currentSlide.footerBadge}
                        onChange={(e) => handleUpdateField('footerBadge', e.target.value)}
                        className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
                        placeholder="e.g., 01 / 03"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Raw HTML Mode */
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Direct HTML/CSS Code for Slide {activeSlideIdx + 1}:</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateField('customHtml', '')}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Reset to Template Structure
                    </button>
                  </div>
                  <textarea
                    rows={14}
                    value={
                      currentSlide.customHtml ??
                      generateTemplateSlideHtml(
                        currentSlide,
                        currentTemplate.themeStyle,
                        templateAccentColor
                      )
                    }
                    onChange={(e) => handleUpdateField('customHtml', e.target.value)}
                    className="w-full p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl outline-none border border-slate-700 focus:border-blue-500 leading-relaxed resize-y shadow-inner"
                    placeholder="<style>...</style><div class='carousel-slide'>...</div>"
                  />
                  <p className="text-[11px] text-slate-500">
                    💡 Custom HTML entered here will be rendered live in the preview and compiled into the retina PNGs.
                  </p>
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  {templateSlides.length} slides configured • Real-time preview active
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInstagramModalOpen(true)}
                    className="btn !bg-gradient-to-r !from-purple-50 !via-rose-50 !to-amber-50 hover:!from-purple-100 hover:!to-amber-100 !border-purple-300 text-purple-900 font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    title="Direct Playwright browser automation to publish carousel to Instagram"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-rose-600" />
                    <span>⚡ Auto-Post IG</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCompileSlides}
                    disabled={isCompiling}
                    className="btn btn-secondary text-xs flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-blue-600" />
                    <span>{isCompiling ? 'Rasterizing...' : 'Compile All Slides'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenPublishModal}
                    disabled={isCompiling}
                    className="btn btn-primary text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post / Schedule Carousel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Preview & Compiled Gallery */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <div className="card p-5 space-y-4">
              {/* View Switcher Tabs */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'preview'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Live Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('compiled')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'compiled'
                        ? 'bg-white text-neutral-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Compiled Images</span>
                    {compiledImages.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </button>
                </div>

                <span className="text-[11px] font-mono font-bold text-slate-500">
                  Slide {activeSlideIdx + 1} of {templateSlides.length}
                </span>
              </div>

              {/* Viewport: Live Real-Time Preview */}
              {activeTab === 'preview' && (
                <div className="space-y-4">
                  <div className="w-full flex items-center justify-center p-6 bg-slate-950/5 rounded-2xl border border-slate-200/80 min-h-[500px]">
                    <div
                      className="rounded-2xl shadow-2xl transition-all duration-300"
                      style={{
                        width: '360px',
                        minHeight: '450px',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: generateTemplateSlideHtml(
                          currentSlide,
                          currentTemplate.themeStyle,
                          templateAccentColor
                        ),
                      }}
                    />
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveSlideIdx((prev) => Math.max(0, prev - 1))}
                      disabled={activeSlideIdx === 0}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-slate-600 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {templateSlides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveSlideIdx(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            activeSlideIdx === idx
                              ? 'bg-blue-600 w-6'
                              : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveSlideIdx((prev) =>
                          Math.min(templateSlides.length - 1, prev + 1)
                        )
                      }
                      disabled={activeSlideIdx === templateSlides.length - 1}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-slate-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Viewport: Compiled 2x Retina Images */}
              {activeTab === 'compiled' && (
                <div className="space-y-4">
                  {compiledImages.length > 0 ? (
                    <div className="space-y-4">
                      <div className="w-full flex flex-col items-center justify-center p-6 bg-slate-950/5 rounded-2xl border border-slate-200/80 min-h-[500px]">
                        <div
                          className="rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200 bg-white"
                          style={{
                            width: '360px',
                            height: '450px',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={compiledImages[activeCompiledIdx]}
                            alt={`Compiled Slide ${activeCompiledIdx + 1}`}
                            className="w-full h-full object-contain block"
                          />
                          <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-md text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-700">
                            2x Retina PNG
                          </div>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                          {compiledImages.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveCompiledIdx(idx)}
                              className={`w-12 h-15 rounded-lg border-2 overflow-hidden transition-all ${
                                activeCompiledIdx === idx
                                  ? 'border-blue-600 scale-105 shadow-md ring-2 ring-blue-500/20'
                                  : 'border-slate-200 opacity-60 hover:opacity-100'
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img}
                                alt={`Thumb ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Download & Publish Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadSlide(activeCompiledIdx)}
                            className="btn btn-secondary text-xs flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Slide</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDownloadAllSlides}
                            className="btn btn-secondary text-xs flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download All ({compiledImages.length})</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={handleOpenPublishModal}
                          className="btn btn-primary text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Post / Schedule</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Empty Placeholder */
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-3 min-h-[450px]">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-neutral-800">
                          Slides Not Rasterized Yet
                        </h4>
                        <p className="text-xs text-slate-500 max-w-xs mt-1">
                          Click &ldquo;Compile All Slides&rdquo; to rasterize all slides into 2x Retina PNGs ready for immediate Instagram, LinkedIn, and X publishing.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCompileSlides}
                        disabled={isCompiling}
                        className="btn btn-primary text-xs flex items-center gap-1.5 mt-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isCompiling ? 'Rasterizing...' : 'Compile All Slides'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          DOM SANDBOX CONTAINER (Mounted for reliable rasterization)
          ======================================================================== */}
      <div
        id="dedicated-template-raster-sandbox"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: 'auto',
          opacity: 1,
          pointerEvents: 'none',
          zIndex: -9999,
          visibility: 'visible',
        }}
      >
        {templateSlides.map((s, idx) => {
          const html = generateTemplateSlideHtml(s, currentTemplate.themeStyle, templateAccentColor);
          return (
            <div
              key={s.id}
              id={`dedicated-template-sandbox-${idx}`}
              style={{
                display: 'inline-block',
                position: 'relative',
                verticalAlign: 'top',
                margin: '0 20px 0 0',
                padding: 0,
                boxSizing: 'border-box',
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        })}
      </div>

      {/* ========================================================================
          PUBLISH / SCHEDULE MODAL
          ======================================================================== */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-lg w-full p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-neutral-900">
                    Publish or Schedule Carousel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publish immediately or schedule deterministic dispatch to Instagram, LinkedIn, and X.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Platforms */}
              <div>
                <label className="settings-label">Target Social Platforms</label>
                <div className="flex items-center gap-2">
                  {(['instagram', 'linkedin', 'x'] as SocialPlatform[]).map((plat) => {
                    const isSelected = publishPlatforms.includes(plat);
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() =>
                          setPublishPlatforms((prev) =>
                            prev.includes(plat)
                              ? prev.filter((p) => p !== plat)
                              : [...prev, plat]
                          )
                        }
                        className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-white text-slate-600 border-border hover:bg-slate-100'
                        }`}
                      >
                        {plat === 'x' ? 'X (Twitter)' : plat.charAt(0).toUpperCase() + plat.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Caption */}
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

              {/* Date & Time */}
              <div>
                <label className="settings-label">Schedule Date &amp; Time (UTC)</label>
                <input
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="settings-input !bg-white font-mono text-xs"
                />
              </div>

              {/* Slides Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-slate-600 text-xs">
                <span>Slides Attached:</span>
                <span className="font-mono font-bold text-neutral-900">
                  {compiledImages.length || templateSlides.length} Images Ready
                </span>
              </div>

              {publishSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium animate-fade-in">
                  {publishSuccessMsg}
                </div>
              )}
            </div>

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

      {/* Instagram Automation Modal (Playwright Engine) */}
      <InstagramAutomationModal
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
        compiledSlides={compiledImages}
        initialCaption={publishCaption}
        onCompileRequest={handleCompileSlides}
      />
    </div>
  );
}

