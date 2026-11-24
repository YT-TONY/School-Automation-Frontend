// src/app/(portal)/dashboard/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import {
  Users,
  BookOpenCheck,
  CreditCard,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function PortalDashboardPage() {
  const { user } = useAuth();
  const { branding } = useSchoolTheme();
  const role = user?.role || 'SCHOOL_ADMIN';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primarySubtle text-primary border border-primaryBorder uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> {role.replace(/_/g, ' ')}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome back, {user?.fullName || 'Administrator'}
          </h1>
          <p className="text-xs text-slate-500">
            {branding.schoolName} • Operating Workspace
          </p>
        </div>
      </div>

      {role === 'PARENT' ? (
        <Card className="p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Parent Multi-Ward Center</h2>
          <p className="text-xs text-slate-600">
            Claim your children using their admission numbers, settle combined term fees with one flat ₦1,000 convenience fee, and view published report cards.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/fees">
              <Button size="sm">
                Manage Wards & Batch Fees <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 space-y-3">
            <div className="p-2.5 rounded-xl bg-primarySubtle text-primary w-fit">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Directory</h3>
              <p className="text-xs text-slate-500 mt-0.5">Enroll students & upload report card passports</p>
            </div>
            <Link href="/students" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              Open Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">CA & Exam Scores</h3>
              <p className="text-xs text-slate-500 mt-0.5">Batch subject score entry & approval pipeline</p>
            </div>
            <Link href="/academic/score-entry" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              Enter Scores <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 w-fit">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Class Broadsheets</h3>
              <p className="text-xs text-slate-500 mt-0.5">Compile class averages & export broadsheets</p>
            </div>
            <Link href="/academic/broadsheet" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              View Broadsheets <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 w-fit">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bursary & Invoices</h3>
              <p className="text-xs text-slate-500 mt-0.5">Track termly fee collections & Paystack splits</p>
            </div>
            <Link href="/fees" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              Open Bursary <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
}