## Backend App Map

## Overview
Bun + Hono API server with OpenAPI docs.

## Entry Flow
1) `backend/src/index.ts` creates `OpenAPIHono` app
2) Global middleware: logger, CORS, secure headers, bearer auth
3) API routes mounted from `backend/src/routes`

## Route Map
- `GET /` -> service metadata
- `GET /health` -> health check
- `GET /api/v1/example` -> example starter endpoint

## Auth Model
- Optional global bearer auth: `Authorization: Bearer ${MASTER_API_KEY}`

## External Clients
- None by default (add as needed)

## Contracts
See `docs/CONTRACTS.md` for endpoint details and payloads.
