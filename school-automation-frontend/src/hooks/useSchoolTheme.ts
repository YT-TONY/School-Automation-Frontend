// src/hooks/useSchoolTheme.ts
'use client';

import { useState, useEffect, useTransition } from 'react';
import apiClient from '@/services/apiClient';
import { generateDerivedPalette } from '@/utils/colorEngine';
import { SchoolBranding, DerivedPalette, AdmissionsConfig } from '@/types/theme';

export const DEFAULT_ADMISSIONS_CONFIG: AdmissionsConfig = {
  isOpen: true,
  academicSession: '2026/2027',
  applicationFormFee: 10000,
  ageAndEligibilityNote:
    'Candidates seeking entry into JSS 1 must be at least 10 years old by September of the admission year and present their Primary 5/6 continuous assessment transcript.',
  requiredDocuments: [
    'Two (2) recent colored passport photographs',
    'Photocopy of Birth Certificate or National Population Commission attestation',
    'Last two (2) academic term report cards from current school',
    'Transfer Certificate / Letter of Good Conduct (upon provisional offer)',
  ],
  steps: [
    {
      stepNumber: 1,
      title: 'Estimate Fees & Review Requirements',
      description:
        'Use the interactive fee calculator below to view the exact termly tuition, boarding, and entry package for your ward’s class.',
      timeline: '5 Mins',
    },
    {
      stepNumber: 2,
      title: 'Schedule Entrance Assessment Date',
      description:
        'Select an available screening date and time slot to reserve an examination seat and generate your ward’s Assessment Pass.',
      timeline: 'Instant Slip',
    },
    {
      stepNumber: 3,
      title: 'Written CBT / Paper Screening & Oral Interview',
      description:
        'Candidates sit for Mathematics, English Language, and General Aptitude evaluations followed by a brief parent-principal interaction.',
      timeline: 'Exam Day',
    },
    {
      stepNumber: 4,
      title: 'Provisional Admission & Portal Onboarding',
      description:
        'Successful candidates receive an SMS/WhatsApp admission offer and portal login credentials to complete acceptance and fee settlement.',
      timeline: '48 Hours',
    },
  ],
  feeSchedules: [
    {
      classId: 'pry-1-6',
      className: 'Primary 1 – 6 (Basic Education)',
      category: 'PRIMARY',
      boardingAvailable: false,
      boardingFeePerTerm: 0,
      tuitionAndCompulsory: [
        { id: 't-pry', label: 'Termly Tuition & Instructional Levy', amount: 115000, frequency: 'PER_TERM' },
        { id: 'pta-pry', label: 'PTA & ICT Laboratory Maintenance', amount: 15000, frequency: 'PER_TERM' },
        { id: 'dev-pry', label: 'New Entrant Development & Crest Kit', amount: 35000, frequency: 'ONE_TIME_ENTRY' },
      ],
    },
    {
      classId: 'jss-1-3',
      className: 'JSS 1 – JSS 3 (Junior Secondary)',
      category: 'JUNIOR_SECONDARY',
      boardingAvailable: true,
      boardingFeePerTerm: 140000,
      tuitionAndCompulsory: [
        { id: 't-jss', label: 'Termly Tuition & Science Practicals', amount: 165000, frequency: 'PER_TERM' },
        { id: 'pta-jss', label: 'PTA, Sports & Library Levy', amount: 20000, frequency: 'PER_TERM' },
        { id: 'dev-jss', label: 'New Entrant Development & Uniform Package', amount: 55000, frequency: 'ONE_TIME_ENTRY' },
      ],
    },
    {
      classId: 'ss-1-3',
      className: 'SS 1 – SS 3 (Senior Secondary)',
      category: 'SENIOR_SECONDARY',
      boardingAvailable: true,
      boardingFeePerTerm: 150000,
      tuitionAndCompulsory: [
        { id: 't-ss', label: 'Termly Tuition & Specialized Labs', amount: 185000, frequency: 'PER_TERM' },
        { id: 'pta-ss', label: 'PTA, Exam Prep & ICT Levy', amount: 25000, frequency: 'PER_TERM' },
        { id: 'dev-ss', label: 'New Entrant Development & Uniform Package', amount: 60000, frequency: 'ONE_TIME_ENTRY' },
      ],
    },
  ],
  optionalAddons: [
    {
      id: 'bus-zone-a',
      label: 'School Shuttle Bus (Zone A — Within 10km)',
      description: 'Door-to-door morning pickup and afternoon drop-off.',
      amount: 45000,
      frequency: 'PER_TERM',
    },
    {
      id: 'bus-zone-b',
      label: 'School Shuttle Bus (Zone B — Extended Routes)',
      description: 'Dedicated air-conditioned coaster bus coverage.',
      amount: 65000,
      frequency: 'PER_TERM',
    },
    {
      id: 'lunch-plan',
      label: 'Nutritious Hot Midday Meal Plan (Day Students)',
      description: 'Balanced diet supervised by school nutritionist.',
      amount: 35000,
      frequency: 'PER_TERM',
    },
    {
      id: 'stem-robotics',
      label: 'After-School Coding & Robotics Academy',
      description: 'Hands-on Python, electronics, and Olympiad coaching.',
      amount: 20000,
      frequency: 'PER_TERM',
    },
  ],
  assessmentSlots: [
    {
      id: 'slot-1',
      dateLabel: 'Saturday, 28th November 2026',
      isoDate: '2026-11-28',
      timeWindow: '09:30 AM – 12:30 PM',
      venue: 'Main CBT & Examination Hall',
      seatsRemaining: 18,
    },
    {
      id: 'slot-2',
      dateLabel: 'Saturday, 5th December 2026',
      isoDate: '2026-12-05',
      timeWindow: '09:30 AM – 12:30 PM',
      venue: 'Main CBT & Examination Hall',
      seatsRemaining: 24,
    },
    {
      id: 'slot-3',
      dateLabel: 'Wednesday, 16th December 2026',
      isoDate: '2026-12-16',
      timeWindow: '10:00 AM – 01:00 PM',
      venue: 'Admissions Screening Block B',
      seatsRemaining: 12,
    },
  ],
};

