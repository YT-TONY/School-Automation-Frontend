// src/app/(intro_site)/admissions/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import { IntroActionRail } from '@/components/intro/IntroActionRail';
import { FeesCalculator } from '@/components/intro/FeesCalculator';
import { AssessmentBookingForm } from '@/components/intro/AssessmentBookingForm';
import { QuickResultModal } from '@/components/intro/QuickResultModal';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getMotifPatternSvg } from '@/utils/motifEngine';
import { formatNaira } from '@/utils/formatters';
import {
  FileCheck2,
  ClipboardList,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function AdmissionsPage() {
  const { branding, admissionsConfig, minimumPaymentPercentage, isLoading } = useSchoolTheme();
  const [isQuickResultOpen, setIsQuickResultOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<{
    classId: string;
    className: string;
    residency: 'DAY' | 'BOARDING';
    estimatedTotal: number;
  } | null>(null);

  const bookingSectionRef = useRef<HTMLDivElement | null>(null);

  const handleProceedToBook = (selection: {
    classId: string;
    className: string;
    residency: 'DAY' | 'BOARDING';
    estimatedTotal: number;
  }) => {
    setSelectedQuote(selection);
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const patternSvg = getMotifPatternSvg(branding.motif || 'collegiate-stripe', '#FFFFFF');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/60">
      {/* Top Institutional Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5">
            <Image
              src={branding.logoUrl || '/watermarks/default_crest_watermark.svg'}
              alt={branding.schoolName}
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              unoptimized
            />
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight uppercase tracking-tight">
                {branding.schoolName}
              </h1>
              {branding.motto && <p className="text-xs text-slate-500 font-medium">{branding.motto}</p>}
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-3.5 h-3.5" /> Home
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => setIsQuickResultOpen(true)}>
              Check Result
            </Button>
          </div>
        </div>
      </header>

      {/* Admissions Hero Banner */}
      <section
        className="relative overflow-hidden py-12 sm:py-16 px-4 sm:px-6 text-textOnPrimary"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.09] pointer-events-none"
          style={{
            backgroundImage: `url("${patternSvg}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {admissionsConfig.isOpen
              ? `${admissionsConfig.academicSession} Admissions Now Open`
              : `${admissionsConfig.academicSession} Admissions Portal`}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Admissions, Fees & Entrance Assessment
          </h2>
          <p className="text-xs sm:text-sm text-textOnPrimary/90 max-w-2xl leading-relaxed">
            Explore our transparent termly fee breakdown, review entry requirements, and schedule an
            entrance screening appointment for your ward.
          </p>
        </div>
      </section>

      {/* Main 2-Column Editorial Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row gap-8 w-full">
        {/* Left Action Rail */}
        <IntroActionRail onOpenQuickResult={() => setIsQuickResultOpen(true)} />

        {/* Right Admissions Workspace */}
        <div className="flex-1 space-y-8 min-w-0">
          {/* Dynamic Admission Process Steps */}
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5" /> Step-by-Step Guide
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Admission Procedure</h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primarySubtle text-primary border border-primaryBorder self-start sm:self-auto">
                Application Fee: {formatNaira(admissionsConfig.applicationFormFee)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {admissionsConfig.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="h-7 w-7 rounded-lg bg-primary text-textOnPrimary text-xs font-extrabold flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    {step.timeline && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200/70">
                        {step.timeline}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Dynamic Eligibility & Required Credentials */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-primary" /> Eligibility & Required Documents
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                {admissionsConfig.ageAndEligibilityNote}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {admissionsConfig.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Interactive School Fees Calculator */}
          <FeesCalculator
            schoolName={branding.schoolName}
            admissionsConfig={admissionsConfig}
            minimumPaymentPercentage={minimumPaymentPercentage}
            onProceedToBook={handleProceedToBook}
          />

          {/* Assessment & Interview Scheduling Form */}
          <div ref={bookingSectionRef} className="scroll-mt-24">
            <AssessmentBookingForm
              key={selectedQuote ? `${selectedQuote.classId}-${selectedQuote.residency}` : 'default'}
              schoolName={branding.schoolName}
              admissionsConfig={admissionsConfig}
              selectedQuote={selectedQuote}
            />
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 sm:px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {branding.schoolName}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/check-result" className="hover:text-white transition-colors">Check Result</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

      <QuickResultModal isOpen={isQuickResultOpen} onClose={() => setIsQuickResultOpen(false)} />
    </div>
  );
}