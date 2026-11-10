// src/types/schema.ts
export type AcademicTerm = 'FIRST' | 'SECOND' | 'THIRD';

export interface StudentProfile {
  id: string;
  admission_number: string;
  first_name: string;
  last_name: string;
  class_name: string;
  photo_url?: string | null;
  parent_phone?: string | null;
  parent_email?: string | null;
  status: string;
}

export interface SubjectResult {
  subject_id: string;
  subject_name: string;
  test1_score: number | null;
  test2_score: number | null;
  assignment_score: number | null;
  ca_score: number;
  exam_score: number;
  total_score: number;
  grade: string;
  remark: string;
}

export interface StudentResultResponse {
  student: StudentProfile;
  session: string;
  term: AcademicTerm;
  results: SubjectResult[];
  total_obtainable: number;
  total_obtained: number;
  average_score: number;
  class_average?: number;
  position?: number | null;
  total_students?: number | null;
  principal_remark?: string | null;
  form_teacher_remark?: string | null;
  pin_details: {
    serial_number: string;
    times_used: number;
    max_uses: number;
    remaining_uses: number;
  };
}

export interface PinVerificationPayload {
  admission_number: string;
  session: string;
  term: AcademicTerm;
  serial_number: string;
  pin_code: string;
}

export interface PinPurchasePayload {
  email: string;
  phone_number: string;
  quantity: number;
}

export interface PaymentInitResponse {
  authorization_url: string;
  reference: string;
  access_code: string;
  amount: number;
}

export interface PinFulfillmentResult {
  reference: string;
  paid_at: string;
  pins: Array<{
    pin_code: string;
    serial_number: string;
    max_uses: number;
  }>;
}