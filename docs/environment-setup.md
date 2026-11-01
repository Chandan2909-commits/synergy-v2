# SYNERGY — ENVIRONMENT SETUP & ONBOARDING GUIDE
**A CrossTech Solutions Product**

## Prerequisites
- Node.js >= 20.0.0 (Tested on Node v24.14.0)
- npm >= 10.0.0 (Tested on npm 11.5.2)
- Docker & Docker Compose (Optional for containerized PostgreSQL & Redis)

## Quick Start (Monorepo)

1. Clone or navigate to the workspace:
   ```bash
   cd s:\work\synergy
   ```

2. Copy environment template:
   ```bash
   cp .env.example .env
   ```

3. Install all workspace dependencies:
   ```bash
   npm install
   ```

4. Run development servers:
   ```bash
   # Start frontend (port 3000) and API (port 4000)
   npm run dev
   ```

5. Production Docker Deployment:
   ```bash
   docker-compose up -d --build
   ```