const DEFAULT_BRANDING: SchoolBranding = {
  schoolName: 'School Portal',
  motto: 'Knowledge, Discipline and Excellence',
  logoUrl: '/watermarks/default_crest_watermark.svg',
  watermarkUrl: '/watermarks/default_crest_watermark.svg',
  primaryColor: '#1E3A8A',
  accentColor: '#D97706',
  motif: 'collegiate-stripe',
  tier: 2,
  hasIntroWebsite: true,
  minimumPaymentPercentage: 60,
  admissionsConfig: DEFAULT_ADMISSIONS_CONFIG,
};

interface BackendSchoolConfigResponse {
  school_name?: string;
  schoolName?: string;
  motto?: string;
  logo_url?: string;
  logoUrl?: string;
  watermark_url?: string;
  watermarkUrl?: string;
  primary_color?: string;
  primaryColor?: string;
  accent_color?: string;
  accentColor?: string;
  motif?: SchoolBranding['motif'];
  tier?: 1 | 2;
  has_intro_website?: boolean;
  hasIntroWebsite?: boolean;
  minimum_payment_percentage?: number;
  branding?: Partial<SchoolBranding>;
  settings?: {
    has_intro_website?: boolean;
    intro_site_config?: SchoolBranding['introConfig'];
    admissions_config?: AdmissionsConfig;
  };
}

export function useSchoolTheme() {
  const [branding, setBranding] = useState<SchoolBranding>(DEFAULT_BRANDING);
  const [palette, setPalette] = useState<DerivedPalette>(() =>
    generateDerivedPalette(DEFAULT_BRANDING.primaryColor)
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    apiClient
      .get<BackendSchoolConfigResponse>('/schools/config')
      .then((response) => {
        if (!active || !response.data) return;
        const raw = response.data;
        const nestedBranding = raw.branding || {};
        const nestedSettings = raw.settings || {};

        const resolvedPrimary =
          raw.primaryColor || raw.primary_color || nestedBranding.primaryColor || DEFAULT_BRANDING.primaryColor;

        const mergedBranding: SchoolBranding = {
          schoolName: raw.schoolName || raw.school_name || DEFAULT_BRANDING.schoolName,
          motto: raw.motto || nestedBranding.motto || DEFAULT_BRANDING.motto,
          logoUrl: raw.logoUrl || raw.logo_url || nestedBranding.logoUrl || DEFAULT_BRANDING.logoUrl,
          watermarkUrl:
            raw.watermarkUrl || raw.watermark_url || nestedBranding.watermarkUrl || DEFAULT_BRANDING.watermarkUrl,
          primaryColor: resolvedPrimary,
          accentColor: raw.accentColor || raw.accent_color || nestedBranding.accentColor || DEFAULT_BRANDING.accentColor,
          motif: raw.motif || nestedBranding.motif || DEFAULT_BRANDING.motif,
          tier: raw.tier || DEFAULT_BRANDING.tier,
          hasIntroWebsite:
            raw.hasIntroWebsite ??
            raw.has_intro_website ??
            nestedSettings.has_intro_website ??
            DEFAULT_BRANDING.hasIntroWebsite,
          minimumPaymentPercentage:
            raw.minimum_payment_percentage ?? DEFAULT_BRANDING.minimumPaymentPercentage,
          introConfig: nestedSettings.intro_site_config || nestedBranding.introConfig,
          admissionsConfig: nestedSettings.admissions_config || DEFAULT_ADMISSIONS_CONFIG,
        };

        startTransition(() => {
          setBranding(mergedBranding);
          setPalette(generateDerivedPalette(resolvedPrimary));
        });
      })
      .catch(() => {
        if (active) {
          setPalette(generateDerivedPalette(DEFAULT_BRANDING.primaryColor));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

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

  return {
    branding,
    palette,
    admissionsConfig: branding.admissionsConfig || DEFAULT_ADMISSIONS_CONFIG,
    minimumPaymentPercentage: branding.minimumPaymentPercentage ?? 60,
    isLoading,
    isTier1: branding.tier === 1,
    isTier2: branding.tier === 2,
  };
}