# SYNERGY — API CONVENTIONS & CONTRACT SPECIFICATION
**A CrossTech Solutions Product**

## 1. REST API Standards

- Base URL: `/api/v1`
- Content Type: `application/json`
- Authentication: `Bearer <JWT_TOKEN>` header
- Tenant Context: `X-Business-ID: <uuid>` and `X-Organization-ID: <uuid>` headers verified against authenticated JWT session.

## 2. Standard Response Envelope

All API responses follow the standard response envelope:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-11-01T20:30:00Z",
    "requestId": "req_abc123"
  }
}
```

Error response envelope:

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested business workspace does not exist or access is forbidden.",
    "details": []
  },
  "meta": {
    "timestamp": "2026-11-01T20:30:00Z"
  }
}
```

## 3. Core Resource Endpoints

- `POST /api/v1/auth/register` — Register account
- `POST /api/v1/auth/login` — Sign in and issue token
- `GET  /api/v1/auth/me` — Authenticated profile & memberships
- `GET  /api/v1/organizations` — List user organizations
- `GET  /api/v1/businesses` — List businesses under selected org
- `POST /api/v1/businesses` — Create new business workspace
- `GET  /api/v1/businesses/:id/brand-kit` — Retrieve Brand Kit
- `PUT  /api/v1/businesses/:id/brand-kit` — Update Brand Kit
- `GET  /api/v1/content` — List content items (drafts, scheduled, published)
- `POST /api/v1/content/generate` — Orchestrate AI content generation
- `POST /api/v1/content/:id/schedule` — Queue post for scheduling
- `GET  /api/v1/ai/personas` — List configured AI personas
- `POST /api/v1/ai/personas/:id/configure` — Update model assignment & parameters
- `POST /api/v1/ai/personas/:id/test` — Test provider connection
- `GET  /api/v1/social/accounts` — List connected social accounts
- `POST /api/v1/social/connect/:platform` — Start OAuth handshake
- `GET  /api/v1/analytics/overview` — Aggregated KPI metrics & snapshot trends
- `GET  /api/v1/automation/workflows` — Autonomous marketing workflows
- `POST /api/v1/automation/workflows/trigger` — Trigger workflow execution

