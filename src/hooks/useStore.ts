import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal, Deposit, Theme, BankCard, AppSettings } from '../types';

interface AppState {
  goals: Goal[];
  theme: Theme;
  bankCards: BankCard[];
  settings: AppSettings;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount' | 'isCompleted' | 'deposits' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addDeposit: (goalId: string, deposit: Omit<Deposit, 'id'>) => void;
  deleteDeposit: (goalId: string, depositId: string) => void;
  setTheme: (theme: Theme) => void;
  addBankCard: (card: Omit<BankCard, 'id'>) => void;
  deleteBankCard: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      goals: [],
      theme: 'orange',
      bankCards: [],
      settings: {
        requirePasswordForDelete: false,
      },

      addGoal: (goalData) => {
        const newGoal: Goal = {
          ...goalData,
          id: Date.now().toString(),
          currentAmount: 0,
          isCompleted: false,
          deposits: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) => g.id === id ? { ...g, ...updates } : g)
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
      },

      addDeposit: (goalId, depositData) => {
        const newDeposit: Deposit = {
          ...depositData,
          id: Date.now().toString(),
        };

        set((state) => {
          const updatedGoals = state.goals.map((goal) => {
            if (goal.id === goalId) {
              const newCurrentAmount = goal.currentAmount + depositData.amount;
              const isCompleted = newCurrentAmount >= goal.targetAmount;
              return {
                ...goal,
                currentAmount: newCurrentAmount,
                isCompleted,
                deposits: [...goal.deposits, newDeposit],
              };
            }
            return goal;
          });
          return { goals: updatedGoals };
        });
      },

      deleteDeposit: (goalId, depositId) => {
        set((state) => {
          const updatedGoals = state.goals.map((goal) => {
            if (goal.id === goalId) {
              const depositToDelete = goal.deposits.find((d) => d.id === depositId);
              if (!depositToDelete) return goal;

              const newCurrentAmount = goal.currentAmount - depositToDelete.amount;
              const isCompleted = newCurrentAmount >= goal.targetAmount;

              return {
                ...goal,
                currentAmount: Math.max(0, newCurrentAmount),
                isCompleted,
                deposits: goal.deposits.filter((d) => d.id !== depositId),
              };
            }
            return goal;
          });
          return { goals: updatedGoals };
        });
      },

      setTheme: (theme) => set({ theme }),

      addBankCard: (cardData) => {
        const newCard: BankCard = {
          ...cardData,
          id: Date.now().toString(),
        };
        set((state) => ({ bankCards: [...state.bankCards, newCard] }));
      },

      deleteBankCard: (id) => {
        set((state) => ({ bankCards: state.bankCards.filter((c) => c.id !== id) }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
    }),
    {
      name: 'just-buy-it-storage',
    }
  )
);