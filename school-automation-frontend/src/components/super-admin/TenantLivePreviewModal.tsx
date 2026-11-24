// src/components/super-admin/TenantLivePreviewModal.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { SchoolBranding } from '@/types/theme';
import { generateDerivedPalette } from '@/utils/colorEngine';
import { getMotifPatternSvg } from '@/utils/motifEngine';
import { Button } from '@/components/ui/Button';
import {
  X,
  Monitor,
  Smartphone,
  Globe,
  KeyRound,
  Lock,
  Calculator,
  CalendarClock,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Rocket,
} from 'lucide-react';

interface TenantLivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: SchoolBranding;
  onDeployClick: () => void;
  isDeploying: boolean;
}

type PreviewSurface = 'INTRO_HOME' | 'ADMISSIONS' | 'PIN_GATE' | 'PORTAL_LOGIN';

export const TenantLivePreviewModal: React.FC<TenantLivePreviewModalProps> = ({
  isOpen,
  onClose,
  branding,
  onDeployClick,
  isDeploying,
}) => {
  const [viewport, setViewport] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');
  const [surface, setSurface] = useState<PreviewSurface>(
    branding.hasIntroWebsite ? 'INTRO_HOME' : branding.tier === 1 ? 'PIN_GATE' : 'PORTAL_LOGIN'
  );

  const palette = useMemo(
    () => generateDerivedPalette(branding.primaryColor || '#1E3A8A'),
    [branding.primaryColor]
  );

  const patternSvg = useMemo(
    () => getMotifPatternSvg(branding.motif || 'collegiate-stripe', '#FFFFFF'),
    [branding.motif]
  );

  if (!isOpen) return null;

  const activeSurface: PreviewSurface =
    !branding.hasIntroWebsite && (surface === 'INTRO_HOME' || surface === 'ADMISSIONS')
      ? branding.tier === 1
        ? 'PIN_GATE'
        : 'PORTAL_LOGIN'
      : surface;

  const intro = branding.introConfig;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-md">
      {/* Top Lovable-Style Studio Bar */}
      <div className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 text-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div className="truncate">
            <p className="text-xs font-bold tracking-tight truncate">
              Live Tenant Preview — {branding.schoolName || 'Untitled School'}
            </p>
            <p className="text-[11px] text-slate-400">
              Tier {branding.tier} • {branding.motif} • {branding.primaryColor}
            </p>
          </div>
        </div>

        {/* Surface Switcher Pills */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/70 text-xs">
          {branding.hasIntroWebsite && (
            <>
              <button
                type="button"
                onClick={() => setSurface('INTRO_HOME')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                  activeSurface === 'INTRO_HOME'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> Intro Site
              </button>
              <button
                type="button"
                onClick={() => setSurface('ADMISSIONS')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                  activeSurface === 'ADMISSIONS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" /> Admissions
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setSurface('PIN_GATE')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeSurface === 'PIN_GATE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> PIN Gate
          </button>
          <button
            type="button"
            onClick={() => setSurface('PORTAL_LOGIN')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeSurface === 'PORTAL_LOGIN'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Portal Login
          </button>
        </div>

        {/* Viewport & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/70">
            <button
              type="button"
              onClick={() => setViewport('DESKTOP')}
              title="Desktop Viewport"
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === 'DESKTOP' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('MOBILE')}
              title="Mobile Viewport"
              className={`p-1.5 rounded-lg transition-colors ${
                viewport === 'MOBILE' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <Button size="sm" onClick={onDeployClick} isLoading={isDeploying}>
            <Rocket className="w-3.5 h-3.5" /> Deploy Now
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Canvas Frame */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          className={`relative bg-slate-50 text-slate-900 rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden transition-all duration-300 ${
            viewport === 'MOBILE' ? 'w-97.5 min-h-190' : 'w-full max-w-6xl min-h-170'
          }`}
        >
          {/* Simulated Browser Address Bar */}
          <div className="h-9 bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="px-3 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[10px] text-slate-700 truncate max-w-xs">
              https://{(branding.schoolName || 'school').toLowerCase().replace(/[^a-z0-9]/g, '')}.schoolportal.ng
              {activeSurface === 'ADMISSIONS'
                ? '/admissions'
                : activeSurface === 'PIN_GATE'
                ? '/check-result'
                : activeSurface === 'PORTAL_LOGIN'
                ? '/login'
                : '/'}
            </div>
            <span className="font-semibold text-[10px] uppercase">Tier {branding.tier}</span>
          </div>

          {/* Ambient Rotated Watermark Inside Preview */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
            style={{
              backgroundImage: `url("${branding.watermarkUrl || '/watermarks/default_crest_watermark.svg'}")`,
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center',
              backgroundSize: '180px 180px',
              transform: 'rotate(-15deg) scale(1.1)',
            }}
          />

          {/* SURFACE 1: DYNAMIC INTRO SITE */}
          {activeSurface === 'INTRO_HOME' && (
            <div className="relative z-10">
              {/* Top Header */}
              <div className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={branding.logoUrl || '/watermarks/default_crest_watermark.svg'}
                    alt={branding.schoolName}
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                    unoptimized
                  />
                  <div>
                    <p className="font-bold text-sm text-slate-900 uppercase leading-tight">
                      {branding.schoolName || 'School Name'}
                    </p>
                    <p className="text-[10px] text-slate-500">{branding.motto}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                  >
                    Buy Scratch PIN
                  </span>
                </div>
              </div>

              {/* Hero Banner */}
              <div className="relative h-56 bg-slate-900 flex items-end p-6 text-white">
                {intro?.heroImage && (
                  <Image
                    src={intro.heroImage}
                    alt="Hero"
                    fill
                    className="object-cover opacity-55"
                    unoptimized
                  />
                )}
                <div className="relative z-10 space-y-1 max-w-xl">
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    {intro?.heroTitle || 'Excellence in Character & Knowledge'}
                  </h2>
                  <p className="text-xs text-slate-200">
                    {intro?.heroSubtitle || 'Nurturing future leaders through holistic academic formation.'}
                  </p>
                </div>
              </div>

              {/* 2-Column Editorial Preview */}
              <div
                className={`p-6 grid gap-6 ${
                  viewport === 'MOBILE' ? 'grid-cols-1' : 'grid-cols-12'
                }`}
              >
                {/* Left Action Rail */}
                <div className={viewport === 'MOBILE' ? 'space-y-3' : 'col-span-4 space-y-3'}>
                  <div
                    className="relative overflow-hidden rounded-xl p-4"
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.1]"
                      style={{ backgroundImage: `url("${patternSvg}")`, backgroundSize: '32px 32px' }}
                    />
                    <CalendarClock className="w-5 h-5 mb-2" />
                    <p className="text-sm font-bold">Plan a visit to</p>
                    <p className="text-xs opacity-90">{branding.schoolName}</p>
                  </div>

                  <div
                    className="relative overflow-hidden rounded-xl p-4"
                    style={{ backgroundColor: palette.primaryHover, color: palette.textOnPrimary }}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{ backgroundImage: `url("${patternSvg}")`, backgroundSize: '32px 32px' }}
                    />
                    <GraduationCap className="w-5 h-5 mb-2" />
                    <p className="text-sm font-bold">Apply to</p>
                    <p className="text-xs opacity-90">{branding.schoolName}</p>
                  </div>
                </div>

                {/* Right Story Card */}
                <div
                  className={`bg-white rounded-xl border border-slate-200 p-5 space-y-3 ${
                    viewport === 'MOBILE' ? '' : 'col-span-8'
                  }`}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: palette.primary }}
                  >
                    Overview
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {intro?.overviewStory.title || `Why ${branding.schoolName}?`}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {intro?.overviewStory.body ||
                      'Our dual emphasis on technological aptitude and foundational discipline equips students to thrive globally.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SURFACE 2: ADMISSIONS & FEES PREVIEW */}
          {activeSurface === 'ADMISSIONS' && (
            <div className="relative z-10 p-6 space-y-5">
              <div
                className="relative overflow-hidden rounded-2xl p-6"
                style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
              >
                <div
                  className="absolute inset-0 opacity-[0.1]"
                  style={{ backgroundImage: `url("${patternSvg}")`, backgroundSize: '36px 36px' }}
                />
                <h2 className="text-xl font-extrabold relative z-10">
                  Admissions, Dynamic Fees Calculator & Assessment Booking
                </h2>
                <p className="text-xs opacity-90 mt-1 relative z-10">
                  Parents can calculate exact Day/Boarding packages and book entrance exam dates online.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">Sample Live Quote: JSS 1 (Day Student)</p>
                  <span
                    className="text-sm font-extrabold"
                    style={{ color: palette.primary }}
                  >
                    ₦240,000 / 1st Term
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Synced directly with {branding.schoolName} Bursary Schedule
                </div>
              </div>
            </div>
          )}

          {/* SURFACE 3: TIER 1 PIN RESULT GATE */}
          {activeSurface === 'PIN_GATE' && (
            <div className="relative z-10 py-12 px-4 flex flex-col items-center">
              <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="text-center space-y-2">
                  <Image
                    src={branding.logoUrl || '/watermarks/default_crest_watermark.svg'}
                    alt={branding.schoolName}
                    width={48}
                    height={48}
                    className="mx-auto h-12 w-12 object-contain"
                    unoptimized
                  />
                  <h3 className="text-base font-bold text-slate-900">Check Student Result</h3>
                  <p className="text-[11px] text-slate-500">{branding.schoolName}</p>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                    Admission Number (e.g. STG/2026/001)
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                    12-Digit Scratch PIN
                  </div>
                  <div
                    className="w-full py-2.5 rounded-xl text-center font-semibold shadow-xs"
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                  >
                    Verify & View Score Sheet
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SURFACE 4: PORTAL LOGIN */}
          {activeSurface === 'PORTAL_LOGIN' && (
            <div className="relative z-10 py-12 px-4 flex flex-col items-center">
              <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="text-center space-y-2">
                  <ShieldCheck className="w-10 h-10 mx-auto" style={{ color: palette.primary }} />
                  <h3 className="text-base font-bold text-slate-900">{branding.schoolName} Portal</h3>
                  <p className="text-[11px] text-slate-500">
                    Unified Login for Admin, Staff, Parents & Students
                  </p>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                    Email or Admission ID
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                    Password
                  </div>
                  <div
                    className="w-full py-2.5 rounded-xl text-center font-semibold shadow-xs"
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                  >
                    Sign In to Workspace
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};