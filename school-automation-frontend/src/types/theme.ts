// src/types/theme.ts
export type BrandMotif =
  | 'collegiate-stripe'
  | 'heritage-quatrefoil'
  | 'tech-grid'
  | 'organic-topo'
  | 'minimal-dots';

export interface AdmissionStep {
  stepNumber: number;
  title: string;
  description: string;
  timeline?: string;
}

export interface FeeLineItem {
  id: string;
  label: string;
  amount: number;
  frequency: 'PER_TERM' | 'ONE_TIME_ENTRY' | 'ANNUAL';
}

export interface ClassFeeSchedule {
  classId: string;
  className: string;
  category: 'NURSERY' | 'PRIMARY' | 'JUNIOR_SECONDARY' | 'SENIOR_SECONDARY';
  tuitionAndCompulsory: FeeLineItem[];
  boardingAvailable: boolean;
  boardingFeePerTerm: number;
}

export interface OptionalFeeAddon {
  id: string;
  label: string;
  description: string;
  amount: number;
  frequency: 'PER_TERM' | 'ONE_TIME_ENTRY';
}

export interface AssessmentSlot {
  id: string;
  dateLabel: string;
  isoDate: string;
  timeWindow: string;
  venue: string;
  seatsRemaining: number;
}

export interface AdmissionsConfig {
  isOpen: boolean;
  academicSession: string;
  applicationFormFee: number;
  ageAndEligibilityNote: string;
  requiredDocuments: string[];
  steps: AdmissionStep[];
  feeSchedules: ClassFeeSchedule[];
  optionalAddons: OptionalFeeAddon[];
  assessmentSlots: AssessmentSlot[];
}

export interface IntroSiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  overviewStory: {
    title: string;
    body: string;
    storyImage: string;
  };
  featureCards: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface SchoolBranding {
  schoolName: string;
  motto?: string;
  logoUrl: string;
  watermarkUrl: string;
  primaryColor: string;
  accentColor?: string;
  motif?: BrandMotif;
  tier: 1 | 2;
  hasIntroWebsite: boolean;
  minimumPaymentPercentage?: number;
  introConfig?: IntroSiteConfig;
  admissionsConfig?: AdmissionsConfig;
}

export interface DerivedPalette {
  primary: string;
  primaryHover: string;
  primarySubtle: string;
  primaryBorder: string;
  textOnPrimary: string;
}