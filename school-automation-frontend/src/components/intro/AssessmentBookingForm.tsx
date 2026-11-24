// src/components/intro/AssessmentBookingForm.tsx
'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdmissionsConfig } from '@/types/theme';
import {
  admissionService,
  AssessmentAppointmentReceipt,
} from '@/services/admissionService';
import { formatNaira, formatDate } from '@/utils/formatters';
import {
  CalendarCheck,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  School,
  CheckCircle2,
  Printer,
  AlertCircle,
  Users,
} from 'lucide-react';

interface AssessmentBookingFormProps {
  schoolName: string;
  admissionsConfig: AdmissionsConfig;
  selectedQuote: {
    classId: string;
    className: string;
    residency: 'DAY' | 'BOARDING';
    estimatedTotal: number;
  } | null;
}

export const AssessmentBookingForm: React.FC<AssessmentBookingFormProps> = ({
  schoolName,
  admissionsConfig,
  selectedQuote,
}) => {
  const slots = admissionsConfig.assessmentSlots;
  const schedules = admissionsConfig.feeSchedules;

  const [selectedSlotId, setSelectedSlotId] = useState<string>(slots[0]?.id || '');
  const [wardFirstName, setWardFirstName] = useState('');
  const [wardLastName, setWardLastName] = useState('');
  const [wardGender, setWardGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [targetClassId, setTargetClassId] = useState<string>(
    selectedQuote?.classId || schedules[0]?.classId || ''
  );
  const [residency, setResidency] = useState<'DAY' | 'BOARDING'>(
    selectedQuote?.residency || 'DAY'
  );
  const [currentSchool, setCurrentSchool] = useState('');
  const [parentFullName, setParentFullName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<AssessmentAppointmentReceipt | null>(null);

  const activeSlot = slots.find((s) => s.id === selectedSlotId) || slots[0];
  const activeClass = schedules.find((c) => c.classId === targetClassId) || schedules[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSlot || !activeClass) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const confirmation = await admissionService.bookAssessmentAppointment({
        ward_first_name: wardFirstName.trim(),
        ward_last_name: wardLastName.trim(),
        ward_gender: wardGender,
        date_of_birth: dateOfBirth,
        target_class_id: activeClass.classId,
        target_class_name: activeClass.className,
        residency_type: residency,
        current_school: currentSchool.trim(),
        parent_full_name: parentFullName.trim(),
        parent_phone: parentPhone.trim(),
        parent_email: parentEmail.trim(),
        slot_id: activeSlot.id,
        slot_date_label: activeSlot.dateLabel,
        slot_time_window: activeSlot.timeWindow,
        slot_venue: activeSlot.venue,
        estimated_term_fee: selectedQuote?.estimatedTotal,
      });

      setReceipt(confirmation);
    } catch (err: unknown) {
      const e = err as Error;
      setErrorMessage(e.message || 'Unable to schedule assessment slot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (receipt) {
    return (
      <Card className="p-6 sm:p-8 space-y-6 border-2 border-primaryBorder">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Assessment Seat Reserved
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Official Entrance Examination Pass
            </h3>
            <p className="text-xs text-slate-500">
              Present a printed or mobile copy of this pass at the school gate on your screening date.
            </p>
          </div>

          <Button type="button" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print Pass
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <p className="text-slate-400">Application Reference ID</p>
            <p className="font-mono text-sm font-extrabold text-primary mt-0.5">
              {receipt.application_ref}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Candidate Full Name</p>
            <p className="font-bold text-slate-900 mt-0.5">{receipt.ward_full_name}</p>
          </div>
          <div>
            <p className="text-slate-400">Target Class & Mode</p>
            <p className="font-semibold text-slate-900 mt-0.5">
              {receipt.target_class_name} ({receipt.residency_type})
            </p>
          </div>
          <div>
            <p className="text-slate-400">Assessment Date & Time</p>
            <p className="font-bold text-slate-900 mt-0.5">
              {receipt.slot_date_label} • {receipt.slot_time_window}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Examination Venue</p>
            <p className="font-semibold text-slate-900 mt-0.5">{receipt.slot_venue}</p>
          </div>
          <div>
            <p className="text-slate-400">Registered Parent WhatsApp</p>
            <p className="font-semibold text-slate-900 mt-0.5">
              {receipt.parent_phone} (Booked {formatDate(receipt.created_at)})
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-primarySubtle border border-primaryBorder text-xs text-slate-700 space-y-1.5">
          <p className="font-bold text-primary">Important Examination Day Instructions:</p>
          <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
            <li>Candidates must arrive at {schoolName} at least 20 minutes before the scheduled start time.</li>
            <li>Bring HB pencils, eraser, blue/black biro, and copies of the required credentials listed above.</li>
            <li>Application processing fee ({formatNaira(admissionsConfig.applicationFormFee)}) is payable at the Bursary Desk or via Paystack upon verification.</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setReceipt(null);
              setWardFirstName('');
              setWardLastName('');
            }}
          >
            Book Another Ward
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <CalendarCheck className="w-3.5 h-3.5" /> Entrance Screening & Interview
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          Schedule Ward Assessment Date
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Reserve an official examination slot for {admissionsConfig.academicSession} Admissions
        </p>
      </div>

      {selectedQuote && (
        <div className="p-3.5 rounded-xl bg-primarySubtle border border-primaryBorder flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-700">
            Selected Fee Estimate: <strong className="text-slate-900">{selectedQuote.className}</strong> ({selectedQuote.residency})
          </span>
          <span className="font-bold text-primary">
            {formatNaira(selectedQuote.estimatedTotal)} / 1st Term
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs font-medium text-slate-700">
        {/* Step 1: Assessment Date & Slot Selector */}
        <div className="space-y-2.5">
          <label className="block font-semibold text-slate-800">
            1. Select Available Assessment Date & Time Slot
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {slots.map((slot) => {
              const isSelected = activeSlot?.id === slot.id;
              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-primarySubtle border-primary ring-1 ring-primary'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-primary">{slot.dateLabel}</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {slot.timeWindow}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {slot.venue}
                    </p>
                    <p className="flex items-center gap-1.5 text-emerald-700 font-semibold pt-1">
                      <Users className="w-3.5 h-3.5" /> {slot.seatsRemaining} seats left
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Candidate Biodata */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="font-semibold text-slate-800">2. Candidate (Ward) Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Ward First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Chinedu"
                  value={wardFirstName}
                  onChange={(e) => setWardFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Ward Surname</label>
              <input
                type="text"
                required
                placeholder="e.g. Okafor"
                value={wardLastName}
                onChange={(e) => setWardLastName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">Gender</label>
              <select
                value={wardGender}
                onChange={(e) => setWardGender(e.target.value as 'MALE' | 'FEMALE')}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">Target Entry Class</label>
              <select
                value={targetClassId}
                onChange={(e) => setTargetClassId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none"
              >
                {schedules.map((c) => (
                  <option key={c.classId} value={c.classId}>
                    {c.className}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Preferred Residency</label>
              <select
                value={residency}
                onChange={(e) => setResidency(e.target.value as 'DAY' | 'BOARDING')}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="DAY">Day Student</option>
                <option value="BOARDING">Full Boarding</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1">Current / Previous School Attended</label>
            <div className="relative">
              <School className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. St. Mary's Nursery & Primary School"
                value={currentSchool}
                onChange={(e) => setCurrentSchool(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Parent / Guardian Contact */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="font-semibold text-slate-800">3. Parent / Guardian Details (For SMS & WhatsApp Pass)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Parent / Guardian Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Emeka Okafor"
                value={parentFullName}
                onChange={(e) => setParentFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">WhatsApp Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="08031234567"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Confirm Assessment Date & Generate Exam Pass
        </Button>
      </form>
    </Card>
  );
};