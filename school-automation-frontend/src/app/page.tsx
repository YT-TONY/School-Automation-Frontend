// src/app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { QuickResultModal } from '@/components/intro/QuickResultModal';
import { CheckCircle2, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';

export default function DynamicHomePage() {
  const router = useRouter();
  const { branding, isLoading, isTier1 } = useSchoolTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={branding.logoUrl || '/watermarks/default_crest_watermark.svg'}
              alt={branding.schoolName}
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              unoptimized
            />
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">{branding.schoolName}</h1>
              {branding.motto && <p className="text-xs text-slate-500">{branding.motto}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
              Quick Check
            </Button>
            <Link href="/buy-pin">
              <Button size="sm">Buy Scratch PIN</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primarySubtle border border-primaryBorder text-primary text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" /> Official Academic Result Gateway
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Verify Academic Credentials & Terminal Report Cards
        </h2>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Access authenticated terminal broadsheets and official score transcripts directly using your
          school scratch PIN voucher.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/check-result" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">
              Enter Verification Gate <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/buy-pin" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full">
              <CreditCard className="w-4 h-4" /> Purchase PIN Online
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <h3 className="font-semibold text-slate-900">Instant Verification</h3>
          <p className="text-xs text-slate-500">
            Validated directly against school database records without administrative delay.
          </p>
        </Card>
        <Card className="p-6 space-y-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <h3 className="font-semibold text-slate-900">Anti-Tamper Security</h3>
          <p className="text-xs text-slate-500">
            Protected with single-engine scratch PIN vouchers restricting unauthorized access.
          </p>
        </Card>
        <Card className="p-6 space-y-2">
          <CreditCard className="w-6 h-6 text-amber-600" />
          <h3 className="font-semibold text-slate-900">Online PIN Checkout</h3>
          <p className="text-xs text-slate-500">
            Instant scratch card PIN delivery powered by Paystack automated banking integration.
          </p>
        </Card>
      </section>

      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {branding.schoolName}. Powered by School Automation OS.
      </footer>

      <QuickResultModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}