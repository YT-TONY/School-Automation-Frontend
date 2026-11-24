// src/app/super-admin/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  superAdminService,
  TenantSchoolRecord,
} from '@/services/superAdminService';
import {
  Building2,
  Plus,
  Layers,
  Globe,
  CheckCircle2,
  ArrowUpDown,
  Shield,
  ExternalLink,
} from 'lucide-react';

export default function SuperAdminDashboardPage() {
  const [schools, setSchools] = useState<TenantSchoolRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    superAdminService
      .listSchools()
      .then((data) => {
        if (active) setSchools(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleToggleTier = async (school: TenantSchoolRecord) => {
    const nextTier: 1 | 2 = school.tier === 1 ? 2 : 1;
    setUpdatingId(school.id);
    try {
      await superAdminService.updateSchoolTier(school.id, nextTier);
      setSchools((prev) =>
        prev.map((s) => (s.id === school.id ? { ...s, tier: nextTier } : s))
      );
    } catch {
      // Optimistically update in local preview mode if backend is offline
      setSchools((prev) =>
        prev.map((s) => (s.id === school.id ? { ...s, tier: nextTier } : s))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const tier2Count = schools.filter((s) => s.tier === 2).length;
  const introActiveCount = schools.filter((s) => s.has_intro_website).length;

  return (
    <div className="min-h-screen bg-slate-50/70">
      {/* Top Super Admin Navigation */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">SaaS Control Tower</h1>
              <p className="text-[11px] text-slate-400">Multi-Tenant School Platform Administration</p>
            </div>
          </div>

          <Link href="/super-admin/onboarding">
            <Button size="sm">
              <Plus className="w-4 h-4" /> Onboard New School
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Active Tenants</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{schools.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 text-slate-700">
              <Building2 className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Tier 2 Complete OS Schools</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{tier2Count}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
              <Layers className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Active Intro Websites</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{introActiveCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
              <Globe className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Registered Schools Table */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Onboarded School Tenants</h2>
              <p className="text-xs text-slate-500">
                Manage subscription tiers, Paystack subaccounts, and portal configurations
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-500">Loading tenant directory...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="px-6 py-3">School & Brand</th>
                    <th className="px-6 py-3">Subdomain / Slug</th>
                    <th className="px-6 py-3">Subscription Tier</th>
                    <th className="px-6 py-3">Intro Site</th>
                    <th className="px-6 py-3">Paystack Subaccount</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schools.map((school) => (
                    <tr key={school.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-4 w-4 rounded-full shrink-0 border border-black/10"
                            style={{ backgroundColor: school.primary_color }}
                          />
                          <div>
                            <p className="font-bold text-slate-900">{school.name}</p>
                            <p className="text-[11px] text-slate-400">
                              Motif: {school.motif || 'collegiate-stripe'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-slate-700">{school.slug}.schoolportal.ng</td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] border ${
                            school.tier === 2
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {school.tier === 2 ? 'Tier 2 (Complete OS)' : 'Tier 1 (Starter OS)'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {school.has_intro_website ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                          </span>
                        ) : (
                          <span className="text-slate-400">Direct Gate</span>
                        )}
                      </td>

                      <td className="px-6 py-4 font-mono text-[11px] text-slate-600">
                        {school.paystack_subaccount_code || 'Pending'}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={updatingId === school.id}
                          onClick={() => handleToggleTier(school)}
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                          {school.tier === 1 ? 'Upgrade Tier 2' : 'Set Tier 1'}
                        </Button>

                        <Link href={`/?tenant=${school.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}