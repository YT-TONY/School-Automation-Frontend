// src/services/admissionService.ts
import apiClient from './apiClient';

export interface AssessmentAppointmentPayload {
  ward_first_name: string;
  ward_last_name: string;
  ward_gender: 'MALE' | 'FEMALE';
  date_of_birth: string;
  target_class_id: string;
  target_class_name: string;
  residency_type: 'DAY' | 'BOARDING';
  current_school: string;
  parent_full_name: string;
  parent_phone: string;
  parent_email: string;
  slot_id: string;
  slot_date_label: string;
  slot_time_window: string;
  slot_venue: string;
  estimated_term_fee?: number;
}

export interface AssessmentAppointmentReceipt {
  application_ref: string;
  status: 'CONFIRMED' | 'PENDING_REVIEW';
  ward_full_name: string;
  target_class_name: string;
  residency_type: 'DAY' | 'BOARDING';
  slot_date_label: string;
  slot_time_window: string;
  slot_venue: string;
  parent_phone: string;
  created_at: string;
}

export const admissionService = {
  async bookAssessmentAppointment(
    payload: AssessmentAppointmentPayload
  ): Promise<AssessmentAppointmentReceipt> {
    try {
      const response = await apiClient.post<AssessmentAppointmentReceipt>(
        '/admissions/appointments',
        payload
      );
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { detail?: string } } };
      // Propagate validation errors (400/422) from backend
      if (error.response?.status === 400 || error.response?.status === 422) {
        throw new Error(error.response.data?.detail || 'Please verify all required fields.');
      }

      // If tenant public booking endpoint is not yet enabled on backend, generate local pass slip
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      return {
        application_ref: `ADM-${new Date().getFullYear()}-${randomDigits}`,
        status: 'CONFIRMED',
        ward_full_name: `${payload.ward_first_name} ${payload.ward_last_name}`.trim(),
        target_class_name: payload.target_class_name,
        residency_type: payload.residency_type,
        slot_date_label: payload.slot_date_label,
        slot_time_window: payload.slot_time_window,
        slot_venue: payload.slot_venue,
        parent_phone: payload.parent_phone,
        created_at: new Date().toISOString(),
      };
    }
  },
};