# SYNERGY — DATABASE SCHEMA & TENANCY SPECIFICATION
**A CrossTech Solutions Product**

## 1. Multi-Tenant Relational Schema

The data model uses PostgreSQL (managed via Prisma ORM) with strict tenant scoping.

### Core Tables & Relationships

1. **Identity & Tenancy**:
   - `User`: Global credentials, profile, auth provider.
   - `Organization`: Billing and root tenant container.
   - `Membership`: Maps User to Organization with roles (`SUPER_ADMIN`, `ORG_ADMIN`, `MEMBER`, `VIEWER`).
   - `Business`: Individual business workspace under an Organization.
   - `BusinessMember`: Scoped permissions per business workspace (`BUSINESS_ADMIN`, `MARKETING_MGR`, `CREATOR`, `DESIGNER`, `VIEWER`).

2. **Brand & Content**:
   - `BrandKit`: Visual identity, colors, voice, guidelines, products, website, target audience.
   - `Campaign`: Marketing campaign metadata, goals, date range.
   - `Content`: Core post draft, master copy, objective, status (`IDEA`, `PLANNED`, `GENERATING`, `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `SCHEDULED`, `PUBLISHING`, `PUBLISHED`, `FAILED`, `CANCELLED`).
   - `ContentVariant`: Platform-specific adapted content (Instagram carousel slides, LinkedIn markdown post, X thread).
   - `MediaAsset`: Uploaded images, videos, carousel slide graphics.

3. **AI Workforce**:
   - `AIProvider`: Configured providers (OpenAI, Gemini, Anthropic, OpenRouter, Groq, Ollama, Replicate).
   - `AIPersona`: Persona definitions (Marketing Strategist, Content Writer, Visual Designer, QA Agent).
   - `AIModelAssignment`: Tenant-level provider/model mappings and parameters (temperature, max tokens, spend caps).
   - `AIUsageLog`: Token consumption, estimated cost, tenant billing audit.

4. **Publishing & Social**:
   - `SocialAccount`: Connected accounts (Instagram, LinkedIn, X).
   - `PlatformCredential`: Encrypted OAuth tokens, token expiration, scopes.
   - `ScheduledPost`: Execution time (UTC), idempotency key, target platforms, retry count.
   - `PublishingLog`: API response payloads, platform external post IDs, failure diagnostics.

5. **Automation & Workflows**:
   - `AutomationWorkflow`: Trigger rules, schedules, involved personas, approval modes (`MANUAL`, `CONDITIONAL`, `FULL_AUTO`).
   - `WorkflowExecution`: Execution run status, step-by-step logs, generated content references.
   - `AnalyticsSnapshot`: Platform metrics (impressions, reach, engagement, likes, comments, shares, follower count).

