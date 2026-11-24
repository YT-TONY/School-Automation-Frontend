// src/components/intro/HeroSlider.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface HeroSliderProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ title, subtitle, imageUrl }) => {
  return (
    <div className="relative w-full h-70 sm:h-85 md:h-100 overflow-hidden bg-slate-900">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover opacity-60"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 flex flex-col justify-end pb-8 sm:pb-12 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-xs">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl font-normal drop-shadow-xs">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};