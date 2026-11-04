// ==============================================================================
// SYNERGY IN-HOUSE CAROUSEL TEMPLATES & RASTERIZATION ENGINE
// ==============================================================================

export interface InhouseTemplateSlide {
  id: string;
  title: string;
  tag: string;
  headline: string;
  body: string;
  stat?: string;
  footerText: string;
  footerBadge: string;
  customHtml?: string;
}

export interface InhouseTemplate {
  id: string;
  name: string;
  badge: string;
  category: 'Executive & B2B' | 'Thought Leadership' | 'Metrics & Growth' | 'Product Launch' | 'Educational SOP' | 'Quotes & Authority';
  description: string;
  accentColors: string[];
  themeStyle: {
    bg: string;
    text: string;
    accent: string;
    tagBg: string;
    tagBorder: string;
    border?: string;
  };
  slides: InhouseTemplateSlide[];
}

export const INHOUSE_TEMPLATES: Record<string, InhouseTemplate> = {
  executiveDark: {
    id: 'executiveDark',
    name: 'Executive Dark',
    badge: 'B2B Enterprise',
    category: 'Executive & B2B',
    description: 'Deep sapphire navy gradient with glowing pill badges and clean modern typography.',
    accentColors: ['#60a5fa', '#38bdf8', '#818cf8', '#34d399', '#f472b6'],
    themeStyle: {
      bg: 'linear-gradient(135deg, #0b1120 0%, #111827 50%, #172554 100%)',
      text: '#ffffff',
      accent: '#60a5fa',
      tagBg: 'rgba(96, 165, 250, 0.14)',
      tagBorder: 'rgba(96, 165, 250, 0.25)',
    },
    slides: [
      {
        id: 'ed-1',
        title: 'Hook Slide',
        tag: 'Executive Brief',
        headline: 'The Asymmetric Advantage of AI Marketing Systems',
        body: 'Most marketing leaders assume more manual effort equals higher growth. The real competitive moat is autonomous systemization.',
        footerText: 'CrossTech Operations',
        footerBadge: '01 / 03',
      },
      {
        id: 'ed-2',
        title: 'Core Pillar',
        tag: 'Architecture',
        headline: 'Three Deterministic Execution Pillars',
        body: 'By separating strategy, copywriting, and quality verification into specialized agents, brand conformance reaches 99.4% with zero human fatigue.',
        footerText: 'Brand Safety',
        footerBadge: '02 / 03',
      },
      {
        id: 'ed-3',
        title: 'Scale & Deploy',
        tag: 'Scale & Dispatch',
        headline: 'Deterministic Multi-Platform Publishing',
        body: 'With Upstash Redis distributed locks, posts are published seamlessly to Instagram, LinkedIn, and X with zero duplicate dispatches.',
        footerText: 'Ready to Deploy →',
        footerBadge: '03 / 03',
      },
    ],
  },

  minimalEditorial: {
    id: 'minimalEditorial',
    name: 'Minimal Editorial',
    badge: 'Thought Leadership',
    category: 'Thought Leadership',
    description: 'Crisp Swiss light aesthetic with deep charcoal typography and royal blue accents.',
    accentColors: ['#1d4ed8', '#0f172a', '#059669', '#7c3aed', '#dc2626'],
    themeStyle: {
      bg: '#ffffff',
      text: '#0f172a',
      accent: '#1d4ed8',
      tagBg: '#eff6ff',
      tagBorder: '#dbeafe',
      border: '1px solid #e2e8f0',
    },
    slides: [
      {
        id: 'me-1',
        title: 'The Challenge',
        tag: 'Strategy Audit',
        headline: '5 Signals Your Social Media Strategy is Outdated',
        body: 'Static canvas graphics and manual scheduling will not scale in 2026. Leading B2B teams operate continuous autonomous engines instead.',
        footerText: 'Synergy Editorial',
        footerBadge: '01 / 03',
      },
      {
        id: 'me-2',
        title: 'The Solution',
        tag: 'System Design',
        headline: 'Architecture Over Willpower',
        body: 'Replace fragmented tools with a continuous content engine. Strategy, generation, and distribution run seamlessly in one unified workspace.',
        footerText: 'Operational Playbook',
        footerBadge: '02 / 03',
      },
      {
        id: 'me-3',
        title: 'Action Item',
        tag: 'Next Steps',
        headline: 'Modernize Your Content Stack Today',
        body: 'Audit your active channels, connect your AI keys, and dispatch your first deterministic multi-slide carousel in under 5 minutes.',
        footerText: 'Swipe to Implement →',
        footerBadge: '03 / 03',
      },
    ],
  },

  viralMetrics: {
    id: 'viralMetrics',
    name: 'Viral Metrics & Proof',
    badge: 'Stats & Proof',
    category: 'Metrics & Growth',
    description: 'High-contrast dark card with glowing emerald numbers designed for case studies.',
    accentColors: ['#10b981', '#34d399', '#6ee7b7', '#38bdf8', '#facc15'],
    themeStyle: {
      bg: 'linear-gradient(135deg, #050811 0%, #06141d 50%, #022c22 100%)',
      text: '#ffffff',
      accent: '#10b981',
      tagBg: 'rgba(16, 185, 129, 0.16)',
      tagBorder: 'rgba(16, 185, 129, 0.3)',
    },
    slides: [
      {
        id: 'vm-1',
        title: 'Headline Metric',
        tag: 'Growth Proof',
        stat: '+312%',
        headline: 'Quarterly Organic Reach Expansion',
        body: 'How we shifted from ad-hoc manual posting to multi-agent automated orchestration across 3 business entities.',
        footerText: 'Verified Data',
        footerBadge: '01 / 03',
      },
      {
        id: 'vm-2',
        title: 'Efficiency Metric',
        tag: 'Time Saved',
        stat: '18.4 hrs',
        headline: 'Weekly Marketing Labor Reclaimed',
        body: 'Creative directors spend their hours on strategic positioning while AI agents draft, verify, and format high-converting slide sequences.',
        footerText: 'Efficiency Audit',
        footerBadge: '02 / 03',
      },
      {
        id: 'vm-3',
        title: 'Conversion Stat',
        tag: 'ROI Realized',
        stat: '99.4%',
        headline: 'Brand Voice Conformance Score',
        body: 'Pre-flight brand rule evaluation ensures every post adheres to strict tone, typography, and logo usage guidelines before dispatch.',
        footerText: 'Case Study • Synergy',
        footerBadge: '03 / 03',
      },
    ],
  },

  productLaunch: {
    id: 'productLaunch',
    name: 'Tech Founder & Launch',
    badge: 'Product Release',
    category: 'Product Launch',
    description: 'Neon violet glow aesthetic with modern gradient typography for announcements.',
    accentColors: ['#a855f7', '#c084fc', '#e879f9', '#60a5fa', '#38bdf8'],
    themeStyle: {
      bg: 'linear-gradient(135deg, #0f0728 0%, #1e1145 60%, #311054 100%)',
      text: '#ffffff',
      accent: '#c084fc',
      tagBg: 'rgba(192, 132, 252, 0.16)',
      tagBorder: 'rgba(192, 132, 252, 0.3)',
    },
    slides: [
      {
        id: 'pl-1',
        title: 'Release Hook',
        tag: 'Major Release',
        headline: 'Introducing Synergy 2.0: Autonomous Content Operations',
        body: 'The single pane of glass for B2B brands to scale high-frequency, high-quality carousel publishing without expanding headcount.',
        footerText: 'Release Notes v2.0',
        footerBadge: '01 / 03',
      },
      {
        id: 'pl-2',
        title: 'Key Feature',
        tag: 'Architecture',
        headline: 'Built-in Upstash Redis Distributed Locks',
        body: 'Never worry about double-publishing or race conditions. Synergy uses atomic Redis locking to guarantee single execution across workers.',
        footerText: 'Zero-Downtime Engine',
        footerBadge: '02 / 03',
      },
      {
        id: 'pl-3',
        title: 'Call to Action',
        tag: 'Live Demo',
        headline: 'Start Publishing in Under 60 Seconds',
        body: 'Connect your workspace social accounts, customize your brand guidelines, and schedule your first 10-slide carousel right now.',
        footerText: 'Try It Today →',
        footerBadge: '03 / 03',
      },
    ],
  },

  stepBlueprint: {
    id: 'stepBlueprint',
    name: 'Step-by-Step Blueprint',
    badge: 'Educational SOP',
    category: 'Educational SOP',
    description: 'Charcoal and amber gold theme tailored for frameworks, tutorials, and step guides.',
    accentColors: ['#f59e0b', '#fbbf24', '#f97316', '#38bdf8', '#34d399'],
    themeStyle: {
      bg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #451a03 100%)',
      text: '#ffffff',
      accent: '#fbbf24',
      tagBg: 'rgba(251, 191, 36, 0.15)',
      tagBorder: 'rgba(251, 191, 36, 0.3)',
    },
    slides: [
      {
        id: 'sp-1',
        title: 'Step 1: Hook',
        tag: 'Step 01: Audit',
        headline: 'Diagnose Your Social Pipeline Leaks',
        body: 'Identify where manual bottlenecks occur. If content takes more than 30 minutes from ideation to scheduling, your tooling is broken.',
        footerText: 'SOP Framework',
        footerBadge: '01 / 03',
      },
      {
        id: 'sp-2',
        title: 'Step 2: Structure',
        tag: 'Step 02: Standardize',
        headline: 'Standardize Your Visual Formats',
        body: 'Use predictable slide structures. Audiences retain information 65% better when typography, contrast, and layout are consistent.',
        footerText: 'B2B Blueprint',
        footerBadge: '02 / 03',
      },
      {
        id: 'sp-3',
        title: 'Step 3: Automate',
        tag: 'Step 03: Scale',
        headline: 'Schedule & Scale Without Burnout',
        body: 'Batch create your templates in Content Studio, compile to 2x retina PNGs, and schedule across all platforms at once.',
        footerText: 'Swipe to Save →',
        footerBadge: '03 / 03',
      },
    ],
  },

  thoughtLeadership: {
    id: 'thoughtLeadership',
    name: 'Thought Leadership Quote',
    badge: 'Executive Voice',
    category: 'Quotes & Authority',
    description: 'High-contrast monochrome bold aesthetic with big quotation styling and authority badges.',
    accentColors: ['#ffffff', '#60a5fa', '#34d399', '#f59e0b', '#f43f5e'],
    themeStyle: {
      bg: '#000000',
      text: '#ffffff',
      accent: '#ffffff',
      tagBg: 'rgba(255, 255, 255, 0.12)',
      tagBorder: 'rgba(255, 255, 255, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    },
    slides: [
      {
        id: 'tl-1',
        title: 'The Quote',
        tag: 'Core Principle',
        headline: '"Consistency isn\'t discipline. It\'s architecture."',
        body: 'The teams that publish every week without fail don\'t have more willpower. They have systems that make failure impossible.',
        footerText: 'Synergy Perspective',
        footerBadge: '01 / 02',
      },
      {
        id: 'tl-2',
        title: 'The Takeaway',
        tag: 'Execution Model',
        headline: 'Build Systems That Compound Daily',
        body: 'Automate your scheduling, templatize your visual designs, and spend your time only on high-leverage strategic decisions.',
        footerText: 'Follow for more →',
        footerBadge: '02 / 02',
      },
    ],
  },

  saasPlaybook: {
    id: 'saasPlaybook',
    name: 'SaaS Growth Playbook',
    badge: 'Conversion Engine',
    category: 'Product Launch',
    description: 'Electric cyan and slate navy aesthetic engineered for B2B product walkthroughs.',
    accentColors: ['#06b6d4', '#22d3ee', '#38bdf8', '#818cf8', '#10b981'],
    themeStyle: {
      bg: 'linear-gradient(135deg, #082f49 0%, #0f172a 50%, #0369a1 100%)',
      text: '#ffffff',
      accent: '#22d3ee',
      tagBg: 'rgba(34, 211, 238, 0.15)',
      tagBorder: 'rgba(34, 211, 238, 0.3)',
    },
    slides: [
      {
        id: 'sb-1',
        title: 'Conversion Hook',
        tag: 'SaaS Playbook',
        stat: '10x',
        headline: 'Multiply Content Velocity with Personas',
        body: 'By connecting specialized AI personas to a central brand kit, product marketing teams launch 10x more carousel campaigns per quarter.',
        footerText: 'SaaS Growth Guide',
        footerBadge: '01 / 03',
      },
      {
        id: 'sb-2',
        title: 'Operational Flow',
        tag: 'Execution',
        headline: 'From Raw Code to Multi-Slide Retinas',
        body: 'Write or paste custom HTML, customize copy visual fields, and immediately compile to 2x retina PNGs ready for Instagram and LinkedIn.',
        footerText: 'Retina Engine',
        footerBadge: '02 / 03',
      },
      {
        id: 'sb-3',
        title: 'Next Action',
        tag: 'Get Started',
        headline: 'Deploy Your First Carousel Campaign',
        body: 'Select this template, adjust your brand colors, and hit Post or Schedule to push live across all connected social channels.',
        footerText: 'Start Now →',
        footerBadge: '03 / 03',
      },
    ],
  },

  frameworkMatrix: {
    id: 'frameworkMatrix',
    name: 'Framework & Matrix',
    badge: 'Strategic Matrix',
    category: 'Executive & B2B',
    description: 'Deep obsidian card with clean borders and emerald accents for business matrixes.',
    accentColors: ['#10b981', '#60a5fa', '#f59e0b', '#ec4899', '#8b5cf6'],
    themeStyle: {
      bg: 'linear-gradient(135deg, #18181b 0%, #09090b 60%, #1c1917 100%)',
      text: '#ffffff',
      accent: '#10b981',
      tagBg: 'rgba(16, 185, 129, 0.14)',
      tagBorder: 'rgba(16, 185, 129, 0.28)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    slides: [
      {
        id: 'fm-1',
        title: 'Framework Intro',
        tag: 'Strategy Matrix',
        headline: 'The 4-Quadrant Content Engine Model',
        body: 'High frequency with low quality harms your brand. Low frequency with high quality misses market momentum. Autonomous systems give you both.',
        footerText: 'Strategic Framework',
        footerBadge: '01 / 03',
      },
      {
        id: 'fm-2',
        title: 'The Quadrant',
        tag: 'Analysis',
        headline: 'Autonomous Quality at High Velocity',
        body: 'Synergy combines multi-agent drafting, brand safety validation, and rasterized carousel publishing in one unified workflow.',
        footerText: 'Quadrant 4 Advantage',
        footerBadge: '02 / 03',
      },
      {
        id: 'fm-3',
        title: 'Implementation',
        tag: 'Action Plan',
        headline: 'Implement the Matrix in Your Business',
        body: 'Assign each persona their strategic role, select your favorite in-house templates, and watch your social engagement compound.',
        footerText: 'Synergy Playbook →',
        footerBadge: '03 / 03',
      },
    ],
  },
};

// ----------------------------------------------------------------------------
// HTML / CSS RENDER GENERATOR
// ----------------------------------------------------------------------------
export function generateTemplateSlideHtml(
  slide: InhouseTemplateSlide,
  theme: InhouseTemplate['themeStyle'],
  accentOverride?: string
): string {
  if (slide.customHtml && slide.customHtml.trim()) {
    return slide.customHtml;
  }

  const accent = accentOverride || theme.accent;

  return `<style>
  .carousel-slide {
    width: 360px;
    height: 450px;
    background: ${theme.bg};
    color: ${theme.text};
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 32px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    ${theme.border ? `border: ${theme.border};` : ''}
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  .tag {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${accent};
    background: ${theme.tagBg};
    padding: 5px 12px;
    border-radius: 9999px;
    display: inline-block;
    border: 1px solid ${theme.tagBorder};
  }
  .stat-huge {
    font-family: 'Montserrat', sans-serif;
    font-size: 50px;
    font-weight: 900;
    color: ${accent};
    line-height: 1;
    margin: 14px 0 6px 0;
    letter-spacing: -0.03em;
  }
  .headline {
    font-family: 'Montserrat', sans-serif;
    font-size: 22px;
    font-weight: 800;
    line-height: 1.25;
    margin: ${slide.stat ? '6px 0 10px 0' : '16px 0 12px 0'};
    letter-spacing: -0.02em;
    color: ${theme.text};
  }
  .body {
    font-size: 13.5px;
    line-height: 1.6;
    color: ${theme.text === '#ffffff' ? '#94a3b8' : '#475569'};
    margin: 0;
  }
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid ${theme.text === '#ffffff' ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0'};
    padding-top: 14px;
    font-size: 12px;
    color: ${theme.text === '#ffffff' ? '#64748b' : '#94a3b8'};
    font-weight: 600;
  }
  .badge-number {
    font-family: monospace;
    color: ${accent};
    background: ${theme.tagBg};
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 700;
  }
</style>

<div class="carousel-slide">
  <div>
    <span class="tag">${slide.tag}</span>
    ${slide.stat ? `<div class="stat-huge">${slide.stat}</div>` : ''}
    <h1 class="headline">${slide.headline}</h1>
    <p class="body">${slide.body}</p>
  </div>
  <div class="slide-footer">
    <span>${slide.footerText}</span>
    <span class="badge-number">${slide.footerBadge}</span>
  </div>
</div>`;
}

// ----------------------------------------------------------------------------
// RASTERIZATION UTILITIES
// ----------------------------------------------------------------------------
export const extractSlideDimensions = (html: string) => {
  const slideRuleMatch =
    html.match(/\.carousel-slide\s*\{([^}]+)\}/i) ||
    html.match(/\.slide\s*\{([^}]+)\}/i) ||
    html.match(/body\s*\{([^}]+)\}/i);
  const cssScope = slideRuleMatch ? slideRuleMatch[1] : html;

  const widthMatch = cssScope.match(/width:\s*(\d+)px/i) || html.match(/width:\s*(\d+)px/i);
  const heightMatch = cssScope.match(/height:\s*(\d+)px/i) || html.match(/height:\s*(\d+)px/i);

  let width = widthMatch && parseInt(widthMatch[1], 10) >= 100 ? parseInt(widthMatch[1], 10) : 360;
  let height = heightMatch && parseInt(heightMatch[1], 10) >= 100 ? parseInt(heightMatch[1], 10) : 450;
  return { width, height };
};

