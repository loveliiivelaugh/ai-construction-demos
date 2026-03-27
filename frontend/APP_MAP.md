## Frontend App Map

## Overview
React + Vite app with MUI UI system, React Router for navigation, React Query for server state, and Zustand for local state.

## Entry Flow
1) `frontend/src/components/App/main.tsx` mounts the app
2) `frontend/src/components/routes/AppRouter.tsx` defines routes and layout
3) `frontend/src/components/Providers/Providers.tsx` sets providers (theme, query, etc.)

## Routes (from `AppRouter`)
- `/` -> `HomePage`
- `/docs` -> `DocsPage`
- `/example` -> `ExampleFeaturePage`

## State and Data
- Zustand stores: `frontend/src/utilities/store/*`
- API clients: `frontend/src/utilities/api/*`
- Supabase client: `frontend/src/utilities/config/auth.config.ts`

## UI System
- MUI theme: `frontend/src/utilities/theme/themeConfig.ts`
- Theme provider: `frontend/src/utilities/theme/ThemeProvider.tsx`
- App shell/layout: `frontend/src/components/layout/AppShell.tsx`

## API Contract Usage
- API client uses base URL from `VITE_DEV_HOSTNAME` (dev) or `VITE_HOSTNAME` (prod)
- `VITE_MASTER_API_KEY` is sent as Bearer when provided
See `docs/CONTRACTS.md` for backend contract details.

## Feature Template
- Example feature scaffold: `frontend/src/components/features/ExampleFeature`
