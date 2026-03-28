# Starter Backend

## Docs

- `GET /` -> service metadata
- `GET /health` -> health check
- `GET /api/v1/rag/ping` -> RAG assistant status
- `POST /api/v1/rag/search` -> Pinecone retrieval results
- `POST /api/v1/rag/chat` -> RAG answer with sources

## Environment

- `OPENAI_API_KEY`
- `OPENAI_EMBEDDING_MODEL` optional, defaults to `text-embedding-3-small`
- `OPENAI_CHAT_MODEL` optional, defaults to `gpt-4.1-mini`
- `PINECONE_API_KEY`
- `PINECONE_INDEX_HOST` preferred
- `PINECONE_NAMESPACE` optional

If you do not have `PINECONE_INDEX_HOST`, you can instead provide:

- `PINECONE_INDEX_NAME`
- `PINECONE_ENVIRONMENT`
- `PINECONE_PROJECT_ID`
