import { client } from './index';
import type { RagSearchResult, RagSource } from '@store/ragChatStore';

export async function ragSearch(q: string, k = 5) {
  const response = await client.post('/api/v1/rag/search', { q, k });
  return response.data as RagSearchResult[];
}

export async function ragChat(q: string, k = 5) {
  const response = await client.post('/api/v1/rag/chat', { q, k });
  return response.data as { answer: string; sources: RagSource[] };
}
