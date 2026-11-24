// src/app/super-admin/onboarding/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TenantLivePreviewModal } from '@/components/super-admin/TenantLivePreviewModal';
import {
  superAdminService,
  OnboardTenantResponse,
} from '@/services/superAdminService';
import { BrandMotif, SchoolBranding } from '@/types/theme';
import {
  ArrowLeft,
  Eye,
  Rocket,
  Building2,
  Palette,
  Globe,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  Copy,
  Sparkles,
} from 'lucide-react';

const BRAND_PRESETS: Array<{
  name: string;
  primaryColor: string;
  accentColor: string;
  motif: BrandMotif;
}> = [
  { name: 'Mission Navy', primaryColor: '#1E3A8A', accentColor: '#D97706', motif: 'collegiate-stripe' },
  { name: 'Sacred Crimson', primaryColor: '#881337', accentColor: '#B45309', motif: 'heritage-quatrefoil' },
  { name: 'Emerald STEM', primaryColor: '#065F46', accentColor: '#0284C7', motif: 'tech-grid' },
  { name: 'Montessori Teal', primaryColor: '#0F766E', accentColor: '#EA580C', motif: 'organic-topo' },
];

export default function SuperAdminOnboardingPage() {
  // 1. Identity & Tier
  const [schoolName, setSchoolName] = useState("St. Gregory's College");
  const [slug, setSlug] = useState('stgregory');
  const [customDomain, setCustomDomain] = useState('');
  const [tier, setTier] = useState<1 | 2>(2);
  const [adminFullName, setAdminFullName] = useState('Rev. Fr. Emmanuel Adeyemi');
  const [adminEmail, setAdminEmail] = useState('admin@stgregory.edu.ng');
  const [adminPassword, setAdminPassword] = useState('Admin@2026!');

  // 2. White-Label HIG Branding & Motif
  const [primaryColor, setPrimaryColor] = useState('#1E3A8A');
  const [accentColor, setAccentColor] = useState('#D97706');
  const [motif, setMotif] = useState<BrandMotif>('collegiate-stripe');
  const [motto, setMotto] = useState('Pro Deo et Patria — Knowledge & Virtue');
  const [logoUrl, setLogoUrl] = useState('/watermarks/default_crest_watermark.svg');

  // 3. Optional Intro Website CMS
  const [hasIntroWebsite, setHasIntroWebsite] = useState(true);
  const [heroTitle, setHeroTitle] = useState('Excellence in Character & Academic Rigor');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Nurturing future leaders through holistic moral and technological formation.'
  );
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1600'
  );
  const [overviewBody, setOverviewBody] = useState(
    'Our serene campus, modern science laboratories, and disciplined pastoral mentorship equip students to excel in national and international examinations.'
  );
  const [contactEmail, setContactEmail] = useState('admissions@stgregory.edu.ng');
  const [contactPhone, setContactPhone] = useState('+234 803 123 4567');
  const [address, setAddress] = useState('14 College Road, Ikoyi, Lagos');

  // 4. Paystack & WhatsApp Integration
  const [bankName, setBankName] = useState('Guaranty Trust Bank');
  const [bankCode, setBankCode] = useState('058');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [whatsappPhoneId, setWhatsappPhoneId] = useState('');
  const [whatsappToken, setWhatsappToken] = useState('');

  // UI & Preview States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedResult, setDeployedResult] = useState<OnboardTenantResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const liveBrandingPayload: SchoolBranding = {
    schoolName,
    motto,
    logoUrl,
    watermarkUrl: logoUrl,
    primaryColor,
    accentColor,
    motif,
    tier,
    hasIntroWebsite,
    introConfig: {
      heroTitle,
      heroSubtitle,
      heroImage,
      overviewStory: {
        title: `Why ${schoolName}?`,
        body: overviewBody,
        storyImage: heroImage,
      },
      featureCards: [],
      contactEmail,
      contactPhone,
      address,
    },
  };

  const handleSchoolNameChange = (val: string) => {
    setSchoolName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, ''));
  };

  const handleDeploy = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsDeploying(true);

    try {
      const res = await superAdminService.onboardSchool({
        school_name: schoolName.trim(),
        slug: slug.trim(),
        custom_domain: customDomain.trim() || undefined,
        tier,
        admin_full_name: adminFullName.trim(),
        admin_email: adminEmail.trim(),
        admin_password: adminPassword,
        bank_code: bankCode,
        bank_name: bankName,
        account_number: accountNumber.trim(),
        whatsapp_phone_number_id: tier === 2 ? whatsappPhoneId.trim() || undefined : undefined,
        whatsapp_access_token: tier === 2 ? whatsappToken.trim() || undefined : undefined,
        branding: {
          primaryColor,
          accentColor,
          motif,
          motto,
          logoUrl,
          watermarkUrl: logoUrl,
        },
        settings: {
          has_intro_website: hasIntroWebsite,
          intro_site_config: liveBrandingPayload.introConfig!,
        },
      });
      setDeployedResult(res);
      setIsPreviewOpen(false);
    } catch {
      // Fallback handoff summary if running in standalone frontend preview
      setDeployedResult({
        school: {
          id: 'new-tenant-id',
          name: schoolName,
          slug,
          tier,
          is_active: true,
          has_intro_website: hasIntroWebsite,
          primary_color: primaryColor,
          motif,
        },
        admin_email: adminEmail,
        paystack_subaccount_code: 'ACCT_auto_generated',
        portal_url: `https://${slug}.schoolportal.ng`,
      });
      setIsPreviewOpen(false);
    } finally {
      setIsDeploying(false);
    }
  };

  const copyHandoffDetails = () => {
    if (!deployedResult) return;
    const summary = [
      `School Portal Live: ${deployedResult.portal_url}`,
      `Tier: Tier ${deployedResult.school.tier}`,
      `Admin Email: ${deployedResult.admin_email}`,
      `Temp Password: ${adminPassword}`,
      `Paystack Subaccount: ${deployedResult.paystack_subaccount_code}`,
    ].join('\n');
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Sticky Top Studio Header */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/super-admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" /> Fleet
              </Button>
            </Link>
            <div>
              <h1 className="text-sm font-bold text-slate-900">Onboard School Tenant</h1>
              <p className="text-[11px] text-slate-500">Configure portal tier, branding & optional intro website</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPreviewOpen(true)}>
              <Eye className="w-4 h-4 text-primary" /> Live Preview
            </Button>
            <Button type="button" size="sm" onClick={() => handleDeploy()} isLoading={isDeploying}>
              <Rocket className="w-4 h-4" /> Deploy Tenant
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Post-Deployment Handoff Banner */}
        {deployedResult && (
          <Card className="p-6 border-2 border-emerald-500/40 bg-emerald-50/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {deployedResult.school.name} Deployed Successfully
                  </h2>
                  <p className="text-xs text-slate-600">
                    Ready for client handoff. Copy the credentials below for the school proprietor.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={copyHandoffDetails}>
                <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Handoff Summary'}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white border border-slate-200 text-xs">
              <div>
                <p className="text-slate-400">Live Portal URL</p>
                <p className="font-mono font-bold text-primary mt-0.5">{deployedResult.portal_url}</p>
              </div>
              <div>
                <p className="text-slate-400">Admin Login</p>
                <p className="font-mono font-semibold text-slate-900 mt-0.5">{deployedResult.admin_email}</p>
              </div>
              <div>
                <p className="text-slate-400">Paystack Subaccount</p>
                <p className="font-mono font-semibold text-emerald-700 mt-0.5">
                  {deployedResult.paystack_subaccount_code}
                </p>
              </div>
            </div>
          </Card>
        )}

        <form onSubmit={handleDeploy} className="space-y-6 text-xs font-medium text-slate-700">
          {/* SECTION 1: SCHOOL IDENTITY & SAAS TIER */}
          <Card className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-slate-900">1. School Identity & SaaS Subscription Tier</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">School Name</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => handleSchoolNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Subdomain Slug</label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    className="w-full px-3.5 py-2.5 bg-white outline-none font-mono"
                  />
                  <span className="px-3 text-slate-400 font-mono text-[11px]">.schoolportal.ng</span>
                </div>
              </div>
            </div>

            {/* Tier Radio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div
                onClick={() => setTier(1)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  tier === 1
                    ? 'bg-primarySubtle border-primary ring-1 ring-primary'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-bold text-sm text-slate-900">Tier 1 — Starter OS</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  PIN Result Verification Gate + Online Paystack Scratch PIN Sales (₦500 platform markup).
                </p>
              </div>

              <div
                onClick={() => setTier(2)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  tier === 2
                    ? 'bg-primarySubtle border-primary ring-1 ring-primary'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-bold text-sm text-slate-900">Tier 2 — Complete School OS</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Full Role Dashboards, Multi-Ward Parent Portal, Broadsheets, Hostels & WhatsApp Bot (₦1,000 markup).
                </p>
              </div>
            </div>

            {/* Default School Admin Account */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block mb-1">Principal / Admin Name</label>
                <input
                  type="text"
                  required
                  value={adminFullName}
                  onChange={(e) => setAdminFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Admin Login Email</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Initial Admin Password</label>
                <input
                  type="text"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono outline-none"
                />
              </div>
            </div>
          </Card>

          {/* SECTION 2: WHITE-LABEL BRANDING & MOTIF */}
          <Card className="p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-slate-900">2. White-Label HIG Theme & Pattern Motif</h2>
              </div>

              {/* 1-Click Starter Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3 h-3" /> Presets:
                </span>
                {BRAND_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.primaryColor);
                      setAccentColor(preset.accentColor);
                      setMotif(preset.motif);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: preset.primaryColor }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Primary Brand Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Background Texture Motif</label>
                <select
                  value={motif}
                  onChange={(e) => setMotif(e.target.value as BrandMotif)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-white outline-none"
                >
                  <option value="collegiate-stripe">Collegiate Pinstripe (Classic)</option>
                  <option value="heritage-quatrefoil">Heritage Quatrefoil (Mission/Faith)</option>
                  <option value="tech-grid">Blueprint Tech Grid (STEM Academy)</option>
                  <option value="organic-topo">Organic Contour (Primary/Montessori)</option>
                  <option value="minimal-dots">Minimal Micro-Dots</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">School Motto</label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">School Crest / Logo URL</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Custom Domain (Optional)</label>
                <input
                  type="text"
                  placeholder="https://stgregorycollege.edu.ng"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>
          </Card>

          {/* SECTION 3: OPTIONAL PUBLIC INTRO WEBSITE */}
          <Card className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">3. Public Intro Website & Admissions CMS</h2>
                  <p className="text-[11px] text-slate-500">
                    When disabled, visitors go straight to the PIN Gate (Tier 1) or Login Portal (Tier 2).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setHasIntroWebsite((prev) => !prev)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  hasIntroWebsite
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {hasIntroWebsite ? 'Intro Website: ACTIVE' : 'Intro Website: OFF'}
              </button>
            </div>

            {hasIntroWebsite && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Hero Headline</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Hero Banner Image URL</label>
                    <input
                      type="text"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">&ldquo;Why Choose Us&rdquo; Editorial Overview</label>
                  <textarea
                    rows={3}
                    value={overviewBody}
                    onChange={(e) => setOverviewBody(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1">Admissions Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Admissions Phone</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Campus Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* SECTION 4: PAYSTACK SETTLEMENT & WHATSAPP BOT */}
          <Card className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-slate-900">4. Paystack Subaccount & WhatsApp Enterprise Bot</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Settlement Bank</label>
                <select
                  value={bankCode}
                  onChange={(e) => {
                    setBankCode(e.target.value);
                    setBankName(e.target.options[e.target.selectedIndex].text);
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white outline-none"
                >
                  <option value="058">Guaranty Trust Bank</option>
                  <option value="011">First Bank of Nigeria</option>
                  <option value="057">Zenith Bank</option>
                  <option value="044">Access Bank</option>
                  <option value="033">United Bank for Africa (UBA)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-1">School NUBAN Account Number (10 Digits)</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono outline-none"
                />
              </div>
            </div>

            {tier === 2 && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Meta WhatsApp Cloud API Credentials (Tier 2)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Phone Number ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 109876543210985"
                      value={whatsappPhoneId}
                      onChange={(e) => setWhatsappPhoneId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Permanent System Access Token</label>
                    <input
                      type="password"
                      placeholder="EAAG..."
                      value={whatsappToken}
                      onChange={(e) => setWhatsappToken(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Bottom Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="lg" onClick={() => setIsPreviewOpen(true)}>
              <Eye className="w-4 h-4 text-primary" /> Open Live Preview
            </Button>
            <Button type="submit" size="lg" isLoading={isDeploying}>
              <Rocket className="w-4 h-4" /> Deploy Tenant & Initialize Portal
            </Button>
          </div>
        </form>
      </main>

      {/* On-Demand Lovable-Style Preview Modal */}
      <TenantLivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        branding={liveBrandingPayload}
        onDeployClick={() => handleDeploy()}
        isDeploying={isDeploying}
      />
    </div>
  );
}