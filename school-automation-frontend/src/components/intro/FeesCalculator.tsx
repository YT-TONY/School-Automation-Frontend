// src/components/intro/FeesCalculator.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdmissionsConfig } from '@/types/theme';
import { formatNaira } from '@/utils/formatters';
import {
  Calculator,
  Building2,
  Sun,
  CheckSquare,
  Square,
  Printer,
  ArrowRight,
  Info,
} from 'lucide-react';

interface FeesCalculatorProps {
  schoolName: string;
  admissionsConfig: AdmissionsConfig;
  minimumPaymentPercentage: number;
  onProceedToBook: (selection: {
    classId: string;
    className: string;
    residency: 'DAY' | 'BOARDING';
    estimatedTotal: number;
  }) => void;
}

export const FeesCalculator: React.FC<FeesCalculatorProps> = ({
  schoolName,
  admissionsConfig,
  minimumPaymentPercentage,
  onProceedToBook,
}) => {
  const schedules = admissionsConfig.feeSchedules;
  const [selectedClassId, setSelectedClassId] = useState<string>(schedules[0]?.classId || '');
  const [residency, setResidency] = useState<'DAY' | 'BOARDING'>('DAY');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [includeEntryLevies, setIncludeEntryLevies] = useState<boolean>(true);

  const activeSchedule = useMemo(() => {
    return schedules.find((s) => s.classId === selectedClassId) || schedules[0];
  }, [schedules, selectedClassId]);

  const effectiveResidency: 'DAY' | 'BOARDING' =
    activeSchedule?.boardingAvailable ? residency : 'DAY';

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const calculation = useMemo(() => {
    if (!activeSchedule) {
      return {
        compulsoryItems: [],
        boardingCost: 0,
        addonItems: [],
        recurringTermTotal: 0,
        oneTimeEntryTotal: 0,
        grandTotalFirstTerm: 0,
        minimumInstallment: 0,
      };
    }

    const compulsoryItems = activeSchedule.tuitionAndCompulsory.filter(
      (item) => includeEntryLevies || item.frequency === 'PER_TERM'
    );

    const recurringCompulsory = compulsoryItems
      .filter((i) => i.frequency === 'PER_TERM')
      .reduce((sum, i) => sum + i.amount, 0);

    const oneTimeEntryTotal = compulsoryItems
      .filter((i) => i.frequency === 'ONE_TIME_ENTRY')
      .reduce((sum, i) => sum + i.amount, 0);

    const boardingCost =
      effectiveResidency === 'BOARDING' && activeSchedule.boardingAvailable
        ? activeSchedule.boardingFeePerTerm
        : 0;

    const addonItems = admissionsConfig.optionalAddons.filter((addon) =>
      selectedAddonIds.includes(addon.id)
    );
    const addonsTotal = addonItems.reduce((sum, a) => sum + a.amount, 0);

    const recurringTermTotal = recurringCompulsory + boardingCost + addonsTotal;
    const grandTotalFirstTerm = recurringTermTotal + oneTimeEntryTotal;
    const minimumInstallment = Math.round(
      (grandTotalFirstTerm * minimumPaymentPercentage) / 100
    );

    return {
      compulsoryItems,
      boardingCost,
      addonItems,
      recurringTermTotal,
      oneTimeEntryTotal,
      grandTotalFirstTerm,
      minimumInstallment,
    };
  }, [
    activeSchedule,
    effectiveResidency,
    selectedAddonIds,
    includeEntryLevies,
    admissionsConfig.optionalAddons,
    minimumPaymentPercentage,
  ]);

  if (!activeSchedule) return null;

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" /> Dynamic Tuition & Package Estimator
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Interactive School Fees Calculator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synced directly with {schoolName}&apos;s {admissionsConfig.academicSession} Bursary Schedule
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" /> Print Quote
        </Button>
      </div>

      {/* Step 1 & 2 Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            1. Select Target Entry Class / Level
          </label>
          <select
            value={activeSchedule.classId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none"
          >
            {schedules.map((item) => (
              <option key={item.classId} value={item.classId}>
                {item.className}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            2. Student Residency Option
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setResidency('DAY')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                effectiveResidency === 'DAY'
                  ? 'bg-primary text-textOnPrimary border-primary shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Day Student
            </button>

            <button
              type="button"
              disabled={!activeSchedule.boardingAvailable}
              onClick={() => setResidency('BOARDING')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                !activeSchedule.boardingAvailable
                  ? 'bg-slate-50 text-slate-400 border-slate-200/70 cursor-not-allowed'
                  : effectiveResidency === 'BOARDING'
                  ? 'bg-primary text-textOnPrimary border-primary shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              {activeSchedule.boardingAvailable ? 'Full Boarding' : 'No Boarding'}
            </button>
          </div>
        </div>
      </div>

      {/* New Student Toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
        <div>
          <p className="text-xs font-semibold text-slate-800">
            Include New Entrant One-Time Levies (Uniforms, Crest & Development)
          </p>
          <p className="text-[11px] text-slate-500">
            Toggle off to preview subsequent returning term fees only
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIncludeEntryLevies((prev) => !prev)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            includeEntryLevies
              ? 'bg-primarySubtle text-primary border border-primaryBorder'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          {includeEntryLevies ? 'Included' : 'Excluded'}
        </button>
      </div>

      {/* Step 3: Optional Add-ons */}
      {admissionsConfig.optionalAddons.length > 0 && (
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold text-slate-700">
            3. Optional Services & Co-Curricular Packages (Per Term)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {admissionsConfig.optionalAddons.map((addon) => {
              const checked = selectedAddonIds.includes(addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    checked
                      ? 'bg-primarySubtle border-primaryBorder'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="mt-0.5 text-primary">
                    {checked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900 truncate">{addon.label}</p>
                      <span className="text-xs font-bold text-primary shrink-0">
                        +{formatNaira(addon.amount)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{addon.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Itemized Breakdown Receipt Box */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Itemized Fee Schedule ({activeSchedule.className})
          </h3>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
            {effectiveResidency === 'BOARDING' ? 'Boarding Package' : 'Day Package'}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {calculation.compulsoryItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-slate-700">
              <span>
                {item.label}{' '}
                {item.frequency === 'ONE_TIME_ENTRY' && (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded ml-1">
                    One-Time Entry
                  </span>
                )}
              </span>
              <span className="font-semibold text-slate-900">{formatNaira(item.amount)}</span>
            </div>
          ))}

          {calculation.boardingCost > 0 && (
            <div className="flex items-center justify-between text-slate-700">
              <span>Hostel Accommodation, Feeding & Pastoral Care (Per Term)</span>
              <span className="font-semibold text-slate-900">{formatNaira(calculation.boardingCost)}</span>
            </div>
          )}

          {calculation.addonItems.map((addon) => (
            <div key={addon.id} className="flex items-center justify-between text-primary">
              <span>{addon.label}</span>
              <span className="font-semibold">{formatNaira(addon.amount)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Subsequent Returning Term Estimate:</span>
            <span className="font-bold text-slate-900">
              {formatNaira(calculation.recurringTermTotal)} / term
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-sm font-bold text-slate-900">Total First-Term Package</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Info className="w-3 h-3 text-primary" />
                Minimum {minimumPaymentPercentage}% initial deposit allowed upon admission:{' '}
                <strong className="text-slate-800">{formatNaira(calculation.minimumInstallment)}</strong>
              </p>
            </div>
            <p className="text-2xl font-extrabold text-primary tracking-tight">
              {formatNaira(calculation.grandTotalFirstTerm)}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            className="w-full"
            onClick={() =>
              onProceedToBook({
                classId: activeSchedule.classId,
                className: activeSchedule.className,
                residency: effectiveResidency,
                estimatedTotal: calculation.grandTotalFirstTerm,
              })
            }
          >
            Book Entrance Assessment for {activeSchedule.className} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};