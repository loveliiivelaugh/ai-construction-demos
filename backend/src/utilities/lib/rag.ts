type RagSearchMatch = {
  id: string;
  score?: number;
  metadata?: Record<string, unknown>;
};

type RagSource = {
  id?: string;
  title: string;
  url: string;
  excerpt: string;
  score?: number;
};

type RagChatResponse = {
  answer: string;
  sources: RagSource[];
};

type OpenAIEmbeddingResponse = {
  data?: Array<{ embedding?: number[] }>;
};

type OpenAIChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type PineconeQueryResponse = {
  matches?: RagSearchMatch[];
};

const OPENAI_EMBEDDING_MODEL = Bun.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
const OPENAI_CHAT_MODEL = Bun.env.OPENAI_CHAT_MODEL || 'gpt-4.1-mini';
const OPENAI_API_URL = Bun.env.OPENAI_API_URL || 'https://api.openai.com/v1';

function hasPineconeHostConfig() {
  return Boolean(
    Bun.env.PINECONE_INDEX_HOST ||
      (Bun.env.PINECONE_INDEX_NAME && Bun.env.PINECONE_ENVIRONMENT && Bun.env.PINECONE_PROJECT_ID),
  );
}

function requiredEnv(name: string): string {
  const value = Bun.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getPineconeHost(): string {
  const explicitHost = Bun.env.PINECONE_INDEX_HOST;
  if (explicitHost) {
    return explicitHost.replace(/\/$/, '');
  }

  const indexName = Bun.env.PINECONE_INDEX_NAME;
  const environment = Bun.env.PINECONE_ENVIRONMENT;
  const projectId = Bun.env.PINECONE_PROJECT_ID;

  if (indexName && environment && projectId) {
    return `https://${indexName}-${projectId}.svc.${environment}.pinecone.io`;
  }

  throw new Error(
    'Missing Pinecone host configuration. Set PINECONE_INDEX_HOST or PINECONE_INDEX_NAME + PINECONE_ENVIRONMENT + PINECONE_PROJECT_ID.',
  );
}

async function embedQuery(input: string): Promise<number[]> {
  const apiKey = requiredEnv('OPENAI_API_KEY');
  const response = await fetch(`${OPENAI_API_URL}/embeddings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input,
      model: OPENAI_EMBEDDING_MODEL,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI embedding request failed with status ${response.status}`);
  }

  const data = (await response.json()) as OpenAIEmbeddingResponse;
  const embedding = data.data?.[0]?.embedding;

  if (!embedding) {
    throw new Error('OpenAI embedding response did not include an embedding vector.');
  }

  return embedding;
}

async function queryPinecone(vector: number[], topK: number): Promise<RagSearchMatch[]> {
  const apiKey = requiredEnv('PINECONE_API_KEY');
  const host = getPineconeHost();
  const namespace = Bun.env.PINECONE_NAMESPACE;

  const response = await fetch(`${host}/query`, {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
      'X-Pinecone-API-Version': '2024-07',
    },
    body: JSON.stringify({
      vector,
      topK,
      includeMetadata: true,
      ...(namespace ? { namespace } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Pinecone query failed with status ${response.status}`);
  }

  const data = (await response.json()) as PineconeQueryResponse;
  return data.matches || [];
}

function coerceSource(match: RagSearchMatch): RagSource {
  const metadata = match.metadata || {};
  const title =
    String(metadata.title || metadata.name || metadata.heading || 'Construction Knowledge Base');
  const url = String(metadata.url || metadata.source || metadata.href || '');
  const excerpt = String(
    metadata.excerpt || metadata.text || metadata.chunk || metadata.summary || '',
  );

  return {
    id: match.id,
    title,
    url,
    excerpt,
    score: match.score,
  };
}

export async function searchKnowledgeBase(query: string, topK = 5): Promise<RagSource[]> {
  const embedding = await embedQuery(query);
  const matches = await queryPinecone(embedding, topK);

  return matches
    .map(coerceSource)
    .filter((source) => source.title || source.url || source.excerpt);
}

function buildSystemPrompt() {
  return [
    'You are a construction operations AI assistant for ai-construction-demos.',
    'Answer using the retrieved knowledge base context when possible.',
    'If the sources are incomplete, say what is known and what is uncertain.',
    'Keep answers concise, practical, and oriented toward construction workflows.',
    'Do not invent citations or URLs.',
  ].join(' ');
}

function buildUserPrompt(query: string, sources: RagSource[]) {
  const context = sources.length
    ? sources
        .map((source, index) => {
          return [
            `Source ${index + 1}:`,
            `Title: ${source.title || 'Untitled'}`,
            `URL: ${source.url || 'Unknown'}`,
            `Excerpt: ${source.excerpt || 'No excerpt available.'}`,
          ].join('\n');
        })
        .join('\n\n')
    : 'No matching sources were found.';

  return [
    `User question: ${query}`,
    '',
    'Retrieved context:',
    context,
    '',
    'Write a helpful answer. If context is weak, say that directly.',
  ].join('\n');
}

async function synthesizeAnswer(query: string, sources: RagSource[]): Promise<string> {
  const apiKey = requiredEnv('OPENAI_API_KEY');
  const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(query, sources) },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI chat request failed with status ${response.status}`);
  }

  const data = (await response.json()) as OpenAIChatResponse;
  return data.choices?.[0]?.message?.content?.trim() || 'I could not generate a response.';
}

export async function chatWithKnowledgeBase(query: string, topK = 5): Promise<RagChatResponse> {
  const sources = await searchKnowledgeBase(query, topK);
  const answer = await synthesizeAnswer(query, sources);

  return { answer, sources };
}

export function getRagHealth() {
  return {
    status: 'ok',
    provider: {
      openaiEmbeddingModel: OPENAI_EMBEDDING_MODEL,
      openaiChatModel: OPENAI_CHAT_MODEL,
      pineconeHostConfigured: hasPineconeHostConfig(),
      pineconeNamespace: Bun.env.PINECONE_NAMESPACE || null,
    },
    configured: {
      openaiApiKey: Boolean(Bun.env.OPENAI_API_KEY),
      pineconeApiKey: Boolean(Bun.env.PINECONE_API_KEY),
      pineconeHost: hasPineconeHostConfig(),
    },
  };
}

export type { RagChatResponse, RagSource };
