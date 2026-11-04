'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
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
  ClipboardPaste,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  FileText,
  Eraser,
  HelpCircle,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { SocialPlatform } from '@synergy/types';
import {
  extractSlideDimensions,
  isValidPngDataUrl,
  renderSlideViaIframe,
} from '@/lib/carouselTemplates';

// ==============================================================================
// PRESET SLIDE TEMPLATES
// ==============================================================================
interface CodeSlideItem {
  id: string;
  slideNumber: number;
  title: string;
  html: string;
}

const PRESET_COLLECTIONS: Record<
  string,
  { name: string; description: string; slides: Array<{ title: string; html: string }> }
> = {
  executiveDark: {
    name: 'Executive Dark (Sapphire Flare)',
    description: '3-slide high-impact presentation with modern dark gradient & pill badges',
    slides: [
      {
        title: 'Hook Slide',
        html: `<style>
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
</div>`,
      },
      {
        title: 'Core Pillar',
        html: `<style>
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
    <span class="tag">Pillar 02: Verification</span>
    <h1 class="headline">Zero-Touch Brand Voice & QA Auditing</h1>
    <p class="body">The QA Persona validates every slide against your Brand Kit guidelines, typography rules, and platform constraints prior to scheduling.</p>
  </div>
  <div class="slide-footer">
    <span>Brand Safety</span>
    <span class="badge-number">02 / 03</span>
  </div>
</div>`,
      },
      {
        title: 'Scale & Dispatch',
        html: `<style>
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
    ],
  },

  minimalLight: {
    name: 'Minimal Editorial (Clean Light)',
    description: 'Clean crisp light aesthetic with subtle borders and bold typography',
    slides: [
      {
        title: 'Hook Slide',
        html: `<style>
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
</div>`,
      },
      {
        title: 'Solution Slide',
        html: `<style>
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
    ],
  },

  statsMetrics: {
    name: 'Growth Metrics & Proof',
    description: 'High-contrast statistics slide with big bold numbers and proof points',
    slides: [
      {
        title: 'Proof Metric',
        html: `<style>
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
    ],
  },
};

export default function ContentStudioPage() {
  const { getCurrentBusiness, setTopbarLoading } = useWorkspaceStore();
  const business = getCurrentBusiness();

  // ----------------------------------------------------------------------------
  // SECTION 2: CODE-TO-CAROUSEL STUDIO (Per-Slide HTML & AI Content Writer)
  // ----------------------------------------------------------------------------
  const initialPreset = PRESET_COLLECTIONS.executiveDark;
  const [codeSlides, setCodeSlides] = useState<CodeSlideItem[]>(
    initialPreset.slides.map((s, idx) => ({
      id: `code-slide-${idx + 1}`,
      slideNumber: idx + 1,
      title: s.title,
      html: s.html,
    }))
  );

  const [activeCodeSlideIndex, setActiveCodeSlideIndex] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState<string | null>(null);
  const [compiledImages, setCompiledImages] = useState<string[]>([]);
  const [activeCompiledIndex, setActiveCompiledIndex] = useState(0);
  const [activeCodeTab, setActiveCodeTab] = useState<'editor' | 'live-html' | 'compiled'>(
    'editor'
  );
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Multi-Slide Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importHtmlInput, setImportHtmlInput] = useState('');

  const currentCodeSlide = codeSlides[activeCodeSlideIndex] || codeSlides[0];

  // Update HTML code for the currently active slide
  const handleUpdateCurrentSlideHtml = (newHtml: string) => {
    setCodeSlides((prev) =>
      prev.map((s, idx) => (idx === activeCodeSlideIndex ? { ...s, html: newHtml } : s))
    );
  };

  // Switch Preset
  const handleSelectPreset = (key: string) => {
    const selected = PRESET_COLLECTIONS[key];
    if (!selected) return;
    setCodeSlides(
      selected.slides.map((s, idx) => ({
        id: `code-slide-${idx + 1}-${Date.now()}`,
        slideNumber: idx + 1,
        title: s.title,
        html: s.html,
      }))
    );
    setActiveCodeSlideIndex(0);
    setCompiledImages([]);
    setActiveCodeTab('editor');
    setToastMessage(`Loaded preset: ${selected.name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ----------------------------------------------------------------------------
  // PER-SLIDE ACTIONS: Paste from clipboard, duplicate, reorder, clear, add
  // ----------------------------------------------------------------------------
  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().length > 0) {
          handleUpdateCurrentSlideHtml(text);
          setToastMessage(`📋 Pasted code into Slide ${activeCodeSlideIndex + 1}!`);
          setTimeout(() => setToastMessage(null), 3000);
          return;
        }
      }
      setToastMessage('Clipboard is empty or browser blocked permission. Please click inside the editor and press Ctrl+V.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      setToastMessage('Click inside the code box and press Ctrl+V to paste.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleDuplicateSlide = (idx: number) => {
    const source = codeSlides[idx];
    if (!source) return;
    const newSlide: CodeSlideItem = {
      id: `code-slide-${Date.now()}`,
      slideNumber: idx + 2,
      title: `${source.title || `Slide ${idx + 1}`} (Copy)`,
      html: source.html,
    };
    const updated = [...codeSlides];
    updated.splice(idx + 1, 0, newSlide);
    const reindexed = updated.map((s, i) => ({
      ...s,
      slideNumber: i + 1,
    }));
    setCodeSlides(reindexed);
    setActiveCodeSlideIndex(idx + 1);
    setCompiledImages([]);
    setToastMessage(`📑 Duplicated Slide ${idx + 1} to Slide ${idx + 2}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMoveSlide = (fromIdx: number, direction: 'prev' | 'next') => {
    const toIdx = direction === 'prev' ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= codeSlides.length) return;
    const updated = [...codeSlides];
    const temp = updated[fromIdx];
    updated[fromIdx] = updated[toIdx];
    updated[toIdx] = temp;
    const reindexed = updated.map((s, i) => ({
      ...s,
      slideNumber: i + 1,
    }));
    setCodeSlides(reindexed);
    setActiveCodeSlideIndex(toIdx);
    setCompiledImages([]);
  };

  const handleClearCurrentSlide = () => {
    handleUpdateCurrentSlideHtml('');
    setToastMessage(`Cleared code for Slide ${activeCodeSlideIndex + 1}. Ready for paste.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateSlideTitle = (idx: number, title: string) => {
    setCodeSlides((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, title } : s))
    );
  };

  const handleAddSlide = () => {
    const nextNum = codeSlides.length + 1;
    const starterHtml = `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: #0b1120;
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
  }
  .tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #60a5fa;
    background: rgba(96, 165, 250, 0.15);
    padding: 4px 10px;
    border-radius: 9999px;
    display: inline-block;
  }
  .headline {
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    margin: 16px 0 8px 0;
  }
  .body {
    font-size: 14px;
    line-height: 1.6;
    color: #94a3b8;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 12px;
    font-size: 12px;
    color: #64748b;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="tag">Slide ${nextNum}</span>
    <h2 class="headline">Slide ${nextNum} Headline</h2>
    <p class="body">Paste your HTML or customize this slide text.</p>
  </div>
  <div class="slide-footer">
    <span>Synergy Carousel</span>
    <span>0${nextNum}</span>
  </div>
</div>`;

    const newSlide: CodeSlideItem = {
      id: `code-slide-${Date.now()}`,
      slideNumber: nextNum,
      title: `Slide ${nextNum}`,
      html: starterHtml,
    };
    setCodeSlides([...codeSlides, newSlide]);
    setActiveCodeSlideIndex(codeSlides.length);
    setCompiledImages([]);
    setToastMessage(`✨ Added Slide ${nextNum}! Ready to paste your code.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteSlide = (idx: number) => {
    if (codeSlides.length <= 1) return;
    const filtered = codeSlides
      .filter((_, i) => i !== idx)
      .map((s, i) => ({ ...s, slideNumber: i + 1, title: s.title || `Slide ${i + 1}` }));
    setCodeSlides(filtered);
    setActiveCodeSlideIndex(Math.max(0, idx - 1));
    setCompiledImages([]);
    setToastMessage(`Deleted slide. ${filtered.length} slides remaining.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Multi-Slide Import handler (splits multi-slide HTML into individual slides)
  const handleImportMultiSlide = () => {
    if (!importHtmlInput.trim()) return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(importHtmlInput, 'text/html');

      const styles = Array.from(doc.querySelectorAll('style'))
        .map((s) => s.outerHTML)
        .join('\n');

      let slideNodes = Array.from(doc.querySelectorAll('.carousel-slide'));
      if (slideNodes.length === 0) {
        slideNodes = Array.from(doc.querySelectorAll('.slide, section, .card-slide'));
      }

      if (slideNodes.length > 0) {
        const parsed: CodeSlideItem[] = slideNodes.map((node, i) => ({
          id: `imported-slide-${i + 1}-${Date.now()}`,
          slideNumber: i + 1,
          title: `Slide ${i + 1}`,
          html: `${styles ? styles + '\n' : ''}${node.outerHTML}`,
        }));
        setCodeSlides(parsed);
        setActiveCodeSlideIndex(0);
        setCompiledImages([]);
        setIsImportModalOpen(false);
        setImportHtmlInput('');
        setToastMessage(`✅ Successfully imported and split ${parsed.length} slides!`);
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        handleUpdateCurrentSlideHtml(importHtmlInput);
        setIsImportModalOpen(false);
        setImportHtmlInput('');
        setToastMessage(`Pasted code into Slide ${activeCodeSlideIndex + 1}!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err: any) {
      alert('Could not parse HTML: ' + err.message);
    }
  };

  // ----------------------------------------------------------------------------
  // COMPILE HANDLER: Reliably rasterizes EVERY slide into crisp 2x Retina PNG images
  // Dual-strategy: Primary DOM capture + Isolated HTML5 Iframe Fallback
  // ----------------------------------------------------------------------------
  const handleCompileCarousel = async () => {
    setIsCompiling(true);
    setTopbarLoading(true);
    setCompileProgress('Initializing 2x retina rasterization engine...');

    try {
      const { toPng } = await import('html-to-image');
      const images: string[] = [];

      for (let i = 0; i < codeSlides.length; i++) {
        setCompileProgress(`Compiling Slide ${i + 1} of ${codeSlides.length} (2x Retina)...`);
        const slideItem = codeSlides[i];
        const dims = extractSlideDimensions(slideItem.html);

        let dataUrl = '';

        // Strategy 1: Render directly from DOM sandbox
        const slideContainer = document.getElementById(`sandbox-slide-${i}`);
        if (slideContainer) {
          try {
            const innerSlide =
              (slideContainer.querySelector('.carousel-slide') as HTMLElement) ||
              (Array.from(slideContainer.children).find(
                (c) => c.tagName.toLowerCase() !== 'style'
              ) as HTMLElement) ||
              slideContainer;

            const rect = innerSlide.getBoundingClientRect();
            const measuredWidth =
              rect.width >= 100 ? Math.round(rect.width) : dims.width;
            const measuredHeight =
              rect.height >= 100 ? Math.round(rect.height) : dims.height;

            // Size the container to wrap the slide tightly without altering inner flex items
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

        // Strategy 2: If DOM capture was empty or failed, use isolated HTML5 iframe
        if (!isValidPngDataUrl(dataUrl)) {
          setCompileProgress(`Optimizing Slide ${i + 1} via isolated iframe...`);
          dataUrl = await renderSlideViaIframe(slideItem.html, dims.width, dims.height);
        }

        if (isValidPngDataUrl(dataUrl)) {
          images.push(dataUrl);
        } else {
          throw new Error(`Slide ${i + 1} produced invalid image data.`);
        }
      }

      setCompiledImages(images);
      setActiveCompiledIndex(0);
      setActiveCodeTab('compiled');
      setCompileProgress(null);
      setToastMessage(`✅ Successfully compiled ${images.length} slides matching live preview!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error('Compilation failed:', err);
      alert(`Compilation failed: ${err.message || 'Unknown error'}`);
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

  // Copy current slide HTML
  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCodeSlide.html);
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
          slideCount: compiledImages.length || codeSlides.length,
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
        title="Custom HTML Code-to-Carousel Studio"
        description="Write or paste custom HTML/CSS code per slide, preview live in real-time, and compile to crisp 2x Retina PNGs for immediate multi-platform publishing."
        primaryAction={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCompileCarousel}
              disabled={isCompiling}
              className="btn-hero-primary flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isCompiling ? 'Rasterizing...' : `Compile All (${codeSlides.length})`}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
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
          CODE-TO-CAROUSEL STUDIO (Per-Slide HTML/CSS & 2x Retina Compiler)
          ======================================================================== */}
      <div id="code-carousel-studio" className="space-y-4 animate-fade-in">
          {/* Toast Alert */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-emerald-700 hover:text-emerald-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Slide Selector & Per-Slide Management Bar */}
          <div className="card p-3 flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200">
            {/* Left: Slide Selector Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                Slides ({codeSlides.length}):
              </span>
              {codeSlides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveCodeSlideIndex(idx);
                    setActiveCodeTab('editor');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${idx === activeCodeSlideIndex
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                >
                  <span>{s.title || `Slide ${idx + 1}`}</span>
                  {idx === activeCodeSlideIndex && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </button>
              ))}

              <button
                type="button"
                onClick={handleAddSlide}
                className="px-2.5 py-1.5 rounded-lg border border-dashed border-blue-400 bg-blue-50/60 hover:bg-blue-100/80 text-blue-700 text-xs flex items-center gap-1 font-bold transition-all"
                title="Add New Blank Slide"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </button>
            </div>

            {/* Right: Slide Controls & Multi-Slide Import */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="btn btn-secondary text-xs flex items-center gap-1.5 !bg-emerald-50 hover:!bg-emerald-100 border !border-emerald-300 text-emerald-800 font-bold shadow-sm !py-1 !px-2.5"
                title="Paste code directly from clipboard into active slide"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-emerald-700" />
                <span>Paste Code</span>
              </button>

              <button
                type="button"
                onClick={() => handleDuplicateSlide(activeCodeSlideIndex)}
                className="btn btn-secondary text-xs flex items-center gap-1.5 !bg-white hover:!bg-slate-100 border border-slate-300 text-slate-700 font-semibold shadow-sm !py-1 !px-2.5"
                title="Duplicate current slide"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Duplicate</span>
              </button>

              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => handleMoveSlide(activeCodeSlideIndex, 'prev')}
                  disabled={activeCodeSlideIndex === 0}
                  className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Move Slide Left"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <span className="w-px h-4 bg-slate-200" />
                <button
                  type="button"
                  onClick={() => handleMoveSlide(activeCodeSlideIndex, 'next')}
                  disabled={activeCodeSlideIndex === codeSlides.length - 1}
                  className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Move Slide Right"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {codeSlides.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(activeCodeSlideIndex)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-red-500 transition-colors"
                  title="Delete Current Slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <span className="w-px h-5 bg-slate-300 mx-0.5" />

              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="btn btn-secondary text-xs flex items-center gap-1.5 !bg-white hover:!bg-blue-50 border border-slate-300 text-blue-700 font-semibold shadow-sm !py-1 !px-2.5"
                title="Import a single HTML document with multiple slides"
              >
                <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                <span>Import Multi-Slide HTML</span>
              </button>
            </div>
          </div>

          {/* Code Studio Workspace: Left Editor, Right Live Render & Compiled Gallery */}
          <div className="grid grid-cols-12 gap-5">
            {/* Left Column (6 Cols): Code Editor & Compiler Toolbar */}
            <div className="col-span-12 lg:col-span-6 space-y-3">
              <div className="card p-4 space-y-3">
                {/* Editor Top Bar with Editable Title & Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-600" />
                    <input
                      type="text"
                      value={currentCodeSlide.title || ''}
                      onChange={(e) =>
                        handleUpdateSlideTitle(activeCodeSlideIndex, e.target.value)
                      }
                      placeholder={`Slide ${activeCodeSlideIndex + 1} Name`}
                      className="text-xs font-bold text-neutral-900 bg-slate-100 hover:bg-slate-200/80 focus:bg-white focus:ring-1 focus:ring-blue-500 px-2 py-1 rounded border border-slate-200 outline-none w-36"
                    />
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                      {activeCodeSlideIndex + 1} / {codeSlides.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center gap-1"
                      title="Paste from Clipboard"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Paste</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearCurrentSlide}
                      className="px-2 py-1 rounded hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1 border border-slate-200"
                      title="Clear current slide code"
                    >
                      <Eraser className="w-3.5 h-3.5 text-slate-500" />
                      <span>Clear</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-2 py-1 rounded hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1 border border-slate-200"
                      title="Copy Current Slide Code"
                    >
                      {copyFeedback ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{copyFeedback ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const initialHtml =
                          initialPreset.slides[
                            activeCodeSlideIndex % initialPreset.slides.length
                          ].html;
                        handleUpdateCurrentSlideHtml(initialHtml);
                      }}
                      className="px-2 py-1 rounded hover:bg-slate-100 text-slate-500 text-xs flex items-center gap-1"
                      title="Reset to Template"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
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
                      <span className="ml-2 text-slate-400">slide-{activeCodeSlideIndex + 1}.html</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">
                        {currentCodeSlide.html.length} chars
                      </span>
                      <span className="text-slate-400">Paste or edit HTML for this slide</span>
                    </div>
                  </div>

                  <textarea
                    value={currentCodeSlide.html}
                    onChange={(e) => handleUpdateCurrentSlideHtml(e.target.value)}
                    rows={18}
                    spellCheck={false}
                    className="w-full p-4 bg-[#070b13] text-emerald-400 font-mono text-[12.5px] leading-relaxed outline-none resize-y selection:bg-blue-600 selection:text-white"
                    placeholder={`<!-- Paste your HTML and <style> code for Slide ${activeCodeSlideIndex + 1} here -->`}
                  />
                </div>

                {/* Instructions and Compile CTA */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    Each slide is independent. Changes update the preview immediately.
                  </span>

                  <button
                    type="button"
                    onClick={handleCompileCarousel}
                    disabled={isCompiling}
                    className="btn btn-primary flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
                  >
                    <Play
                      className={`w-3.5 h-3.5 fill-current ${isCompiling ? 'animate-spin' : ''
                        }`}
                    />
                    <span>
                      {isCompiling
                        ? compileProgress || 'Compiling Images...'
                        : `Compile All ${codeSlides.length} Slides`}
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
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeCodeTab === 'editor'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Live Preview (Slide {activeCodeSlideIndex + 1})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('compiled')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${activeCodeTab === 'compiled'
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
                        <span>Download All ({compiledImages.length})</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* TAB 1: Live Interactive HTML Preview */}
                {activeCodeTab === 'editor' && (
                  <div className="flex-1 flex flex-col items-center justify-between p-4 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl overflow-hidden min-h-[500px]">
                    <div className="w-full flex items-center justify-between text-xs pb-2 border-b border-slate-200/60 mb-2">
                      <span className="font-bold text-slate-700">
                        {currentCodeSlide.title || `Slide ${activeCodeSlideIndex + 1}`} Preview
                      </span>
                      <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                        <span className="bg-slate-200/60 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-700">
                          {extractSlideDimensions(currentCodeSlide.html).width} × {extractSlideDimensions(currentCodeSlide.html).height} px
                        </span>
                        <span>
                          {activeCodeSlideIndex + 1} / {codeSlides.length}
                        </span>
                      </div>
                    </div>

                    <div className="w-full flex-1 flex items-center justify-center py-2 overflow-auto">
                      <div
                        dangerouslySetInnerHTML={{ __html: currentCodeSlide.html }}
                        className="flex flex-col items-center transition-all"
                      />
                    </div>

                    {/* Previous / Next Slide Selector in Preview */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 w-full justify-center">
                      <button
                        type="button"
                        onClick={() => setActiveCodeSlideIndex((p) => Math.max(0, p - 1))}
                        disabled={activeCodeSlideIndex === 0}
                        className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-semibold text-slate-600">
                        Slide {activeCodeSlideIndex + 1} of {codeSlides.length}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveCodeSlideIndex((p) => Math.min(codeSlides.length - 1, p + 1))
                        }
                        disabled={activeCodeSlideIndex === codeSlides.length - 1}
                        className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: Compiled Retina Images Gallery */}
                {activeCodeTab === 'compiled' && (
                  <div className="flex-1 flex flex-col items-center justify-between p-4 bg-slate-50/70 border border-slate-200 rounded-xl min-h-[500px]">
                    {compiledImages.length === 0 ? (
                      <div className="my-auto text-center space-y-3 py-12">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <h4 className="font-heading font-bold text-sm text-neutral-900">
                          No Compiled Images Yet
                        </h4>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                          Click &ldquo;Compile All {codeSlides.length} Slides&rdquo; to generate crisp 2x retina social PNGs matching your exact live preview.
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
                      <div className="w-full flex-1 flex flex-col items-center justify-between space-y-3">
                        {/* Active Compiled Image Header */}
                        <div className="w-full flex items-center justify-between text-xs px-2 pb-2 border-b border-slate-200/60">
                          <span className="font-bold text-slate-700">
                            Slide {activeCompiledIndex + 1} of {compiledImages.length}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold text-[10px]">
                              {extractSlideDimensions(codeSlides[activeCompiledIndex]?.html || '').width * 2} × {extractSlideDimensions(codeSlides[activeCompiledIndex]?.html || '').height * 2} px (2x Retina)
                            </span>
                            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold text-[10px]">
                              1:1 Match Ready
                            </span>
                          </div>
                        </div>

                        {/* Compiled Image Display - Sized exactly as the live preview slide */}
                        <div className="w-full flex-1 flex items-center justify-center py-2 overflow-auto">
                          <img
                            src={compiledImages[activeCompiledIndex]}
                            alt={`Compiled Slide ${activeCompiledIndex + 1}`}
                            style={{
                              width: `${extractSlideDimensions(codeSlides[activeCompiledIndex]?.html || '').width}px`,
                              height: `${extractSlideDimensions(codeSlides[activeCompiledIndex]?.html || '').height}px`,
                              maxWidth: '100%',
                              objectFit: 'contain',
                            }}
                            className="rounded-xl shadow-xl border border-slate-300"
                          />
                        </div>

                        {/* Carousel Thumbnail Strip & Controls */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 w-full justify-center">
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
                                className={`w-8 h-10 rounded-md overflow-hidden border-2 transition-all ${i === activeCompiledIndex
                                    ? 'border-blue-600 scale-105 shadow-sm'
                                    : 'border-slate-200 opacity-60 hover:opacity-100'
                                  }`}
                              >
                                <img src={img} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
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
                        <span>{compiledImages.length} Slides Rasterized & Ready to Publish</span>
                      </span>
                    ) : (
                      <span>Ready to compile {codeSlides.length} HTML slides into social assets</span>
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
          MULTI-SLIDE SANDBOX DOM CONTAINER (Mounted for reliable rasterization)
          ======================================================================== */}
      <div
        id="carousel-raster-sandbox"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '0',
          width: 'auto',
          opacity: 1, // Must be 1 so canvas paints pixels
          pointerEvents: 'none',
          zIndex: -9999,
          visibility: 'visible',
        }}
      >
        {/* Code slides rasterization sandbox */}
        {codeSlides.map((s, idx) => (
          <div
            key={s.id}
            id={`sandbox-slide-${idx}`}
            style={{
              display: 'inline-block',
              position: 'relative',
              verticalAlign: 'top',
              margin: '0 20px 0 0',
              padding: 0,
              boxSizing: 'border-box',
            }}
            dangerouslySetInnerHTML={{ __html: s.html }}
          />
        ))}
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
                        className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all border ${isSelected
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
                  {(compiledImages.length || codeSlides.length)}{' '}
                  Images Ready
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

      {/* ========================================================================
          MULTI-SLIDE HTML IMPORT MODAL
          ======================================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-xl w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-neutral-900">
                    Import Multi-Slide HTML
                  </h3>
                  <p className="text-xs text-slate-500">
                    Paste an entire HTML document containing multiple slides to extract and split automatically.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Paste Multi-Slide HTML Code:
              </label>
              <textarea
                value={importHtmlInput}
                onChange={(e) => setImportHtmlInput(e.target.value)}
                rows={12}
                placeholder="<style>&#10;  .carousel-slide { width: 360px; height: 450px; ... }&#10;</style>&#10;<div class='carousel-slide'>...</div>&#10;<div class='carousel-slide'>...</div>"
                className="w-full p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl outline-none border border-slate-700 leading-relaxed resize-y"
              />
              <p className="text-[11px] text-slate-500">
                Synergy detects elements with class <code className="text-blue-600">.carousel-slide</code> or <code className="text-blue-600">.slide</code>, extracts any shared <code className="text-blue-600">&lt;style&gt;</code> blocks, and creates separate slide tabs for each one.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="btn btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportMultiSlide}
                disabled={!importHtmlInput.trim()}
                className="btn btn-primary text-xs flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Extract &amp; Import Slides</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
