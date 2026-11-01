# SYNERGY
# MASTER DEVELOPMENT BLUEPRINT & ANTIGRAVITY EXECUTION INSTRUCTIONS

**Parent Company:** CrossTech Solutions  
**Product:** Synergy  
**Document Version:** 2.0  
**Development Environment:** Google Antigravity  
**Development Methodology:** Strict Sequential, Phase-Gated Development  
**Initial Release:** MVP  
**Architecture:** Multi-tenant SaaS + Modular AI Workforce + Autonomous Background Automation

---

# 1. PROJECT OVERVIEW

## 1.1 Product Definition

Synergy is an AI-powered, multi-tenant marketing operations platform developed by CrossTech Solutions.

It enables organizations to manage multiple businesses, social media accounts, marketing teams, AI personas, content production, scheduling, publishing and analytics from one unified application.

Synergy is not intended to be another conventional social media scheduler.

Its long-term objective is to provide businesses with an autonomous AI marketing workforce capable of planning, creating, designing, validating, publishing and analyzing marketing content.

## 1.2 Product Vision

A business owner should be able to:

1. Create an organization.
2. Add multiple businesses.
3. Connect social media accounts.
4. Invite employees.
5. Assign business-specific responsibilities.
6. Configure AI personas.
7. Configure marketing objectives.
8. Generate content automatically.
9. Schedule and publish content.
10. Monitor performance.
11. Allow AI agents to improve future marketing strategies.

Once configured, Synergy should operate continuously on a VPS or cloud infrastructure without requiring an open browser or manual execution of individual tasks.

## 1.3 Product Principles

These principles are mandatory:

- Multi-tenancy from the beginning.
- Sequential development with verification gates.
- Modular architecture.
- Provider-independent AI integration.
- Specialized AI personas.
- Persistent background processing.
- Official social media APIs.
- Secure credential storage.
- Autonomous publishing with configurable policies.
- Extensible platform integrations.
- Production-quality UI and backend.

---

# 2. DEVELOPMENT STRATEGY

## 2.1 Strict Sequential Execution

Development MUST follow the approved phase order.

The agent must not begin the next phase until the current phase has passed its completion criteria.

The development process is:

1. Analyze the phase requirements.
2. Inspect the existing codebase.
3. Prepare an implementation checklist.
4. Implement the features.
5. Run automated tests.
6. Run manual functional tests.
7. Fix discovered problems.
8. Update documentation.
9. Prepare a phase completion report.
10. Stop and wait for human approval.

Only after approval can the next phase begin.

### Important

The agent must not interpret completion as simply generating the required code.

A phase is complete only when its functionality has been implemented and verified.

## 2.2 MVP Scope

The first release will contain:

| Category | MVP scope |
|---|---|
| Business management | Multiple businesses |
| Organization | Multi-tenant architecture |
| Team | Invitations and basic RBAC |
| Social platforms | Instagram, LinkedIn, X |
| AI personas | Four core personas |
| Content | Text, images, carousels |
| AI writing | Supported |
| AI image generation | Supported through external provider |
| Scheduling | Supported |
| Publishing | Automated where platform APIs permit |
| Analytics | Basic platform analytics |
| Automation | Persistent background workflows |
| Deployment | Docker-based VPS deployment |

## 2.3 Deferred Features

Do not implement these in the initial MVP unless a dependency requires a minimal foundation:

- Video generation.
- TikTok integration.
- YouTube integration.
- Advanced Threads integration.
- Advanced competitor intelligence.
- Advanced audience forecasting.
- White-label agency functionality.
- Advanced social inbox.
- Complex billing and subscription management.
- All ten AI personas.
- Advanced campaign attribution.

The architecture must support these features later without requiring a complete rewrite.

---

# 3. TECHNOLOGY STACK

Use the following stack.

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Lucide icons

## Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- REST API

## Background processing

- Redis
- BullMQ
- Dedicated scheduler and worker processes

