# Synergy v2
> **AI-Powered Marketing Operations Platform**  
> *A CrossTech Solutions Product*  
> **Tagline:** One workspace. Multiple businesses. Multiple social platforms. An entire AI-powered marketing team.

---

## 1. Overview & Architectural Vision

Synergy is an intelligent, multi-tenant marketing operations and automation platform designed to help businesses, marketing teams, agencies, and founders orchestrate their entire social media presence from a unified executive command center.

Unlike conventional social media schedulers, Synergy operates through a **specialized, modular AI workforce**:
- **Marketing Strategist**: Campaign intelligence, content pillars, audience targeting, and autonomous task delegation.
- **Content Writer**: Branded captions, LinkedIn thought leadership, punchy X threads, and carousel narratives.
- **Visual Designer**: Branded multi-slide carousels, typography templates, and image generation.
- **Quality Assurance Agent**: Grammar validation, Brand Kit voice conformance, dimension verification, and policy protection.

---

## 2. Design System Standard: ONIX Executive Light-Mode

The user interface follows the **ONIX Executive Light-Mode** specification (`master_design.md`):
- **High-Contrast Onyx Palette**: `#1e1e1e` brand base, `#1d4ed8` sapphire focus accents, `#f8f9fa` canvas.
- **Floating Island Architecture**: Floating Sticky Topbar (56px) + Floating Collapsible Sidebar (224px ↔ 64px, 20px curvature) + Independent Scrollable View.
- **Signature Dark-Blue Gradient Hero Cards**: 3-stop gradient (`linear-gradient(135deg, #0b1120 0%, #111827 42%, #172554 100%)`) with radial glow flare and white pill action CTAs.
- **Pure Vector SVG Data Visualizations**: Dual Cubic Bézier trend splines, 180° speedometer quality gauge, 5-step horizontal conversion pipeline funnel, and annular sentiment rings (zero canvas charting dependencies).
- **Spotlight Command Center (`⌘K`)**: Instant search and action modal with backdrop blur.
- **Nested 2-Pane Settings**: 250px sub-navigation sidebar + form canvas with Brand Kit editor.

---

## 3. Technology Stack & Topology

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide icons, Zustand state management.
- **Backend API**: NestJS 10, TypeScript, Prisma ORM, JWT authentication, RBAC & TenantGuard.
- **Persistence**: PostgreSQL 16 (production) / SQLite (zero-config local dev), Redis 7 + BullMQ.
- **Infrastructure**: Docker Compose, Nginx reverse proxy, multi-stage Dockerfiles.

---

## 4. Quick Start

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation & Local Run
```bash
# 1. Install workspace dependencies
npm install

# 2. Synchronize database schema
npx prisma db push --schema=apps/api/prisma/schema.prisma

# 3. Start development servers
# Web app (Port 3000)
npm run dev:web

# API engine (Port 4000)
npm run dev:api
```

---

## 5. Development Phases Tracker

- [x] **Phase 0: Project Initialization** (Monorepo setup, Next.js, NestJS, Prisma, Docker, shared packages)
- [x] **Phase 1: Complete UI/UX Development** (ONIX Executive floating island shell, 14 primary views, pure SVG infographics)
- [x] **Phase 2: Authentication & Multi-Tenancy** (Bcrypt, JWT, multi-business workspaces, Brand Kit, TenantGuard, 100% pass cross-tenant security suite)
- [x] **Phase 3: Modular AI Workforce** (4 MVP personas, provider abstraction: OpenAI/Gemini/Anthropic/Groq/Ollama, model hot-swapping, cost controls, 18/18 tests passed)
- [ ] **Phase 4: Content Studio & Generation** (Multi-slide carousel builder, platform variants)
- [ ] **Phase 5: Social Media API Integrations** (Instagram, LinkedIn, X OAuth)
- [ ] **Phase 6: Content Calendar & Publishing Engine** (BullMQ scheduler, idempotency)
- [ ] **Phase 7: Agentic Orchestration & Autonomous Marketing** (Autonomous cron pipelines)
- [ ] **Phase 8: MVP Analytics** (Snapshot engine, performance metrics)
- [ ] **Phase 9: Production Hardening & VPS Release** (Docker Compose, backup recovery)

---

**CrossTech Solutions — Synergy v2**

