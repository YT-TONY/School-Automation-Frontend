// src/components/intro/WhyUsSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface WhyUsSectionProps {
  schoolName: string;
  title: string;
  body: string;
  storyImage: string;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({
  schoolName,
  title,
  body,
  storyImage,
}) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Overview</span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">{title}</h2>
        </div>

        <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-100">
          <Image
            src={storyImage}
            alt={schoolName}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-4">
          <p>{body}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primarySubtle border border-primaryBorder shrink-0">
              <Compass className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Moral Discipline</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Character-first spiritual and ethical upbringing.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primarySubtle border border-primaryBorder shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Academic Rigor</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Comprehensive STEM and arts curricula.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-primarySubtle border border-primaryBorder shrink-0">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Secure Boarding</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Safe living environments with pastoral care.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};