## AI

- OpenAI
- Google Gemini
- Anthropic
- OpenRouter
- Groq
- Ollama
- Replicate or another compatible image generation provider

Provider support should be implemented through modular adapters.

## Infrastructure

- Docker
- Docker Compose
- Nginx
- VPS or cloud hosting
- S3-compatible object storage
- PostgreSQL
- Redis

## Authentication

Use Clerk or Supabase Auth.

The selected authentication solution must integrate with organization membership and application-level authorization.

---

# 4. PROJECT STRUCTURE

Use a maintainable monorepo structure.

```text
synergy/
│
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── lib/
│   │   └── types/
│   │
│   ├── api/
│   │   └── src/
│   │       ├── modules/
│   │       ├── common/
│   │       ├── config/
│   │       └── main.ts
│   │
│   └── worker/
│       └── src/
│
├── packages/
│   ├── shared/
│   ├── types/
│   ├── validation/
│   └── ai-contracts/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   └── scripts/
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   ├── development-log.md
│   ├── phase-status.md
│   ├── environment-setup.md
│   ├── known-issues.md
│   └── decisions.md
│
├── docker-compose.yml
├── .env.example
└── README.md
```

The agent may adjust this structure when necessary but must document architectural changes.

---

# 5. PHASED DEVELOPMENT PLAN

# PHASE 0 – PROJECT INITIALIZATION

**Objective:** Establish a stable development environment.

### Tasks

1. Initialize the repository.
2. Set up the monorepo.
3. Initialize Next.js.
4. Initialize NestJS.
5. Configure TypeScript.
6. Configure ESLint and Prettier.
7. Configure PostgreSQL.
8. Configure Prisma.
9. Configure Redis.
10. Configure Docker Compose.
11. Establish environment variables.
12. Establish API conventions.
13. Establish error-handling conventions.
14. Create initial documentation.

### Testing

- Frontend starts successfully.
- Backend starts successfully.
- Database connection works.
- Redis connection works.
- Prisma migrations work.
- Docker containers start correctly.

### Deliverables

- Working repository.
- Application foundation.
- Environment setup documentation.
- Architecture documentation.

### Exit Gate

Do not proceed until the entire development environment is functional.

---

# PHASE 1 – COMPLETE UI/UX DEVELOPMENT

**Objective:** Build the complete MVP user interface.

At this stage, use isolated mock data where necessary. Keep the architecture ready for backend integration.

## 1.1 Design System

Develop a consistent design system.

Requirements:

- Professional SaaS appearance.
- Clean layouts.
- Consistent typography.
- Centralized color tokens.
- Reusable buttons.
- Reusable inputs.
- Dropdowns.
- Dialogs.
- Modals.
- Tables.
- Cards.
- Charts.
- Toast notifications.
- Loading states.
- Empty states.
- Error states.
- Dark and light themes.

Avoid excessive gradients, unnecessary shadows and generic dashboard styling.

## 1.2 Navigation

Implement the following sidebar:

```text
SYNERGY
CrossTech Solutions

[Business Switcher]

WORKSPACE
  Dashboard
  Content Studio
  Content Calendar
  Campaigns

INTELLIGENCE
  AI Workforce
  Analytics

AUTOMATION
  Workflows
  Execution History

MANAGEMENT
  Team & Roles
  Integrations
  Media Library

SYSTEM
  Settings
  Billing & Usage

[User Profile]
```

Social Inbox and advanced marketing intelligence can be shown as future capabilities, but must not be represented as fully functional MVP features.

## 1.3 Dashboard

Implement:

- Total published posts.
- Scheduled posts.
- Total impressions.
- Engagement.
- Follower growth.
- Platform performance.
- Upcoming posts.
- AI activity.
- Recent activity.
- Automation health.

## 1.4 Business Management

Implement:

- Business listing.
- Create business modal.
- Business profile.
- Business switching.
- Brand Kit interface.
- Business settings.

