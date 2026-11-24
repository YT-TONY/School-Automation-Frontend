// src/types/schema.ts

export type AcademicTerm = 'FIRST' | 'SECOND' | 'THIRD';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'PRINCIPAL'
  | 'VICE_PRINCIPAL_ACADEMIC'
  | 'VICE_PRINCIPAL_ADMIN'
  | 'TEACHER'
  | 'FORM_TEACHER'
  | 'STUDENT'
  | 'PARENT';

export interface UserProfile {
  id: string;
  school_id?: string | null;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  is_exam_officer?: boolean;
  is_class_teacher?: boolean;
}

export interface StudentProfile {
  id: string;
  school_id?: string;
  admission_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  full_name?: string;
  class_arm_id?: string | null;
  class_name: string;
  gender?: 'MALE' | 'FEMALE';
  photo_url?: string | null;
  parent_phone?: string | null;
  parent_email?: string | null;
  status: 'ACTIVE' | 'GRADUATED' | 'WITHDRAWN' | string;
}

export interface CreateStudentPayload {
  admission_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  class_arm_id?: string;
  gender?: 'MALE' | 'FEMALE';
  parent_phone?: string;
  parent_email?: string;
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