// src/components/intro/QuickResultModal.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AcademicTerm } from '@/types/schema';
import { GraduationCap, Calendar, KeyRound, ShieldAlert } from 'lucide-react';

interface QuickResultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickResultModal: React.FC<QuickResultModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [session, setSession] = useState('2025/2026');
  const [term, setTerm] = useState<AcademicTerm>('THIRD');
  const [serialNumber, setSerialNumber] = useState('');
  const [pinCode, setPinCode] = useState('');

  const handleDirectCheck = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    const query = new URLSearchParams({
      adm: admissionNumber.trim(),
      session,
      term,
      serial: serialNumber.trim(),
    });
    router.push(`/check-result?${query.toString()}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Result Check">
      <form onSubmit={handleDirectCheck} className="space-y-4 text-xs font-medium text-slate-700">
        <div>
          <label className="block mb-1 text-slate-600">Admission Number</label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. STG/2023/048"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-1 text-slate-600">Session</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-primary text-xs"
              >
                <option value="2025/2026">2025/2026</option>
                <option value="2024/2025">2024/2025</option>
                <option value="2023/2024">2023/2024</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-slate-600">Term</label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value as AcademicTerm)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none bg-white focus:ring-2 focus:ring-primary text-xs"
            >
              <option value="FIRST">1st Term</option>
              <option value="SECOND">2nd Term</option>
              <option value="THIRD">3rd Term</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-slate-600">PIN Serial Number</label>
          <input
            type="text"
            required
            placeholder="SN-8923019"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <div>
          <label className="block mb-1 text-slate-600">12-Digit Scratch PIN</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              maxLength={12}
              placeholder="••••••••••••"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary tracking-widest transition-all"
            />
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span>Each scratch card PIN is valid for a maximum of 5 uses on the student terminal record.</span>
        </div>

        <Button type="submit" className="w-full mt-1">
          Continue to Verification Gate
        </Button>
      </form>
    </Modal>
  );
};