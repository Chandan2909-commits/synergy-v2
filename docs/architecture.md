# SYNERGY — SYSTEM ARCHITECTURE SPECIFICATION
**A CrossTech Solutions Product**

## 1. High-Level System Topology

Synergy is engineered as a modular, event-driven, multi-tenant marketing operations platform. It adheres strictly to the separation of tenants, AI personas, deterministic publishing engines, and front-end executive experiences.

```text
                  SYNERGY CLIENT APPLICATION
                              |
               Next.js App Router (Port 3000)
               [ONIX Executive Design System]
                              |
                     REST API / WebSocket
                              |
                   NestJS API Engine (Port 4000)
                              |
         +--------------------+--------------------+
         |                    |                    |
    Auth & RBAC          Multi-Tenant          AI Service
  (Session / JWT)      Workspace Service     Provider Router
         |                    |                    |
         |                PostgreSQL        +------+------+
         |              (Prisma ORM)        |      |      |
         |                                OpenAI Gemini Groq
         +--------------------+--------------------+
                              |
                     Automation Engine
                              |
                        Redis + BullMQ
                              |
                 Background Worker Services
               (Scheduled Jobs / Idempotency)
                              |
                 +------------+------------+
                 |            |            |
             Scheduler    Publisher    Analytics
                 |            |            |
                 +------------+------------+
                              |
                     Social Platform APIs
                 Instagram / LinkedIn / X
```

## 2. Core Architectural Principles

1. **Multi-Tenancy by Design**:
   - `User` -> `Organization` -> `Business Workspace` -> `Social Accounts` -> `Content & Campaigns`.
   - Every database query strictly filters by tenant context (`organizationId`, `businessId`).

2. **Decoupled AI Engine**:
   - Persona (role/objective) is separated from Provider (vendor) and Model (specific LLM/Vision engine).
   - Changing models never requires alterations to core business or workflow logic.

3. **Deterministic Publishing Engine**:
   - Non-generative, rock-solid BullMQ queue workers.
   - Enforces unique idempotency keys, exponential backoff, and strict platform compliance.

4. **Pure Vector Data Visualizations (No bloated chart libraries)**:
   - All charts follow `master_design.md` pure SVG cubic Bézier curves, 180° speedometer dials, annular sentiment donuts, and horizontal conversion funnels.