## 1.5 Content Studio

Create interfaces for:

- Text posts.
- Image posts.
- Carousels.
- Caption generation.
- Image generation.
- Platform selection.
- Content preview.
- Draft management.

## 1.6 Content Calendar

Create:

- Daily view.
- Weekly view.
- Monthly view.
- Scheduled content cards.
- Drag-and-drop scheduling interface.

## 1.7 AI Workforce

Display all four MVP personas:

1. Marketing Strategist.
2. Content Writer.
3. Visual Designer.
4. Quality Assurance Agent.

Provide configuration screens for each.

The other six personas should be part of the future architecture roadmap, not fake operational features.

## 1.8 Integrations

Create platform cards for:

- Instagram.
- LinkedIn.
- X.

Include connection status and account management interfaces.

## 1.9 Team Management

Create:

- Team listing.
- Invitations.
- Role assignment.
- Permission management.

## 1.10 Settings

Create:

- Organization settings.
- Business settings.
- AI configuration.
- Profile settings.
- Security settings.
- Notification preferences.

### Testing

Verify all navigation, interactions, modals, responsive layouts and UI states.

### Deliverables

Complete MVP frontend with reusable components and isolated mock data.

### Exit Gate

All MVP pages must be visually and functionally verified before backend integration begins.

---

# PHASE 2 – AUTHENTICATION AND MULTI-TENANCY

**Objective:** Implement the actual backend and multi-business architecture.

## 2.1 Authentication

Implement:

- Registration.
- Login.
- Logout.
- Password recovery.
- Session management.
- Protected routes.
- User profile.

## 2.2 Organization Management

Implement:

- Organization creation.
- Organization profile.
- Organization membership.
- Organization invitations.
- Organization owner.
- Organization-level authorization.

## 2.3 Business Management

Implement:

- Create business.
- Update business.
- Delete business.
- Business switching.
- Business settings.
- Business-specific Brand Kit.

## 2.4 Roles

Initial roles:

- Super Admin.
- Organization Admin.
- Business Admin.
- Marketing Manager.
- Content Creator.
- Designer.
- Viewer.

Use permission-based authorization.

## 2.5 Database Entities

Implement:

- Users.
- Organizations.
- Memberships.
- Businesses.
- BusinessMembers.
- Invitations.
- BrandKits.
- AuditLogs.

## 2.6 Tenant Isolation

Every business-specific record must have an explicit tenant ownership strategy.

All backend operations must validate the authenticated user's membership and permissions.

Implement automated cross-tenant access tests.

### Testing

- Authentication works.
- Organization creation works.
- Multiple businesses work.
- Business switching works.
- Employee invitations work.
- Permissions are enforced.
- Cross-tenant data access is blocked.

### Exit Gate

The multi-tenant architecture must pass authorization and persistence tests.

---

# PHASE 3 – MODULAR AI WORKFORCE

**Objective:** Implement the four core MVP AI personas and provider configuration.

## 3.1 Core AI Architecture

Separate:

- Persona.
- Provider.
- Model.
- Configuration.
- Execution.

A persona must be able to change providers without rewriting its business logic.

## 3.2 MVP Personas

### Persona 1: Marketing Strategist

Responsibilities:

- Understand business objectives.
- Analyze the Brand Kit.
- Develop marketing strategies.
- Create content plans.
- Determine content categories.
- Assign tasks to other personas.
- Recommend marketing improvements.

Use a capable reasoning model.

### Persona 2: Content Writer

Responsibilities:

- Generate captions.
- Generate LinkedIn posts.
- Generate X posts.
- Create hashtags.
- Write advertising copy.
- Generate carousel slide content.
- Adapt tone according to business identity.

Use a fast and cost-effective language model.

### Persona 3: Visual Designer

Responsibilities:

- Generate images.
- Design carousel slides.
- Create promotional graphics.
- Maintain brand consistency.
- Apply logos and brand colors.
- Generate visual variations.

