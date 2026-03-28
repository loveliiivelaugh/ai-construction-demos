import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { chatWithKnowledgeBase, getRagHealth, searchKnowledgeBase } from '../utilities/lib/rag';

const ragRoutes = new OpenAPIHono();

const SearchRequest = z.object({
  q: z.string().min(1),
  k: z.number().int().min(1).max(25).optional(),
});

const SourceSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  url: z.string(),
  excerpt: z.string(),
  score: z.number().optional(),
});

const ChatResponse = z.object({
  answer: z.string(),
  sources: z.array(SourceSchema),
});

const HealthResponse = z.object({
  status: z.string(),
  provider: z.object({
    openaiEmbeddingModel: z.string(),
    openaiChatModel: z.string(),
    pineconeHostConfigured: z.boolean(),
    pineconeNamespace: z.string().nullable(),
  }),
  configured: z.object({
    openaiApiKey: z.boolean(),
    pineconeApiKey: z.boolean(),
    pineconeHost: z.boolean(),
  }),
});

ragRoutes.openapi(
  createRoute({
    method: 'get',
    path: '/ping',
    summary: 'Check whether the RAG assistant is reachable',
    tags: ['rag'],
    responses: {
      200: {
        description: 'RAG health information',
        content: { 'application/json': { schema: HealthResponse } },
      },
    },
  }),
  (c) => c.json(getRagHealth()),
);

ragRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/search',
    summary: 'Search the Pinecone knowledge base',
    tags: ['rag'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: SearchRequest,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Matching knowledge base chunks',
        content: { 'application/json': { schema: z.array(SourceSchema) } },
      },
    },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const results = await searchKnowledgeBase(body.q, body.k || 5);
    return c.json(results);
  },
);

ragRoutes.openapi(
  createRoute({
    method: 'post',
    path: '/chat',
    summary: 'Answer a question using Pinecone-backed retrieval',
    tags: ['rag'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: SearchRequest,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Chat response with cited sources',
        content: { 'application/json': { schema: ChatResponse } },
      },
    },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const response = await chatWithKnowledgeBase(body.q, body.k || 5);
    return c.json(response);
  },
);

export { ragRoutes };
