import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'night', // Default to night
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'night' ? 'light' : 'night' 
      })),
    }),
    {
      name: 'theme-storage',
    }
  )
);