// src/services/resultService.ts
import apiClient from './apiClient';
import { PinVerificationPayload, StudentResultResponse } from '@/types/schema';

export const resultService = {
  async verifyPinAndFetchResult(payload: PinVerificationPayload): Promise<StudentResultResponse> {
    const response = await apiClient.post<StudentResultResponse>('/pins/verify', payload);
    return response.data;
  },

  async downloadResultPdf(payload: {
    admission_number: string;
    session: string;
    term: string;
    pin_code: string;
  }): Promise<void> {
    const response = await apiClient.post(
      '/results/download-pdf',
      payload,
      { responseType: 'blob' }
    );
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Report_${payload.admission_number}_${payload.term}_${payload.session.replace('/', '-')}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};