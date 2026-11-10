// src/components/portal/ResultSheetView.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StudentResultResponse } from '@/types/schema';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import { resultService } from '@/services/resultService';
import { getGradeBadgeStyle } from '@/utils/formatters';
import { Download, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

export const ResultSheetView: React.FC<{
  resultData: StudentResultResponse;
  onReset: () => void;
}> = ({ resultData, onReset }) => {
  const { branding } = useSchoolTheme();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await resultService.downloadResultPdf({
        admission_number: resultData.student.admission_number,
        session: resultData.session,
        term: resultData.term,
        pin_code: 'VERIFIED_SESSION',
      });
    } catch {
      alert('Unable to generate vector PDF stream. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated Academic Record
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Terminal Assessment Sheet</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4" /> Check Another
          </Button>
          <Button size="sm" onClick={handleDownloadPdf} isLoading={isDownloading}>
            <Download className="w-4 h-4" /> Download Official PDF
          </Button>
        </div>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-6 gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <Image
              src={branding.logoUrl || '/watermarks/default_crest_watermark.svg'}
              alt={branding.schoolName}
              width={64}
              height={64}
              className="w-16 h-16 object-contain"
              unoptimized
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{branding.schoolName}</h3>
              <p className="text-xs text-slate-500 font-medium">{branding.motto}</p>
              <p className="text-xs text-primary font-semibold mt-1">
                {resultData.term} TERM EXAMINATION REPORT ({resultData.session})
              </p>
            </div>
          </div>
          {resultData.student.photo_url && (
            <Image
              src={resultData.student.photo_url}
              alt="Student Passport"
              width={64}
              height={64}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200"
              unoptimized
            />
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
          <div>
            <p className="text-slate-400">Student Name</p>
            <p className="font-semibold text-slate-900 mt-0.5">
              {resultData.student.first_name} {resultData.student.last_name}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Admission No.</p>
            <p className="font-mono font-semibold text-slate-900 mt-0.5">{resultData.student.admission_number}</p>
          </div>
          <div>
            <p className="text-slate-400">Class</p>
            <p className="font-semibold text-slate-900 mt-0.5">{resultData.student.class_name}</p>
          </div>
          <div>
            <p className="text-slate-400">PIN Uses Remaining</p>
            <p className="font-semibold text-primary mt-0.5">
              {resultData.pin_details.remaining_uses} of {resultData.pin_details.max_uses}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase">
                <th className="py-2.5">Subject</th>
                <th className="py-2.5 text-center">CA (40)</th>
                <th className="py-2.5 text-center">Exam (60)</th>
                <th className="py-2.5 text-center">Total (100)</th>
                <th className="py-2.5 text-center">Grade</th>
                <th className="py-2.5">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resultData.results.map((sub) => (
                <tr key={sub.subject_id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 font-medium text-slate-900">{sub.subject_name}</td>
                  <td className="py-2.5 text-center text-slate-600">{sub.ca_score}</td>
                  <td className="py-2.5 text-center text-slate-600">{sub.exam_score}</td>
                  <td className="py-2.5 text-center font-bold text-slate-900">{sub.total_score}</td>
                  <td className="py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded-md font-bold border text-[11px] ${getGradeBadgeStyle(sub.grade)}`}>
                      {sub.grade}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-500">{sub.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-slate-500">Weighted Average</p>
            <p className="text-lg font-bold text-slate-900 mt-1">{resultData.average_score.toFixed(1)}%</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-slate-500">Marks Obtained</p>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {resultData.total_obtained} / {resultData.total_obtainable}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 col-span-2 sm:col-span-1">
            <p className="text-slate-500 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-primary" /> Class Position
            </p>
            <p className="text-lg font-bold text-primary mt-1">
              {resultData.position ? `${resultData.position} of ${resultData.total_students || '-'}` : 'N/A'}
            </p>
          </div>
        </div>

        {(resultData.form_teacher_remark || resultData.principal_remark) && (
          <div className="space-y-3 border-t border-slate-100 pt-4 text-xs">
            {resultData.form_teacher_remark && (
              <p className="text-slate-600">
                <strong className="text-slate-900">Form Teacher&apos;s Remark:</strong> {resultData.form_teacher_remark}
              </p>
            )}
            {resultData.principal_remark && (
              <p className="text-slate-600">
                <strong className="text-slate-900">Principal&apos;s Remark:</strong> {resultData.principal_remark}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};