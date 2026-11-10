// src/types/theme.ts
export interface SchoolBranding {
  schoolName: string;
  motto?: string;
  logoUrl: string;
  watermarkUrl: string;
  primaryColor: string;
  accentColor?: string;
  tier: 1 | 2;
  hasIntroWebsite: boolean;
  introConfig?: IntroSiteConfig;
}

export interface IntroSiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImages: string[];
  whyUsPoints: Array<{ title: string; description: string; icon?: string }>;
  newsItems: Array<{ id: string; title: string; date: string; summary: string }>;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface DerivedPalette {
  primary: string;
  primaryHover: string;
  primarySubtle: string;
  primaryBorder: string;
  textOnPrimary: string;
}