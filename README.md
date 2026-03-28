# AI Construction Demos

Construction-focused demos built on a React/Vite frontend and Bun/Hono backend, now with a site-wide Pinecone-backed RAG assistant.

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
