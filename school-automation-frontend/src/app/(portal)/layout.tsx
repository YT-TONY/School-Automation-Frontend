// src/app/(portal)/layout.tsx

'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/portal/Sidebar';
import { TopHeader } from '@/components/portal/TopHeader';

export default function PortalShellLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50/60">
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </div>
    </div>
  );
}