Use an image-generation provider.

### Persona 4: Quality Assurance Agent

Responsibilities:

- Check grammar.
- Check brand consistency.
- Detect duplicate content.
- Validate content structure.
- Validate platform constraints.
- Identify unsupported claims.
- Validate visual assets.

## 3.3 Provider Architecture

Create a provider abstraction.

Example:

```typescript
interface AIProvider {
  testConnection(): Promise<boolean>;

  generateText(
    input: TextGenerationInput
  ): Promise<TextGenerationResult>;

  generateStructuredOutput(
    input: StructuredGenerationInput
  ): Promise<StructuredGenerationResult>;
}
```

Use separate capability contracts for image generation.

Do not assume every provider supports text, images and video.

## 3.4 Provider Configuration

Support:

- OpenAI.
- Gemini.
- Anthropic.
- OpenRouter.
- Groq.
- Ollama.
- Compatible image-generation services.

The architecture should allow new providers to be added independently.

## 3.5 Persona Configuration UI

Every persona should have:

- Name.
- Description.
- Responsibilities.
- Provider selection.
- Model selection.
- API key configuration.
- System instructions.
- Model parameters.
- Usage limits.
- Business assignment.
- Enable/disable control.
- Test connection.

## 3.6 API Key Management

- Encrypt credentials at rest.
- Never expose keys in frontend responses.
- Mask saved keys.
- Support credential rotation.
- Restrict access.
- Audit credential changes.
- Never log secrets.

## 3.7 Usage Tracking

Track:

- Tokens consumed.
- API requests.
- Image generation requests.
- Estimated cost.
- Persona-level usage.
- Business-level usage.

### Testing

Test each persona independently.

Test provider connection failures.

Test model switching.

Test credential security.

Test structured output validation.

### Exit Gate

All four personas must execute successfully through the configured provider layer.

---

# PHASE 4 – CONTENT STUDIO AND CONTENT GENERATION

**Objective:** Build the complete MVP content production workflow.

## 4.1 Content Types

Support:

- Text posts.
- Single-image posts.
- Multi-image posts.
- Carousel posts.

## 4.2 Content Workflow

Implement:

1. User selects a business.
2. User selects the target platform.
3. User provides a content objective.
4. Strategist creates a concept.
5. Writer generates content.
6. Designer generates visual assets.
7. QA validates the output.
8. Content is saved as a draft.

## 4.3 Carousel Builder

Implement:

- Multiple slides.
- Slide creation.
- Slide deletion.
- Slide duplication.
- Slide ordering.
- Text editing.
- Image replacement.
- Logo placement.
- Brand colors.
- Typography.
- Preview.
- Export.

Platform-specific dimensions and content requirements must be respected.

## 4.4 Platform-Specific Variants

A single marketing idea should be adapted separately for Instagram, LinkedIn and X.

Do not simply copy the same content to all platforms.

For example:

One marketing concept:

"Five ways AI improves small business productivity."

Generate:

- Instagram: Seven-slide visual carousel.
- LinkedIn: Professional educational post.
- X: Concise thread.

Store each platform variant independently.

## 4.5 Brand Kit

Every generation request must use the selected business's Brand Kit.

Fields:

- Logo.
- Colors.
- Typography.
- Brand voice.
- Target audience.
- Business description.
- Products and services.
- Website.
- Content restrictions.

## 4.6 Media Library

Implement:

- Upload.
- Preview.
- Search.
- Filtering.
- Business-level ownership.
- Delete.
- Metadata.
- File validation.

Use S3-compatible object storage.

### Testing

Generate real content using configured AI providers.

Test carousel editing and export.

Verify media persistence.

Verify platform variants.

### Exit Gate

The complete content creation workflow must work without mock AI responses.

---

# PHASE 5 – SOCIAL MEDIA API INTEGRATIONS

**Objective:** Connect real Instagram, LinkedIn and X accounts.

## 5.1 Platform Adapters

