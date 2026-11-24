// src/components/intro/IntroActionRail.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import { getMotifPatternSvg } from '@/utils/motifEngine';
import { Card } from '@/components/ui/Card';
import { CalendarClock, GraduationCap, KeyRound, ExternalLink, ChevronRight } from 'lucide-react';

interface IntroActionRailProps {
  onOpenQuickResult: () => void;
}

export const IntroActionRail: React.FC<IntroActionRailProps> = ({ onOpenQuickResult }) => {
  const { branding } = useSchoolTheme();
  const patternSvg = getMotifPatternSvg(branding.motif || 'collegiate-stripe', '#FFFFFF');

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
      {/* Primary Tile: Plan a Visit */}
      <Link href="/admissions" className="block">
        <div
          className="relative overflow-hidden rounded-2xl p-6 text-textOnPrimary shadow-md transition-all hover:shadow-lg active:scale-[0.99] cursor-pointer"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.09] pointer-events-none"
            style={{
              backgroundImage: `url("${patternSvg}")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '36px 36px',
            }}
          />
          <div className="relative z-10 flex flex-col justify-between min-h-27.5">
            <div className="flex items-center justify-between">
              <CalendarClock className="w-6 h-6 text-textOnPrimary/90" />
              <ChevronRight className="w-4 h-4 opacity-75" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">Plan a visit to</h3>
              <p className="text-sm font-medium opacity-90 truncate">{branding.schoolName}</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Secondary Tile: Apply for Admission */}
      <Link href="/admissions" className="block">
        <div
          className="relative overflow-hidden rounded-2xl p-6 text-textOnPrimary shadow-md transition-all hover:shadow-lg active:scale-[0.99]"
          style={{ backgroundColor: 'var(--color-primary-hover)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: `url("${patternSvg}")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '36px 36px',
            }}
          />
          <div className="relative z-10 flex flex-col justify-between min-h-27.5">
            <div className="flex items-center justify-between">
              <GraduationCap className="w-6 h-6 text-textOnPrimary/90" />
              <ChevronRight className="w-4 h-4 opacity-75" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">Apply to</h3>
              <p className="text-sm font-medium opacity-90 truncate">{branding.schoolName}</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Tertiary Action Tile: Result Verification Gate */}
      <div
        onClick={onOpenQuickResult}
        className="relative overflow-hidden rounded-2xl p-5 border border-primaryBorder bg-primarySubtle text-primary transition-all hover:bg-primaryBorder/20 active:scale-[0.99] cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white shadow-xs">
            <KeyRound className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm tracking-tight text-slate-900">Online Result Gate</h4>
            <p className="text-xs text-slate-500 truncate">Check terminal broadsheets with PIN</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Quick Links Card */}
      <Card className="p-5 space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Links</h4>
        <ul className="space-y-2 text-xs font-medium text-slate-600 divide-y divide-slate-100">
          <li className="pt-2 first:pt-0">
            <Link href="/about" className="flex items-center justify-between hover:text-primary transition-colors">
              <span>About & History</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </li>
          <li className="pt-2">
            <Link href="/admissions" className="flex items-center justify-between hover:text-primary transition-colors">
              <span>Fees Calculator & Admission</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </li>
          <li className="pt-2">
            <Link href="/buy-pin" className="flex items-center justify-between hover:text-primary transition-colors">
              <span>Buy Scratch Card PIN</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </li>
          <li className="pt-2">
            <Link href="/contact" className="flex items-center justify-between hover:text-primary transition-colors">
              <span>Contact & Directions</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </li>
          <li className="pt-2">
            <Link href="/login" className="flex items-center justify-between text-primary font-semibold hover:underline">
              <span>Staff & Student Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </li>
        </ul>
      </Card>
    </aside>
  );
};