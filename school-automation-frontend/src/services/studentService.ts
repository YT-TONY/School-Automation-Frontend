// src/services/studentService.ts

import apiClient from './apiClient';
import { StudentProfile, CreateStudentPayload } from '@/types/schema';

export const studentService = {
  async listStudents(params?: { search?: string; class_arm_id?: string }): Promise<StudentProfile[]> {
    const response = await apiClient.get<StudentProfile[]>('/students', { params });
    return response.data;
  },

  async createStudent(payload: CreateStudentPayload): Promise<StudentProfile> {
    const response = await apiClient.post<StudentProfile>('/students', payload);
    return response.data;
  },

  async uploadStudentPhoto(studentId: string, imageFile: File): Promise<StudentProfile> {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await apiClient.post<StudentProfile>(
      `/students/${studentId}/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};