Implement separate adapters for:

- Instagram.
- LinkedIn.
- X.

Each adapter must expose the capabilities actually supported by the platform.

Example:

```typescript
interface SocialPlatformAdapter {
  connect(): Promise<ConnectionResult>;

  getAccount(): Promise<AccountInfo>;

  publishPost(
    post: PlatformPost
  ): Promise<PublishResult>;

  getPostStatus(
    postId: string
  ): Promise<PostStatus>;
}
```

Extend through capability-specific interfaces for media uploads, analytics and other operations.

## 5.2 OAuth

Implement:

- Authorization.
- Callback handling.
- State validation.
- Token exchange.
- Token refresh where supported.
- Expiration detection.
- Reconnection.
- Account disconnection.

## 5.3 Platform Management

Display:

- Platform.
- Account name.
- Account ID.
- Connection status.
- Permissions.
- Last synchronization.
- Token validity.

Each connected account must belong to a specific business.

## 5.4 Platform Compatibility

Before publishing, validate:

- Account eligibility.
- Content type.
- Media type.
- Dimensions.
- Caption length.
- Required permissions.
- Platform restrictions.

Use official APIs only.

Do not use browser automation to bypass missing API permissions.

Document required developer applications, review requirements and API costs.

### Testing

Use test accounts and real authorized accounts where available.

Verify OAuth.

Verify token storage.

Verify account ownership.

Verify supported publishing operations.

### Exit Gate

Each of the three platform integrations must be independently verified.

If external API approval is unavailable, document the blocker and complete the integration adapter using a clearly separated test environment. Never claim live publishing works until verified.

---

# PHASE 6 – CONTENT CALENDAR AND PUBLISHING ENGINE

**Objective:** Implement reliable scheduled publishing.

## 6.1 Content Calendar

Implement:

- Daily view.
- Weekly view.
- Monthly view.
- Scheduled posts.
- Drafts.
- Published posts.
- Failed posts.
- Drag-and-drop rescheduling.

## 6.2 Post Statuses

```text
IDEA
PLANNED
GENERATING
DRAFT
PENDING_APPROVAL
APPROVED
SCHEDULED
PUBLISHING
PUBLISHED
FAILED
CANCELLED
```

Implement valid status transitions.

## 6.3 Publishing Worker

Implement a dedicated background worker using BullMQ.

Workflow:

1. Identify due posts.
2. Acquire an execution lock.
3. Verify authorization.
4. Verify account connectivity.
5. Validate content.
6. Upload media.
7. Publish through the relevant platform adapter.
8. Save external post ID.
9. Record publishing result.
10. Update status.

## 6.4 Reliability

Implement:

- Persistent jobs.
- Idempotency.
- Duplicate prevention.
- Exponential backoff.
- Retry limits.
- Failed-job management.
- Execution logs.
- Missed-job recovery.

Do not blindly retry an operation if the platform may already have published the post. Reconcile the publishing state first.

## 6.5 Scheduling

Store timestamps in UTC.

Store business time zones separately.

Display schedules in the appropriate business time zone.

### Testing

Test immediate publishing.

Test scheduled publishing.

Test worker restart.

Test duplicate prevention.

Test token expiration.

Test API failures.

### Exit Gate

A post must publish at its scheduled time without requiring the frontend to remain open.

---

# PHASE 7 – AGENTIC ORCHESTRATION AND AUTONOMOUS MARKETING

**Objective:** Connect the personas into a complete autonomous marketing workflow.

This phase turns Synergy into an agentic system.

## 7.1 Central Orchestrator

Build an AI Orchestrator responsible for:

- Receiving objectives.
- Understanding task requirements.
- Selecting personas.
- Delegating tasks.
- Passing structured context.
- Tracking task status.
- Handling failures.
- Validating outputs.
- Managing execution.
- Recording workflow history.

The orchestrator must not generate every asset itself.

## 7.2 Agent Communication

Use structured task messages.

