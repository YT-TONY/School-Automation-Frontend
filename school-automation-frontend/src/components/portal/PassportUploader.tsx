// src/components/portal/PassportUploader.tsx


'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StudentProfile } from '@/types/schema';
import { studentService } from '@/services/studentService';
import { Upload, AlertCircle, User } from 'lucide-react';

interface PassportUploaderProps {
  student: StudentProfile | null;
  onClose: () => void;
  onUploaded: (updatedStudent: StudentProfile) => void;
}

export const PassportUploader: React.FC<PassportUploaderProps> = ({
  student,
  onClose,
  onUploaded,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!student) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image exceeds 2MB maximum size limit.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);

    try {
      const updated = await studentService.uploadStudentPhoto(student.id, selectedFile);
      onUploaded(updated);
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || 'Failed to upload student passport photograph.');
    } finally {
      setIsUploading(false);
    }
  };

  const displayImage = previewUrl || student.photo_url;

  return (
    <Modal isOpen={!!student} onClose={onClose} title="Upload Student Passport Photo">
      <div className="space-y-5 text-xs">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={student.first_name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-xl object-cover border border-slate-200"
              unoptimized
            />
          ) : (
            <div className="h-16 w-16 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-500">
              <User className="w-7 h-7" />
            </div>
          )}
          <div>
            <p className="font-bold text-sm text-slate-900">
              {student.first_name} {student.last_name}
            </p>
            <p className="font-mono text-slate-500">{student.admission_number}</p>
            <p className="text-[11px] text-primary font-semibold mt-0.5">{student.class_name}</p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Select Passport Image (JPEG, PNG, WebP • Max 2MB)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primarySubtle file:text-primary hover:file:bg-primaryBorder/25 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            This photograph automatically embeds on official terminal Report Card PDFs.
          </p>
        </div>

        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!selectedFile}
            isLoading={isUploading}
            onClick={handleUpload}
          >
            <Upload className="w-3.5 h-3.5" /> Upload & Save Photo
          </Button>
        </div>
      </div>
    </Modal>
  );
};