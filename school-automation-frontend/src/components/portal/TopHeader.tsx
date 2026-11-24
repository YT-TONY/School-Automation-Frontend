// src/components/portal/TopHeader.tsx

'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, Bell } from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white/90 backdrop-blur border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <p className="text-xs font-semibold text-slate-500">Academic Session: 2025/2026 • First Term</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primarySubtle border border-primaryBorder text-primary flex items-center justify-center text-xs font-extrabold">
          {(user?.fullName || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};