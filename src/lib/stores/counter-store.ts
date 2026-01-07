import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

interface CounterState {
  count: number;
  history: number[];
  isLoading: boolean;
  error: string | null;

  // Basic actions
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  incrementBy: (amount: number) => void;

  // Async actions
  incrementAsync: (delay?: number) => Promise<void>;
  decrementAsync: (delay?: number) => Promise<void>;

  // Undo/Redo functionality
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Computed values
  isEven: boolean;
  isPositive: boolean;
  doubleCount: number;

  // Utility actions
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Helper function to simulate async operation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useCounterStore = create<CounterState>()(
  subscribeWithSelector(
    devtools(
      persist(
        (set, get) => ({
          count: 0,
          history: [0],
          isLoading: false,
          error: null,

          // Basic actions
          increment: () =>
            set((state) => {
              const newCount = state.count + 1;
              return {
                count: newCount,
                history: [...state.history, newCount],
                error: null,
              };
            }),

          decrement: () =>
            set((state) => {
              const newCount = state.count - 1;
              return {
                count: newCount,
                history: [...state.history, newCount],
                error: null,
              };
            }),

          reset: () =>
            set((state) => ({
              count: 0,
              history: [...state.history, 0],
              error: null,
            })),

          incrementBy: (amount: number) =>
            set((state) => {
              const newCount = state.count + amount;
              return {
                count: newCount,
                history: [...state.history, newCount],
                error: null,
              };
            }),

          // Async actions
          incrementAsync: async (delayMs = 1000) => {
            set({ isLoading: true, error: null });
            try {
              await delay(delayMs);
              set((state) => {
                const newCount = state.count + 1;
                return {
                  count: newCount,
                  history: [...state.history, newCount],
                  isLoading: false,
                };
              });
            } catch (error) {
              set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Async increment failed',
              });
            }
          },

          decrementAsync: async (delayMs = 1000) => {
            set({ isLoading: true, error: null });
            try {
              await delay(delayMs);
              set((state) => {
                const newCount = state.count - 1;
                return {
                  count: newCount,
                  history: [...state.history, newCount],
                  isLoading: false,
                };
              });
            } catch (error) {
              set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Async decrement failed',
              });
            }
          },

          // Undo/Redo functionality
          undo: () =>
            set((state) => {
              if (state.history.length > 1) {
                const newHistory = [...state.history];
                newHistory.pop(); // Remove current state
                const previousCount = newHistory[newHistory.length - 1];
                return {
                  count: previousCount,
                  history: newHistory,
                  error: null,
                };
              }
              return state;
            }),

          redo: () =>
            set((state) => {
              // For simplicity, redo is not implemented in this demo
              // In a real app, you'd maintain a separate redo stack
              return state;
            }),

          get canUndo() {
            return get().history.length > 1;
          },

          get canRedo() {
            // Always false in this simple implementation
            return false;
          },

          // Computed values
          get isEven() {
            return get().count % 2 === 0;
          },

          get isPositive() {
            return get().count > 0;
          },

          get doubleCount() {
            return get().count * 2;
          },

          // Utility actions
          setError: (error: string | null) => set({ error }),
          clearError: () => set({ error: null }),
        }),
        {
          name: 'counter-storage',
          // Only persist count and history, not loading states
          partialize: (state) => ({
            count: state.count,
            history: state.history,
          }),
        }
      ),
      {
        name: 'counter-store',
      }
    )
  )
);

// Selectors for better performance and reusability
export const useCounterValue = () => useCounterStore((state) => state.count);
export const useCounterActions = () =>
  useCounterStore((state) => ({
    increment: state.increment,
    decrement: state.decrement,
    reset: state.reset,
    incrementBy: state.incrementBy,
    incrementAsync: state.incrementAsync,
    decrementAsync: state.decrementAsync,
    undo: state.undo,
    redo: state.redo,
  }));
export const useCounterComputed = () =>
  useCounterStore((state) => ({
    isEven: state.isEven,
    isPositive: state.isPositive,
    doubleCount: state.doubleCount,
  }));
export const useCounterStatus = () =>
  useCounterStore((state) => ({
    isLoading: state.isLoading,
    error: state.error,
    canUndo: state.canUndo,
    canRedo: state.canRedo,
  }));
