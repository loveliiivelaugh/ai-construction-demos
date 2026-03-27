## Starter Template Agent Guide

This repo is an opinionated full-stack template with a React/Vite frontend and a Bun/Hono backend. Use this file as the starting point for new agents and new projects.

## Repository Map
- `frontend/` React + Vite + MUI + React Query + Zustand
- `backend/` Bun + Hono + OpenAPI
- `docs/` shared contracts and standards

## Quickstart
- Frontend: `cd frontend && pnpm install && pnpm dev`
- Backend: `cd backend && bun install && bun dev`

## App Maps
- Frontend map: `frontend/APP_MAP.md`
- Backend map: `backend/APP_MAP.md`
- Contracts: `docs/CONTRACTS.md`
- Example feature: `frontend/src/components/features/ExampleFeature`

## Quality Gates (CI/CD)
- Frontend: `pnpm lint`, `pnpm test`, `pnpm build`
- Backend: `bun test`

## Standards Snapshot
- TypeScript strict mode is enabled on both sides
- Prefer API access through centralized clients (`frontend/src/utilities/api`)
- Backend routes are Hono routers under `backend/src/routes`
- No secrets in repo; use env vars listed in app maps and contracts
