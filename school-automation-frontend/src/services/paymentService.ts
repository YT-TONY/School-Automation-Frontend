// src/services/paymentService.ts
import apiClient from './apiClient';
import { PinPurchasePayload, PaymentInitResponse, PinFulfillmentResult } from '@/types/schema';

export const paymentService = {
  async initializePinPurchase(payload: PinPurchasePayload): Promise<PaymentInitResponse> {
    const response = await apiClient.post<PaymentInitResponse>('/payments/pins/initialize', payload);
    return response.data;
  },

  async verifyPayment(reference: string): Promise<PinFulfillmentResult> {
    const response = await apiClient.get<PinFulfillmentResult>(`/payments/verify/${reference}`);
    return response.data;
  },

  async downloadReceiptPdf(reference: string): Promise<void> {
    const response = await apiClient.get(`/payments/receipts/${reference}/pdf`, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Receipt_${reference}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};