Every task must contain:

- Task ID.
- Organization ID.
- Business ID.
- Workflow ID.
- Persona ID.
- Input.
- Expected output schema.
- Status.
- Retry count.
- Execution time.
- Usage.
- Error information.

Do not rely exclusively on conversational memory for agent coordination.

## 7.3 MVP Autonomous Workflow

Example objective:

"Prepare and publish next week's marketing content for my clothing brand."

Execution:

```text
Marketing Objective
        |
        v
   Orchestrator
        |
        v
 Marketing Strategist
        |
        v
    Content Plan
        |
        v
    Content Writer
        |
        v
    Visual Designer
        |
        v
  Quality Assurance
        |
        v
 Approval Policy
        |
        v
 Publishing Queue
        |
        v
 Publishing Worker
        |
        v
  Published Content
        |
        v
 Analytics Collection
```

## 7.4 Workflow Configuration

Allow administrators to define:

- Business.
- Platforms.
- Content frequency.
- Content categories.
- Publishing schedule.
- Assigned personas.
- Monthly AI spending limit.
- Approval policy.
- Active/inactive status.

## 7.5 Automation Triggers

Support:

- Scheduled triggers.
- Manual triggers.
- Event-based triggers.

Examples:

- Every Sunday at 10 AM.
- When a campaign starts.
- When a content plan is requested.

## 7.6 Approval Modes

**Manual:** All content requires approval.

**Conditional:** Content passing predefined validation rules can publish automatically.

**Full Auto:** Approved categories of content can publish without human review.

Sensitive or uncertain content must be escalated according to business rules.

## 7.7 Autonomous Reliability

Implement:

- Persistent workflow state.
- Worker recovery.
- Task retries.
- Budget limits.
- Execution timeouts.
- Maximum generation attempts.
- Emergency shutdown.
- Audit history.

The orchestrator must be separate from the deterministic publishing worker.

AI determines the intended action. Backend services enforce authorization and execute it.

### Testing

Run a complete autonomous marketing workflow.

Test multiple personas.

Test task failures.

Test worker restarts.

Test budget limits.

Test approval restrictions.

Test execution history.

### Exit Gate

The system must complete the configured workflow from objective to publishing without manual triggering of each intermediate step.

---

# PHASE 8 – MVP ANALYTICS

**Objective:** Provide meaningful marketing performance information.

## 8.1 Metrics

Implement metrics supported by each connected platform:

- Published posts.
- Impressions.
- Reach.
- Engagement.
- Likes.
- Comments.
- Shares.
- Follower growth.
- Available clicks.

Do not assume every platform exposes identical metrics.

Distinguish zero values from unavailable metrics.

## 8.2 Analytics Synchronization

Create background synchronization jobs.

Store:

- Platform account.
- External post ID.
- Metric.
- Value.
- Collection time.
- Metric source.

Use snapshots to preserve historical trends.

## 8.3 Dashboard

Implement:

- Overall performance.
- Platform comparison.
- Top-performing posts.
- Recent publishing activity.
- Engagement trends.
- Follower growth.

## 8.4 Analytics Agent

Use the Analytics Agent as a later extension of the MVP.

It should eventually:

- Analyze top-performing posts.
- Identify trends.
- Recommend content categories.
- Recommend publishing times.
- Feed performance insights into the Strategist.

For the initial MVP, focus on reliable data collection and basic reports.

### Testing

Verify metric retrieval.

Verify historical storage.

Verify business-level isolation.

Verify dashboard calculations.

### Exit Gate

All displayed analytics must be traceable to actual platform data or explicitly identified as unavailable.

---

# PHASE 9 – TEAM COLLABORATION AND MVP COMPLETION

**Objective:** Complete team workflows and prepare the MVP for production.

## 9.1 Team Management

Implement:

- Employee invitations.
- Membership management.
- Role assignment.
- Business-specific permissions.
- Task assignment.
- Notifications.

