// src/app/(intro_site)/about/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import { Card } from '@/components/ui/Card';
import { BookOpen, Target, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  const { branding } = useSchoolTheme();

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">About Our Institution</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            History, Mission & Vision of {branding.schoolName}
          </h1>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 leading-relaxed text-sm text-slate-600">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Foundational Heritage</h2>
            <p>
              Founded on the pillars of discipline, academic rigor, and moral grounding, {branding.schoolName} has served
              as a beacon of secondary education. Our curriculum combines state and national standards with modern technological
              literacy to ensure students are prepared for higher education and global careers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Target className="w-4 h-4 text-primary" /> Our Mission
              </div>
              <p className="text-xs text-slate-500">
                To foster intellectual curiosity, moral responsibility, and leadership qualities in every child.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <BookOpen className="w-4 h-4 text-primary" /> Our Vision
              </div>
              <p className="text-xs text-slate-500">
                To produce well-rounded scholars who make ethical contributions to society and their chosen professions.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}