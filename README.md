# AI Construction Demos

Bootstraps a modular Construction Automation Demo Portal on top of the existing React/Vite/MUI/Zustand starter. Each module simulates a real construction business workflow — connected via shared Zustand state so actions in one module (e.g. creating a job) flow through downstream modules (bidding, projects, contracts).

Architecture

constructionStore.ts — Single Zustand store typed across all 9 domains; async actions use setTimeout to simulate AI/backend latency
constructionMockData.ts — Seed data for 3 jobs, 3 bids, 2 projects (with phases + tasks), 6 materials, 4 workers, payroll, 2 contracts
ConstructionLayout.tsx — Replaces AppShell for /construction/*; 240px permanent sidebar on desktop, temporary drawer on mobile, dark mode toggle in appbar
AppRouter.tsx — Adds /construction/* route tree; root / redirects to /construction/dashboard
Modules (all under /construction/*)

Route	Module	Key interactions
/dashboard	Executive Dashboard	Staggered KPI cards, project progress bars, budget vs actual
/crm	CRM / Job Intake	Job cards grid, New Job dialog → adds to store
/bidding	Bidding Engine	"Generate Bid" (2s fake async) + AnimatePresence reveal
/projects	PM Board	4-column Kanban (Planning/Materials/Build/Inspection) + List view
/blueprints	Blueprint Analysis	Upload zone + simulated AI analysis (sections, materials, flagged issues)
/materials	Materials Planning	Table with per-row Order / Mark Delivered status transitions
/workforce	Crew Scheduling	Role-colored worker cards + weekly schedule table
/payroll	Payroll & Accounting	Run Payroll action, per-worker invoice generation
/contracts	Legal / Contracts	Generate → Send → Sign approval flow with contract preview modal
Screenshots

Executive Dashboard
Dashboard

CRM / Job Intake
CRM

Projects — Kanban Board
Kanban

Materials Planning
Materials


## Technologies

**Backend:**

- [Bun](https://bun.run/)
- [Hono](https://github.com/honojs/hono)

**Frontend:**

- [Typescript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)

## Quickstart

- Frontend: `cd frontend && pnpm install && pnpm dev`
- Backend: `cd backend && bun install && bun dev`

## RAG Assistant Environment

- `OPENAI_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_INDEX_HOST`
- `PINECONE_NAMESPACE` optional
- `OPENAI_EMBEDDING_MODEL` optional
- `OPENAI_CHAT_MODEL` optional

Frontend dev mode proxies `/api/*` to `http://localhost:5001`, so you can usually run the frontend without extra API URL env vars.

## Tests

- Frontend: `pnpm lint && pnpm test && pnpm build`
- Backend: `bun test`

## Docs

- `Agents.md`
- `frontend/APP_MAP.md`
- `backend/APP_MAP.md`
- `docs/CONTRACTS.md`

## DevOps

- [Github](https://github.com/)
- [Docker](https://www.docker.com/)