## 9.2 Content Approval

Implement:

- Submit for approval.
- Approve.
- Reject.
- Request changes.
- Approval history.

## 9.3 Execution History

Display:

- Workflow executions.
- AI task executions.
- Publishing attempts.
- Errors.
- Retry history.
- Final results.

## 9.4 Production Deployment

Implement:

- Docker production configuration.
- Nginx.
- HTTPS.
- Environment separation.
- Persistent storage.
- Automatic restart.
- Database backup.
- Redis queue recovery.
- Health checks.

## 9.5 Security

Test:

- Tenant isolation.
- RBAC.
- OAuth security.
- Credential encryption.
- Rate limiting.
- Input validation.
- Audit logs.
- Secret exposure.
- Backup restoration.

## 9.6 Reliability

Test:

- VPS restart.
- Worker crash.
- Redis interruption.
- Database interruption.
- Expired access token.
- AI provider outage.
- Social API rate limiting.
- Failed media upload.
- Duplicate publishing prevention.

### Final MVP Acceptance Criteria

Synergy is considered MVP-ready only when:

1. Users can register and log in.
2. Organizations can manage multiple businesses.
3. Business switching works.
4. Team permissions work.
5. Social accounts can be connected through supported OAuth flows.
6. Four AI personas work.
7. Content generation works.
8. Carousel creation works.
9. Platform-specific variants work.
10. Posts can be scheduled.
11. Background publishing works.
12. Automation workflows work.
13. Dashboard metrics are grounded in actual data.
14. VPS deployment works.
15. Critical security and reliability tests pass.

---

# 6. POST-MVP ROADMAP

Do not include these in the MVP development scope.

They are future development phases.

## FUTURE PHASE 10 – COMPLETE AI WORKFORCE

Add six additional personas:

5. Market Research Analyst.
6. Platform Specialist.
7. Publishing Agent.
8. Community Manager.
9. Analytics and Optimization Agent.
10. Video Creator.

Improve agent collaboration, delegation and task planning.

## FUTURE PHASE 11 – SOCIAL INBOX

Add:

- Unified comments.
- Mentions.
- Direct messages where supported.
- AI response suggestions.
- Conversation assignment.
- Sentiment classification.
- Customer complaint detection.
- Lead identification.

## FUTURE PHASE 12 – ADVANCED SOCIAL INTEGRATIONS

Add:

- Facebook.
- Threads.
- TikTok.
- YouTube.

Each platform must use its official supported API capabilities.

## FUTURE PHASE 13 – ADVANCED MARKETING INTELLIGENCE

Add:

- Competitor intelligence.
- Industry trend research.
- Keyword research.
- Advanced campaign optimization.
- Content performance forecasting.
- Audience intelligence.
- Marketing report generation.
- Advanced content repurposing.

## FUTURE PHASE 14 – SAAS COMMERCIALIZATION

Add:

- Subscription plans.
- Usage-based billing.
- Payment gateway.
- Organization quotas.
- White-label agency mode.
- Enterprise administration.
- Advanced audit capabilities.

---

# 7. GLOBAL INSTRUCTIONS FOR ANTIGRAVITY

These rules apply to every phase.

## Rule 1 – Strict Sequential Development

Never begin a subsequent phase without approval of the previous phase.

## Rule 2 – No Fake Functionality

Do not create fake publishing, fake analytics, simulated API responses or buttons that only display success messages.

Mock data is allowed only during the designated UI development phase and isolated testing.

## Rule 3 – Inspect Before Modifying

Before modifying an existing implementation:

- Inspect the relevant files.
- Understand dependencies.
- Identify side effects.
- Preserve working functionality.
- Add regression tests.

## Rule 4 – Maintain Architecture

Use reusable modules.

Avoid unnecessary duplication.

Do not introduce microservices without a documented reason.

## Rule 5 – Security

Never expose credentials.

Never trust frontend-supplied business identifiers.

Never bypass platform permissions.

