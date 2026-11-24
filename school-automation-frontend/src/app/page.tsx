// src/app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import { Button } from '@/components/ui/Button';
import { IntroActionRail } from '@/components/intro/IntroActionRail';
import { HeroSlider } from '@/components/intro/HeroSlider';
import { WhyUsSection } from '@/components/intro/WhyUsSection';
import { QuickResultModal } from '@/components/intro/QuickResultModal';
import { getMotifPatternSvg } from '@/utils/motifEngine';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

export default function DynamicHomePage() {
  const router = useRouter();
  const { branding, isLoading, isTier1 } = useSchoolTheme();
  const [isQuickResultOpen, setIsQuickResultOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !branding.hasIntroWebsite) {
      if (isTier1) {
        router.replace('/check-result');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, branding.hasIntroWebsite, isTier1, router]);

  if (isLoading || !branding.hasIntroWebsite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const config = branding.introConfig || {
    heroTitle: 'Excellence in Character & Knowledge',
    heroSubtitle: 'Nurturing future leaders through holistic academic and moral formation.',
    heroImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1600',
    overviewStory: {
      title: `Why ${branding.schoolName}?`,
      body: `${branding.schoolName} provides a serene, academically rigorous, and spiritually grounding environment designed to empower primary and secondary school students. Our dual emphasis on technological aptitude and foundational discipline equips students to thrive in higher learning institutions globally.`,
      storyImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200',
    },
    featureCards: [],
    contactEmail: 'admissions@school.edu.ng',
    contactPhone: '+234 803 123 4567',
    address: 'Plot 4, Educational Corridor, Off Main Expressway',
  };

  const patternSvg = getMotifPatternSvg(branding.motif || 'collegiate-stripe', '#FFFFFF');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/60">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
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
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsQuickResultOpen(true)}>
              Check Result
            </Button>
            <Link href="/buy-pin">
              <Button size="sm">Buy Scratch PIN</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <HeroSlider
        title={config.heroTitle}
        subtitle={config.heroSubtitle}
        imageUrl={config.heroImage}
      />

      {/* Main 2-Column Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row gap-8 w-full">
        {/* Left Action Rail */}
        <IntroActionRail onOpenQuickResult={() => setIsQuickResultOpen(true)} />

        {/* Right Editorial Canvas */}
        <div className="flex-1 space-y-10 min-w-0">
          <WhyUsSection
            schoolName={branding.schoolName}
            title={config.overviewStory.title}
            body={config.overviewStory.body}
            storyImage={config.overviewStory.storyImage}
          />
        </div>
      </main>

      {/* Full-Width Ribbon CTA with Brand Motif */}
      <section
        className="relative overflow-hidden py-10 px-4 text-textOnPrimary text-center"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("${patternSvg}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Schedule a Visit to {branding.schoolName}
          </h2>
          <p className="text-xs sm:text-sm text-textOnPrimary/85 max-w-xl mx-auto leading-relaxed">
            Experience our academic facilities, meet the principal, and tour our laboratories first-hand.
          </p>
          <div className="pt-2">
            <Link href="/contact">
              <Button
                variant="secondary"
                size="md"
                className="bg-white text-slate-900 hover:bg-slate-100 border-none shadow-md"
              >
                Contact Admissions Desk <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src={branding.logoUrl || '/watermarks/default_crest_watermark.svg'}
                alt={branding.schoolName}
                width={36}
                height={36}
                className="h-9 w-9 object-contain brightness-200"
                unoptimized
              />
              <span className="font-bold text-white uppercase tracking-tight">{branding.schoolName}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">{branding.motto}</p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Portal Services</h4>
            <ul className="space-y-2">
              <li><Link href="/check-result" className="hover:text-white transition-colors">Check Academic Result</Link></li>
              <li><Link href="/buy-pin" className="hover:text-white transition-colors">Buy Scratch Card PIN</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Student & Staff Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Admissions & Info</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">History & Mission</Link></li>
              <li><Link href="/admissions" className="hover:text-white transition-colors">Fees Calculator & Assessment</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Directions & Campus Visits</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Contact</h4>
            <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" /> {config.address}</p>
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0 text-slate-500" /> {config.contactPhone}</p>
            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0 text-slate-500" /> {config.contactEmail}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {branding.schoolName}. All rights reserved.</p>
          <p>Powered by Multi-Tenant School Automation Platform OS.</p>
        </div>
      </footer>

      <QuickResultModal isOpen={isQuickResultOpen} onClose={() => setIsQuickResultOpen(false)} />
    </div>
  );
}