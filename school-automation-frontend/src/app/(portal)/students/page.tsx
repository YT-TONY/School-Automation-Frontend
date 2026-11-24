// src/app/(portal)/students/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PassportUploader } from '@/components/portal/PassportUploader';
import { studentService } from '@/services/studentService';
import { StudentProfile } from '@/types/schema';
import { Search, UserPlus, Camera, User } from 'lucide-react';

export default function StudentsDirectoryPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [photoTarget, setPhotoTarget] = useState<StudentProfile | null>(null);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

  // New student enrollment form state
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    studentService
      .listStudents()
      .then((data) => {
        if (active) setStudents(data);
      })
      .catch(() => {
        if (active) setStudents([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.admission_number.toLowerCase().includes(q) ||
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(q)
    );
  });

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const created = await studentService.createStudent({
        admission_number: admissionNumber.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        parent_phone: parentPhone.trim() || undefined,
        parent_email: parentEmail.trim() || undefined,
      });
      setStudents((prev) => [created, ...prev]);
      setIsEnrollOpen(false);
      setAdmissionNumber('');
      setFirstName('');
      setLastName('');
      setParentPhone('');
      setParentEmail('');
    } catch {
      alert('Unable to enroll student. Check admission number uniqueness.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Student Directory & Passports
          </h1>
          <p className="text-xs text-slate-500">
            Manage enrolled students and upload official report card passport photos
          </p>
        </div>

        <Button size="sm" onClick={() => setIsEnrollOpen(true)}>
          <UserPlus className="w-4 h-4" /> Enroll New Student
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or admission number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {filteredStudents.length} Student{filteredStudents.length === 1 ? '' : 's'}
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading student records...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No students found. Click &ldquo;Enroll New Student&rdquo; to add records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Admission No.</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Parent Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Passport</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {student.photo_url ? (
                          <Image
                            src={student.photo_url}
                            alt={student.first_name}
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-xl object-cover border border-slate-200"
                            unoptimized
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                        <span className="font-bold text-slate-900">
                          {student.first_name} {student.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-700">{student.admission_number}</td>
                    <td className="px-6 py-3.5 text-slate-600">{student.class_name || 'Unassigned'}</td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {student.parent_phone || student.parent_email || '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Button variant="outline" size="sm" onClick={() => setPhotoTarget(student)}>
                        <Camera className="w-3.5 h-3.5" /> Photo
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Passport Photo Modal */}
      <PassportUploader
        student={photoTarget}
        onClose={() => setPhotoTarget(null)}
        onUploaded={(updated) =>
          setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        }
      />

      {/* Enroll New Student Modal */}
      <Modal isOpen={isEnrollOpen} onClose={() => setIsEnrollOpen(false)} title="Enroll New Student">
        <form onSubmit={handleEnrollStudent} className="space-y-4 text-xs font-medium text-slate-700">
          <div>
            <label className="block mb-1">Admission Number</label>
            <input
              type="text"
              required
              placeholder="e.g. STG/2026/001"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Parent WhatsApp Phone</label>
              <input
                type="tel"
                placeholder="08031234567"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block mb-1">Parent Email</label>
              <input
                type="email"
                placeholder="parent@example.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" isLoading={isSaving}>
            Save Student Record
          </Button>
        </form>
      </Modal>
    </div>
  );
}