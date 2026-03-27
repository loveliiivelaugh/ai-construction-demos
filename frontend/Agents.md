## Frontend Agent Guide

## Stack
- Vite + React 18
- MUI (Emotion) for UI
- React Router for routing
- React Query for server state
- Zustand for local state

## Entry Points
- App entry: `frontend/src/components/App/main.tsx`
- Router: `frontend/src/components/routes/AppRouter.tsx`
- Providers + theme: `frontend/src/components/Providers/Providers.tsx`, `frontend/src/utilities/theme`

## Routes
Defined in `frontend/src/components/routes/AppRouter.tsx`.
- `/` -> `HomePage`
- `/docs` -> `DocsPage`

## State and Data
- Zustand stores: `frontend/src/utilities/store/*`
- React Query API client: `frontend/src/utilities/api/index.ts`
- Shared API helpers: `frontend/src/utilities/api/*`

## API Contracts
See `docs/CONTRACTS.md` and `backend/APP_MAP.md` for endpoint details and auth requirements.

## Environment Variables
Frontend expects these `VITE_*` values:
- `VITE_SUPABASE_URL` (optional)
- `VITE_SUPABASE_KEY` (optional)
- `VITE_DEV_HOSTNAME` (backend base URL in dev)
- `VITE_HOSTNAME` (backend base URL in prod)
- `VITE_MASTER_API_KEY` (sent as Bearer token)

## Tests
- Run: `pnpm test`
- Watch: `pnpm test:watch`
