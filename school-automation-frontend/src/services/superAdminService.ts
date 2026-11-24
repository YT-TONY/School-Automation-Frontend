// src/services/superAdminService.ts

import apiClient from './apiClient';
import { BrandMotif, IntroSiteConfig, AdmissionsConfig } from '@/types/theme';

export interface TenantSchoolRecord {
  id: string;
  name: string;
  slug: string;
  subdomain?: string;
  custom_domain?: string | null;
  tier: 1 | 2;
  is_active: boolean;
  paystack_subaccount_code?: string | null;
  whatsapp_phone_number_id?: string | null;
  has_intro_website: boolean;
  primary_color: string;
  motif?: BrandMotif;
  created_at?: string;
}

export interface OnboardTenantPayload {
  school_name: string;
  slug: string;
  custom_domain?: string;
  tier: 1 | 2;
  admin_full_name: string;
  admin_email: string;
  admin_password: string;
  bank_code: string;
  bank_name: string;
  account_number: string;
  whatsapp_phone_number_id?: string;
  whatsapp_access_token?: string;
  branding: {
    primaryColor: string;
    accentColor: string;
    motif: BrandMotif;
    motto: string;
    logoUrl: string;
    watermarkUrl: string;
  };
  settings: {
    has_intro_website: boolean;
    intro_site_config: IntroSiteConfig;
    admissions_config?: AdmissionsConfig;
  };
}

export interface OnboardTenantResponse {
  school: TenantSchoolRecord;
  admin_email: string;
  paystack_subaccount_code: string;
  portal_url: string;
}

export const superAdminService = {
  async listSchools(): Promise<TenantSchoolRecord[]> {
    try {
      const response = await apiClient.get<TenantSchoolRecord[]>('/admin/schools');
      return response.data;
    } catch {
      // Demo fallback records when backend is offline or unauthenticated locally
      return [
        {
          id: 'demo-stg-001',
          name: "St. Gregory's College",
          slug: 'stgregory',
          subdomain: 'stgregory',
          tier: 2,
          is_active: true,
          paystack_subaccount_code: 'ACCT_89x72k19a',
          whatsapp_phone_number_id: '109876543210985',
          has_intro_website: true,
          primary_color: '#1E3A8A',
          motif: 'collegiate-stripe',
        },
        {
          id: 'demo-qmc-002',
          name: 'Queens Model Academy',
          slug: 'queensmodel',
          subdomain: 'queensmodel',
          tier: 1,
          is_active: true,
          paystack_subaccount_code: 'ACCT_44p10m88z',
          has_intro_website: false,
          primary_color: '#881337',
          motif: 'heritage-quatrefoil',
        },
      ];
    }
  },

  async onboardSchool(payload: OnboardTenantPayload): Promise<OnboardTenantResponse> {
    const response = await apiClient.post<OnboardTenantResponse>('/admin/schools/onboard', payload);
    return response.data;
  },

  async updateSchoolTier(schoolId: string, tier: 1 | 2): Promise<TenantSchoolRecord> {
    const response = await apiClient.patch<TenantSchoolRecord>(
      `/admin/schools/${schoolId}/tier`,
      null,
      { params: { tier } }
    );
    return response.data;
  },
};