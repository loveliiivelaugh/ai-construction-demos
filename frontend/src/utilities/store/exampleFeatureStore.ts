import { create } from 'zustand';

interface ExampleFeatureState {
  count: number;
  increment: () => void;
  reset: () => void;
}

const useExampleFeatureStore = create<ExampleFeatureState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));

export { useExampleFeatureStore };
