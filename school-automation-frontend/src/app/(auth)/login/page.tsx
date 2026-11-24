// src/app/(auth)/login/page.tsx

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { Lock, Mail, AlertCircle, Shield, ArrowLeft } from 'lucide-react';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { branding } = useSchoolTheme();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSuperAdminMode, setIsSuperAdminMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const { token, user } = await authService.login(username, password, {
        isSuperAdmin: isSuperAdminMode,
      });

      login(token, {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
      });

      if (user.role === 'SUPER_ADMIN') {
        router.push('/super-admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(
        error.response?.data?.detail ||
          'Authentication failed. Verify your credentials and school portal domain.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Image
          src={branding.logoUrl || '/watermarks/default_crest_watermark.svg'}
          alt={branding.schoolName}
          width={64}
          height={64}
          className="mx-auto h-16 w-16 object-contain"
          unoptimized
        />
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {isSuperAdminMode ? 'SaaS Control Tower Login' : `${branding.schoolName} Portal`}
        </h1>
        <p className="text-xs text-slate-500">
          {isSuperAdminMode
            ? 'Global multi-tenant platform administration access'
            : 'Sign in for Staff, Teachers, Parents & Students'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-700">
            <div>
              <label className="block mb-1">
                {isSuperAdminMode ? 'Super Admin Email' : 'Email or Admission Number'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder={isSuperAdminMode ? 'superadmin@platform.ng' : 'user@school.edu.ng'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Sign In to Workspace
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link href="/" className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> School Home
            </Link>

            <button
              type="button"
              onClick={() => setIsSuperAdminMode((prev) => !prev)}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-primary font-medium transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              {isSuperAdminMode ? 'Switch to School Portal' : 'Platform Admin'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}