// src/hooks/useSchoolTheme.ts
'use client';

import { useState, useEffect, useTransition } from 'react';
import apiClient from '@/services/apiClient';
import { generateDerivedPalette } from '@/utils/colorEngine';
import { SchoolBranding, DerivedPalette } from '@/types/theme';

const DEFAULT_BRANDING: SchoolBranding = {
  schoolName: 'School Portal',
  motto: 'Knowledge, Discipline and Excellence',
  logoUrl: '/watermarks/default_crest_watermark.svg',
  watermarkUrl: '/watermarks/default_crest_watermark.svg',
  primaryColor: '#1E3A8A',
  accentColor: '#D97706',
  tier: 1,
  hasIntroWebsite: false,
};

export function useSchoolTheme() {
  const [branding, setBranding] = useState<SchoolBranding>(DEFAULT_BRANDING);
  const [palette, setPalette] = useState<DerivedPalette>(() =>
    generateDerivedPalette(DEFAULT_BRANDING.primaryColor)
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    async function fetchBranding() {
      try {
        const response = await apiClient.get<SchoolBranding>('/schools/branding');
        if (active && response.data?.primaryColor) {
          startTransition(() => {
            setBranding(response.data);
            setPalette(generateDerivedPalette(response.data.primaryColor));
          });
        }
      } catch {
        if (active) {
          setPalette(generateDerivedPalette(DEFAULT_BRANDING.primaryColor));
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    fetchBranding();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', palette.primary);
    root.style.setProperty('--color-primary-hover', palette.primaryHover);
    root.style.setProperty('--color-primary-subtle', palette.primarySubtle);
    root.style.setProperty('--color-primary-border', palette.primaryBorder);
    root.style.setProperty('--color-text-on-primary', palette.textOnPrimary);
    root.style.setProperty(
      '--school-watermark-url',
      `url("${branding.watermarkUrl || DEFAULT_BRANDING.watermarkUrl}")`
    );
  }, [palette, branding.watermarkUrl]);

  return { branding, palette, isLoading, isTier1: branding.tier === 1, isTier2: branding.tier === 2 };
}