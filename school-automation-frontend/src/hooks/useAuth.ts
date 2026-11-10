// src/hooks/useAuth.ts
'use client';

import { useCallback, useSyncExternalStore } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

export interface AuthSession {
  token: string | null;
  isAuthenticated: boolean;
  user: AuthUser | null;
}

const AUTH_CHANGE_EVENT = 'auth-session-change';

function notifyAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return '';
  const token = window.localStorage.getItem('auth_access_token') || '';
  const user = window.localStorage.getItem('auth_user_data') || '';
  return `${token}:::${user}`;
}

function getServerSnapshot(): string {
  return '';
}

export function useAuth() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let token: string | null = null;
  let user: AuthUser | null = null;

  if (raw) {
    const [storedToken, storedUser] = raw.split(':::');
    if (storedToken) token = storedToken;
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch {
        user = null;
      }
    }
  }

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    window.localStorage.setItem('auth_access_token', newToken);
    window.localStorage.setItem('auth_user_data', JSON.stringify(newUser));
    notifyAuthChange();
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem('auth_access_token');
    window.localStorage.removeItem('auth_user_data');
    notifyAuthChange();
  }, []);

  return {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };
}