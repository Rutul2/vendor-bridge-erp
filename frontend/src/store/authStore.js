// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setToken: (token) => set({ token }),
      updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
      login: (userData, token, refreshToken) => {
        localStorage.setItem('refreshToken', refreshToken);
        set({ user: userData, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('refreshToken');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);