Never allow one tenant to access another tenant's data.

## Rule 6 – Background Processing

Long-running operations must use persistent background jobs.

Do not depend on browser sessions.

## Rule 7 – Structured Agent Communication

Use explicit task schemas, workflow IDs, status tracking and validated outputs.

## Rule 8 – Cost Management

All AI requests must be measurable.

Enforce configured spending limits.

Prevent unlimited retries.

## Rule 9 – Documentation

Update documentation after each architectural or functional change.

## Rule 10 – Honest Completion Reports

Report actual implementation status.

Clearly identify:

- Completed features.
- Partially completed features.
- Blocked features.
- Unverified integrations.
- Known bugs.

Never claim success without verification.

---

# 8. PHASE TRACKING SYSTEM

Maintain `docs/phase-status.md`.

Initial status:

```text
PHASE 0  - NOT STARTED
PHASE 1  - NOT STARTED
PHASE 2  - NOT STARTED
PHASE 3  - NOT STARTED
PHASE 4  - NOT STARTED
PHASE 5  - NOT STARTED
PHASE 6  - NOT STARTED
PHASE 7  - NOT STARTED
PHASE 8  - NOT STARTED
PHASE 9  - NOT STARTED

POST-MVP:
PHASE 10 - NOT STARTED
PHASE 11 - NOT STARTED
PHASE 12 - NOT STARTED
PHASE 13 - NOT STARTED
PHASE 14 - NOT STARTED
```

Allowed statuses:

- NOT STARTED
- IN PROGRESS
- BLOCKED
- UNDER REVIEW
- COMPLETED

Only mark a phase COMPLETED after its acceptance criteria pass and the human owner approves it.

---

# 9. MANDATORY PHASE COMPLETION REPORT

At the end of every phase, produce the following report:

```text
SYNERGY – PHASE COMPLETION REPORT

Phase:
Phase Name:

1. Features Implemented
2. Files Created
3. Files Modified
4. Database Changes
5. API Endpoints Added
6. Dependencies Added
7. Tests Executed
8. Test Results
9. Known Issues
10. External Dependencies
11. Security Considerations
12. Documentation Updated
13. Acceptance Criteria Results

Overall Status:
COMPLETED / BLOCKED / UNDER REVIEW

Next Phase:
Not Started – Awaiting Human Approval
```

The agent must stop after presenting the report.

It must not automatically continue to the next phase.

---

# 10. INITIAL EXECUTION INSTRUCTIONS

When this document is supplied to Antigravity:

### Step 1

Read and understand the entire specification.

### Step 2

Inspect the existing repository and development environment.

Do not overwrite existing working code without understanding it.

### Step 3

Identify missing information, external dependencies and potential architectural conflicts.

### Step 4

Create a technical implementation checklist for Phase 0.

### Step 5

Initialize the project foundation.

### Step 6

Test Phase 0 against its completion criteria.

### Step 7

Update the documentation and prepare the Phase 0 completion report.

### Step 8

STOP and wait for human approval.

Do not start Phase 1 until approval is received.

Repeat the same process for all subsequent phases.

If a requirement is blocked by API permissions, missing credentials, provider restrictions or unavailable services, document the issue and request the necessary input.

Do not invent credentials or silently replace required features with simulated functionality.

---

# 11. FINAL PRODUCT DEFINITION

At completion, Synergy should be an autonomous marketing operations platform capable of managing multiple businesses, multiple social platforms, human marketing teams and specialized AI personas through one centralized application.

A business owner should be able to connect their accounts, configure their brand identity, assign AI responsibilities, establish marketing objectives and activate autonomous workflows.

Synergy should then continuously plan, create, validate, schedule, publish and analyze marketing content within the configured permissions, policies and spending limits.

The platform must remain operational independently on production infrastructure.

**SYNERGY**

**Your Entire Marketing Team. One Intelligent Workspace.**

**A CrossTech Solutions Product.**