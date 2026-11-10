// src/app/(public_gate)/check-result/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ResultSheetView } from '@/components/portal/ResultSheetView';
import { resultService } from '@/services/resultService';
import { StudentResultResponse, AcademicTerm } from '@/types/schema';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import { KeyRound, GraduationCap, Calendar, AlertCircle } from 'lucide-react';

export default function CheckResultPage() {
  const { branding } = useSchoolTheme();
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [session, setSession] = useState('2025/2026');
  const [term, setTerm] = useState<AcademicTerm>('THIRD');
  const [serialNumber, setSerialNumber] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<StudentResultResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const data = await resultService.verifyPinAndFetchResult({
        admission_number: admissionNumber.trim(),
        session,
        term,
        serial_number: serialNumber.trim(),
        pin_code: pinCode.trim(),
      });
      setResultData(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(
        error.response?.data?.detail || 'Invalid credentials or PIN maximum usage limit reached.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (resultData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ResultSheetView
          resultData={resultData}
          onReset={() => {
            setResultData(null);
            setPinCode('');
          }}
        />
      </div>
    );
  }

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
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Check Student Result</h2>
        <p className="text-xs text-slate-500">
          Enter student academic identification and valid 12-digit scratch PIN
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
              <label className="block mb-1">Admission Number</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. STG/2023/048"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Academic Session</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white text-xs"
                  >
                    <option value="2025/2026">2025/2026</option>
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1">Academic Term</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value as AcademicTerm)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white text-xs"
                >
                  <option value="FIRST">1st Term</option>
                  <option value="SECOND">2nd Term</option>
                  <option value="THIRD">3rd Term</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1">PIN Serial Number</label>
              <input
                type="text"
                required
                placeholder="e.g. SN-8923019"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">12-Digit Scratch PIN</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  maxLength={12}
                  placeholder="••••••••••••"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none tracking-widest"
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Verify & View Score Sheet
            </Button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have a PIN?{' '}
              <Link href="/buy-pin" className="text-primary font-semibold hover:underline">
                Buy Result PIN Online
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}