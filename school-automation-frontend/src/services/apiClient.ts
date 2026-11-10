// src/services/apiClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export function resolveTenantSlug(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'default';
  }
  const stored = window.localStorage.getItem('x_tenant_slug');
  if (stored) return stored;

  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.NEXT_PUBLIC_DEV_TENANT_OVERRIDE || 'stgregory';
  }
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0].toLowerCase();
  }
  return 'default';
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tenantSlug = resolveTenantSlug();
  if (tenantSlug) {
    config.headers.set('X-Tenant-ID', tenantSlug);
  }
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('auth_access_token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.localStorage.removeItem('auth_access_token');
      const pathname = window.location.pathname;
      if (!pathname.startsWith('/login') && !pathname.startsWith('/check-result')) {
        const redirectUrl = new URL('/login', window.location.origin);
        redirectUrl.searchParams.set('expired', '1');
        redirectUrl.searchParams.set('redirect', pathname);
        window.location.href = redirectUrl.toString();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;