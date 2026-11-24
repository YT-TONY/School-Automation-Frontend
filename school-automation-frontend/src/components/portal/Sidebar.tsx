// src/components/portal/Sidebar.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  BookOpenCheck,
  FileSpreadsheet,
  CreditCard,
  BedDouble,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { branding } = useSchoolTheme();
  const { user, logout } = useAuth();

  const role = user?.role || 'SCHOOL_ADMIN';

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ALL'],
    },
    {
      label: 'Students & Passports',
      href: '/students',
      icon: Users,
      roles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL_ADMIN', 'FORM_TEACHER'],
    },
    {
      label: 'Score Entry',
      href: '/academic/score-entry',
      icon: BookOpenCheck,
      roles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL_ACADEMIC', 'TEACHER', 'FORM_TEACHER'],
    },
    {
      label: 'Class Broadsheet',
      href: '/academic/broadsheet',
      icon: FileSpreadsheet,
      roles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL_ACADEMIC', 'FORM_TEACHER'],
    },
    {
      label: 'Fees & Receipts',
      href: '/fees',
      icon: CreditCard,
      roles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL_ADMIN', 'PARENT', 'STUDENT'],
    },
    {
      label: 'Hostels & Bedspaces',
      href: '/hostels',
      icon: BedDouble,
      roles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL_ADMIN'],
    },
    {
      label: 'Portal Settings',
      href: '/admin/settings',
      icon: Settings,
      roles: ['SCHOOL_ADMIN', 'PRINCIPAL'],
    },
  ];

  const visibleItems = navItems.filter(
    (item) => item.roles.includes('ALL') || item.roles.includes(role)
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 w-64">
      {/* School Brand Header */}
      <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <Image
            src={branding.logoUrl || '/watermarks/default_crest_watermark.svg'}
            alt={branding.schoolName}
            width={34}
            height={34}
            className="h-8 w-8 object-contain shrink-0"
            unoptimized
          />
          <div className="truncate">
            <p className="text-xs font-extrabold text-slate-900 uppercase tracking-tight truncate">
              {branding.schoolName}
            </p>
            <p className="text-[10px] font-semibold text-primary">Tier {branding.tier} OS</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3.5 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-textOnPrimary shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom User & Sign Out */}
      <div className="p-3.5 border-t border-slate-100 space-y-2">
        <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60">
          <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName || 'Portal User'}</p>
          <p className="text-[10px] font-mono text-slate-500 uppercase">{role.replace(/_/g, ' ')}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            onCloseMobile();
            router.push('/login');
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block shrink-0">{sidebarContent}</div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};