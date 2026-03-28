import { create } from 'zustand';

type RagSource = {
  id?: string;
  title: string;
  url: string;
  excerpt: string;
  score?: number;
};

type RagSearchResult = RagSource;

type RagChatStore = {
  searchQuery: string;
  searchResults: RagSearchResult[];
  answer: string;
  sources: RagSource[];
  setAnswer: (answer: string) => void;
  setSources: (sources: RagSource[]) => void;
  setSearchQuery: (searchQuery: string) => void;
  setSearchResults: (searchResults: RagSearchResult[]) => void;
  setState: (state: Partial<RagChatStore>) => void;
};

export const useRagChatStore = create<RagChatStore>((set) => ({
  searchQuery: '',
  searchResults: [],
  answer: '',
  sources: [],
  setAnswer: (answer) => set(() => ({ answer })),
  setSources: (sources) => set(() => ({ sources })),
  setSearchQuery: (searchQuery) => set(() => ({ searchQuery })),
  setSearchResults: (searchResults) => set(() => ({ searchResults })),
  setState: (state) => set((current) => ({ ...current, ...state })),
}));

export type { RagChatStore, RagSearchResult, RagSource };
