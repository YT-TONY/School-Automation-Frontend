// src/components/ui/WatermarkOverlay.tsx
'use client';

import React from 'react';

export const WatermarkOverlay: React.FC = () => {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <div
        className="w-full h-full opacity-[0.035]"
        style={{
          backgroundImage: 'var(--school-watermark-url)',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          backgroundSize: '220px 220px',
          transform: 'rotate(-15deg) scale(1.15)',
        }}
      />
    </div>
  );
};