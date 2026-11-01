# SYNERGY — ARCHITECTURAL DECISIONS RECORD (ADR)
**A CrossTech Solutions Product**

## ADR-001: Monorepo Orchestration with npm Workspaces
- **Context:** Synergy comprises a Next.js frontend, a NestJS backend API, a background worker, and shared type/validation libraries.
- **Decision:** Utilize native npm workspaces with root package orchestration to minimize tooling overhead and avoid fragile external monorepo dependencies.
- **Status:** Approved.

## ADR-002: UI Architecture Strictly Cloned from OutreachOS ONIX Executive (master_design.md)
- **Context:** The design requirement specifies following `master_design.md` by heart.
- **Decision:** Implement the ONIX Premium Executive light-mode palette, floating island layout (sticky topbar + floating sidebar + independent main canvas), signature dark-blue gradient hero cards, full pill buttons with active press physics (scale 0.95), 2-pane nested settings, spotlight command center (`⌘K`), and pure vector SVG charts (dual Bézier trend splines, 180° speedometer dial, horizontal conversion funnel, annular donut ring).
- **Status:** Approved.

## ADR-003: Provider-Agnostic Modular AI Workforce
- **Context:** Synergy operates 4 core MVP personas (Marketing Strategist, Content Writer, Visual Designer, QA Agent).
- **Decision:** Separate Persona role from Provider (OpenAI, Gemini, Anthropic, Groq, OpenRouter) and Model identifier. Each persona can be mapped to different providers with usage tracking and budget limits.
- **Status:** Approved.

## ADR-004: Multi-Tenant Hierarchy
- **Context:** Multi-tenancy is required from Day 1.
- **Decision:** Strict 5-tier entity hierarchy: `User` -> `Organization` -> `Business Workspace` -> `Social Accounts` -> `Content & Campaigns`.
- **Status:** Approved.

