import { create } from 'zustand';

import { getStorage, setRememberMe } from '@/shared/lib/storage';

import type { LoginResponse } from '../api/login';

const AUTH_KEY = 'auth';
const TOKEN_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
  isHydrated: boolean;
  setSession: (data: LoginResponse, remember: boolean) => void;
  logout: () => void;
  hydrate: () => void;
  setRememberMe: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  rememberMe: false,
  isHydrated: false,

  setSession: (data, remember) => {
    setRememberMe(remember);
    const storage = getStorage();
    storage.setItem(TOKEN_KEY, data.accessToken);
    storage.setItem(REFRESH_KEY, data.refreshToken);
    storage.setItem(
      AUTH_KEY,
      JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      })
    );
    set({
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      },
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      rememberMe: remember,
    });
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    set({ user: null, accessToken: null, refreshToken: null });
  },

  hydrate: () => {
    const fromLocal = localStorage.getItem(TOKEN_KEY);
    const fromSession = sessionStorage.getItem(TOKEN_KEY);
    const token = fromLocal ?? fromSession;
    const storage = fromLocal ? localStorage : sessionStorage;
    const authStr = storage.getItem(AUTH_KEY);

    set({ isHydrated: true });

    if (!token || !authStr) return;

    try {
      const user = JSON.parse(authStr) as User;
      set({
        user,
        accessToken: token,
        refreshToken: storage.getItem(REFRESH_KEY),
        rememberMe: storage === localStorage,
      });
    } catch {
      get().logout();
    }
  },

  setRememberMe: (value) => {
    setRememberMe(value);
    set({ rememberMe: value });
  },
}));
