// src/services/authService.ts

import apiClient from './apiClient';
import { UserProfile } from '@/types/schema';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: UserProfile;
}

export const authService = {
  async login(
    username: string,
    password: string,
    options?: { isSuperAdmin?: boolean }
  ): Promise<{ token: string; user: UserProfile }> {
    const formData = new URLSearchParams();
    formData.append('username', username.trim());
    formData.append('password', password);

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // Omit X-Tenant-ID when authenticating as global SUPER_ADMIN
    if (options?.isSuperAdmin) {
      headers['X-Tenant-ID'] = '';
    }

    const response = await apiClient.post<LoginResponse>('/auth/login', formData.toString(), {
      headers,
    });

    const token = response.data.access_token;

    // Fetch authenticated user profile if not embedded in login response
    let user = response.data.user;
    if (!user) {
      const meResponse = await apiClient.get<UserProfile>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(options?.isSuperAdmin ? { 'X-Tenant-ID': '' } : {}),
        },
      });
      user = meResponse.data;
    }

    return { token, user };
  },

  async getCurrentUser(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/auth/me');
    return response.data;
  },
};