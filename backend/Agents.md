## Backend Agent Guide

## Stack
- Bun runtime
- Hono with OpenAPI (zod-openapi)

## Entry Points
- Server entry: `backend/src/index.ts`
- Primary routes: `backend/src/routes`

## Middleware and Auth
- Global middleware: CORS, logger, secure headers, pretty JSON
- Optional global auth: `bearerAuth` is enabled when `MASTER_API_KEY` is set

## API Docs
- OpenAPI JSON: `/openapi.json`
- Swagger UI: `/ui`
- Scalar UI: `/ui2`

## Environment Variables
Required/used by the backend:
- `PORT` (optional, default 5001)
- `MASTER_API_KEY` (optional, enables bearer auth)

## Tests
- Run: `bun test`