export const isValidPngDataUrl = (url: any): boolean => {
  return (
    typeof url === 'string' &&
    url.startsWith('data:image/png;base64,') &&
    url.length > 250
  );
};

export const renderSlideViaIframe = async (
  html: string,
  width: number,
  height: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.style.border = 'none';
    iframe.style.opacity = '1';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-9999';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      return reject(new Error('Iframe context unavailable'));
    }

    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><style>* { box-sizing: border-box; } html, body { margin: 0; padding: 0; width: ${width}px; height: ${height}px; overflow: hidden; background: transparent; }</style></head><body>${html}</body></html>`);
    doc.close();

    setTimeout(async () => {
      try {
        const { toPng } = await import('html-to-image');
        const target =
          (doc.body.querySelector('.carousel-slide') as HTMLElement) ||
          (doc.body.firstElementChild as HTMLElement) ||
          doc.body;

        const rect = target.getBoundingClientRect();
        const targetW = rect.width >= 100 ? Math.round(rect.width) : width;
        const targetH = rect.height >= 100 ? Math.round(rect.height) : height;

        const result = await toPng(doc.body, {
          width: targetW,
          height: targetH,
          pixelRatio: 2,
          skipFonts: true,
          cacheBust: false,
        });

        document.body.removeChild(iframe);
        if (isValidPngDataUrl(result)) {
          resolve(result);
        } else {
          reject(new Error('Iframe produced empty image'));
        }
      } catch (err) {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        reject(err);
      }
    }, 180);
  });
};

// ==============================================================================
// AI CONTENT GENERATOR FOR IN-HOUSE TEMPLATES
// Generates fresh, high-converting copy tailored to the user's prompt while
// completely preserving the active template's layout, theme, and styling.
// ==============================================================================

export function cleanSubjectFromPrompt(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return 'Operational Excellence';

  let cleaned = trimmed
    .replace(/^(generate|create|write|make|build|produce)\s+/i, '')
    .replace(/^(a|an|the)\s+/i, '')
    .replace(/^(brand\s+content|carousel|slides?|post|social\s+post)\s+/i, '')
    .replace(/^(using|for|about|with|on|around)\s+/i, '')
    .trim();

  if (/employee\s*os/i.test(cleaned) || /employee\s*os/i.test(prompt)) {
    return 'EmployeeOS';
  }
  if (/synergy/i.test(cleaned) || /synergy/i.test(prompt)) {
    return 'Synergy';
  }

  if (cleaned.length > 0) {
    return cleaned
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
  return 'Strategic Operations';
}

export function generateAiSlideCopy(
  prompt: string,
  templateId: string,
  slideIndex: number,
  totalSlides: number,
  existingSlide?: InhouseTemplateSlide
): InhouseTemplateSlide {
  const subject = cleanSubjectFromPrompt(prompt);
  const isEmployeeOs = /employee\s*os/i.test(prompt) || subject === 'EmployeeOS';
  const pad = (n: number) => String(n).padStart(2, '0');
  const footerBadge = `${pad(slideIndex + 1)} / ${pad(totalSlides)}`;
  const footerText = isEmployeeOs ? 'EmployeeOS Architecture' : `${subject} Blueprint`;

  // Template-specific tailoring
  if (templateId === 'stepPlaybook') {
    const stepNum = slideIndex + 1;
    if (slideIndex === 0) {
      return {
        id: existingSlide?.id || `slide-${Date.now()}-${slideIndex}`,
        title: `Step 1: Audit`,
        tag: `Step 01: Focus`,
        headline: isEmployeeOs
          ? 'Audit Your Fragmented Team Lifecycle'
          : `Define the Core Operating Pillars for ${subject}`,
        body: isEmployeeOs
          ? 'Most companies lose 4.8 hours per employee weekly on scattered onboarding spreadsheets and siloed tools. First, identify every manual operational handoff.'
          : `Anchor your ${subject} strategy around non-negotiable fundamentals. Extreme clarity beats reactive chaos every single time.`,
        footerText,
        footerBadge,
      };
    } else if (slideIndex === totalSlides - 1) {
      return {
        id: existingSlide?.id || `slide-${Date.now()}-${slideIndex}`,
        title: `Step ${stepNum}: Scale`,
        tag: `Step ${pad(stepNum)}: Scale`,
        headline: isEmployeeOs
          ? 'Scale Workforce Velocity Autonomously'
          : `Automate & Scale ${subject} Without Burnout`,
        body: isEmployeeOs
          ? 'Turn team coordination into an autonomous engine with EmployeeOS. Reclaim your executive focus for high-conviction strategic decisions.'
          : `Standardize your workflows into compounding systems. Consistent operational architecture makes execution repeatable.`,
        footerText: isEmployeeOs ? 'employeeos.io →' : 'Swipe to Save →',
        footerBadge,
      };
    } else {
      return {
        id: existingSlide?.id || `slide-${Date.now()}-${slideIndex}`,
        title: `Step ${stepNum}: Automate`,
        tag: `Step ${pad(stepNum)}: Systems`,
        headline: isEmployeeOs
          ? 'Deploy Zero-Touch Onboarding & Milestone Sync'
          : `Systematize Your Execution Engine`,
        body: isEmployeeOs
          ? 'Provision role workspaces in 60 seconds with automated compliance, real-time feedback loops, and frictionless performance milestones.'
          : `Remove manual drag by templatizing every touchpoint. Predictable execution structures increase team output by over 65%.`,
        footerText,
        footerBadge,
      };
    }
  }

  if (templateId === 'viralMetrics') {
    if (slideIndex === 0) {
      return {
        id: existingSlide?.id || `slide-${Date.now()}-${slideIndex}`,
        title: 'Stat Hook',
        tag: 'Growth Benchmark',
        stat: isEmployeeOs ? '10x' : '+340%',
        headline: isEmployeeOs
          ? '10x Faster Team Provisioning with EmployeeOS'
          : `Massive Engagement Lift from Systematic ${subject}`,
        body: isEmployeeOs
          ? 'Companies switching to autonomous workforce operating systems eliminate hours of manual onboarding and disconnected HR paperwork.'
          : `Data shows teams executing on ${subject} with structured visual systems achieve over 3x higher retention and audience dwell time.`,
        footerText,
        footerBadge,
      };
    } else if (slideIndex === totalSlides - 1) {
      return {
        id: existingSlide?.id || `slide-${Date.now()}-${slideIndex}`,
        title: 'Velocity CTA',
        tag: 'Compound Growth',
        stat: isEmployeeOs ? '-72%' : '4.8h',
        headline: isEmployeeOs
          ? 'Reduce Operational Drag by 72% Starting Today'
          : `Save Over 200 Hours of Execution Drag Annually`,
        body: isEmployeeOs
          ? 'Build a high-performance team architecture that compounds daily. Deploy EmployeeOS and reclaim your leadership focus.'
          : `Turn ${subject} into an unfair competitive moat. Save this framework and deploy these systems with your team this week.`,
        footerText: isEmployeeOs ? 'employeeos.io →' : 'synergy.app →',
        footerBadge,
      };
    } else {
      return {
        id: existingSlide?.id || `slide-${Date.now()}-${slideIndex}`,
        title: `Proof Metric ${slideIndex + 1}`,
        tag: 'Velocity Metric',
        stat: isEmployeeOs ? '4.8h' : '+215%',
        headline: isEmployeeOs
          ? 'Saved Every Single Week per Employee & Manager'
          : `Accelerate Your Operational Velocity`,
        body: isEmployeeOs
          ? '1. Zero manual ticket routing.\n2. Autonomous compliance and audit trails.\n3. Dynamic performance milestones tracked in real time.'
          : `1. Continuous execution without ad-hoc bottlenecks.\n2. Single source of truth across all team initiatives.\n3. Repeatable frameworks that scale seamlessly.`,
        footerText: 'Operational Benchmark',
        footerBadge,
      };
    }
  }

  if (templateId === 'thoughtLeadership') {
    if (slideIndex === 0) {
      return {
        id: existingSlide?.id || `slide-${Date.now()}-${slideIndex}`,
        title: 'The Quote',
        tag: 'Core Principle',
        headline: isEmployeeOs
          ? '"Your team\'s velocity is capped by your operational friction."'
          : `"Consistency in ${subject} isn't discipline. It's architecture."`,
        body: isEmployeeOs
          ? 'High-growth founders don\'t manage people through administrative bureaucracy. They build operating systems that make failure impossible.'
          : `The teams that succeed with ${subject} don't have more willpower. They have systems that remove friction and compound daily.`,
        footerText,
        footerBadge,
      };
    } else {
      return {
        id: existingSlide?.id || `slide-${Date.now()}-${slideIndex}`,
        title: 'The Takeaway',
        tag: 'Execution Model',
        headline: isEmployeeOs
          ? 'From Manual HR Chaos to Autonomous Team Synergy'
          : `Build Compounding Systems That Scale Smoothly`,
        body: isEmployeeOs
          ? 'Automate the fundamentals with EmployeeOS so your people can spend 100% of their energy solving high-leverage strategic problems.'
          : `Standardize your frameworks, templatize your production, and focus only on high-conviction decisions.`,
        footerText: isEmployeeOs ? 'employeeos.io →' : 'Follow for insights →',
        footerBadge,
      };
    }
  }

  // General B2B / Executive Dark / Tech Founder / Minimal Editorial
  if (slideIndex === 0) {
    return {
      id: existingSlide?.id || `slide-${Date.now()}-${slideIndex}`,
      title: 'Hook Slide',
      tag: isEmployeeOs ? 'Workforce Architecture' : 'Executive Brief',
      headline: isEmployeeOs
        ? 'How EmployeeOS Automates Your Entire Team Lifecycle'
        : `The Asymmetric Advantage of ${subject}`,
      body: isEmployeeOs
        ? 'Manual onboarding, scattered spreadsheets, and siloed payroll kill operational velocity. EmployeeOS consolidates workforce orchestration into a unified, autonomous flow.'
        : `Most leaders assume more effort equals higher growth. The real competitive moat is autonomous systemization around ${subject}.`,
      stat: templateId === 'saasPlaybook' || templateId === 'techFounder' ? '+340%' : undefined,
      footerText,
      footerBadge,
    };
  } else if (slideIndex === totalSlides - 1) {
    return {
      id: existingSlide?.id || `slide-${Date.now()}-${slideIndex}`,
      title: 'CTA Slide',
      tag: 'Next Steps',
      headline: isEmployeeOs
        ? 'Deploy EmployeeOS for Your Team Today'
        : `Scale Your ${subject} Operating Flywheel`,
      body: isEmployeeOs
        ? 'Stop fighting administrative friction. Build a high-performance team culture that scales smoothly. Connect your workspace and start in minutes.'
        : `Turn ${subject} into a repeatable growth flywheel. Save this carousel and implement these tactical frameworks with your team today.`,
      stat: undefined,
      footerText: isEmployeeOs ? 'employeeos.io →' : 'synergy.app →',
      footerBadge,
    };
  } else {
    return {
      id: existingSlide?.id || `slide-${Date.now()}-${slideIndex}`,
      title: `Strategic Pillar ${slideIndex + 1}`,
      tag: isEmployeeOs ? 'The 3 Levers' : 'Strategic Pillar',
      headline: isEmployeeOs
        ? 'Eliminating 4.8 Hours of Operational Waste per Week'
        : `The Core Levers Driving High-Velocity ${subject}`,
      body: isEmployeeOs
        ? '1. Zero-Touch Setup: Provision hardware & accounts in 60 seconds.\n2. Continuous Pulse: Dynamic milestones replace slow annual reviews.\n3. Native Compliance: Automated audit trails that scale without overhead.'
        : `1. Architectural Alignment: Build single sources of truth.\n2. Automated Cadence: Replace ad-hoc manual tasks with predictable systems.\n3. Compounding Visibility: Real-time feedback loops that drive clarity.`,
      stat: isEmployeeOs ? '4.8h' : undefined,
      footerText: isEmployeeOs ? 'Operational Benchmark' : 'Execution Framework',
      footerBadge,
    };
  }
}

export function generateFullCarouselCopyFromAi(
  prompt: string,
  templateId: string,
  slideCount: number,
  existingSlides?: InhouseTemplateSlide[]
): InhouseTemplateSlide[] {
  const count = Math.max(2, Math.min(10, slideCount || 3));
  return Array.from({ length: count }, (_, idx) => {
    const existing = existingSlides && existingSlides[idx] ? existingSlides[idx] : undefined;
    return generateAiSlideCopy(prompt, templateId, idx, count, existing);
  });
}


