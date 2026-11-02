import { apiRequest } from './client';
import {
  User,
  AuthResponse,
  Course,
  TimetableSlot,
  AttendanceRecord,
  Assignment,
  JobPosting,
  JobApplication,
  Announcement,
  CampusEvent,
  AcademicSummary,
} from '../types';

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (payload: {
    email: string;
    password: string;
    full_name: string;
    role: string;
    department?: string;
    roll_number_or_empid?: string;
  }) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => apiRequest<User>('/auth/me'),
};

export const academicsApi = {
  getCourses: () => apiRequest<Course[]>('/academics/courses'),
  getTimetable: (day?: string) =>
    apiRequest<TimetableSlot[]>(`/academics/timetable${day ? `?day=${day}` : ''}`),
  getAttendance: () => apiRequest<AttendanceRecord[]>('/academics/attendance'),
  getAssignments: () => apiRequest<Assignment[]>('/academics/assignments'),
  getSummary: () => apiRequest<AcademicSummary>('/academics/summary'),
  submitAssignment: (assignmentId: number, text: string) =>
    apiRequest<any>(`/academics/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ submission_text: text }),
    }),
  createCourse: (data: Partial<Course>) =>
    apiRequest<Course>('/academics/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const careerApi = {
  getJobs: () => apiRequest<JobPosting[]>('/career/jobs'),
  applyForJob: (jobId: number, notes?: string) =>
    apiRequest<JobApplication>(`/career/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
  getMyApplications: () => apiRequest<JobApplication[]>('/career/my-applications'),
  createJob: (data: Partial<JobPosting>) =>
    apiRequest<JobPosting>('/career/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const communityApi = {
  getAnnouncements: () => apiRequest<Announcement[]>('/community/announcements'),
  getEvents: () => apiRequest<CampusEvent[]>('/community/events'),
  createAnnouncement: (data: { title: string; content: string; category?: string }) =>
    apiRequest<Announcement>('/community/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  createEvent: (data: Partial<CampusEvent>) =>
    apiRequest<CampusEvent>('/community/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const aiApi = {
  askAssistant: (data: { query: string; topic?: string; mode?: string }) =>
    apiRequest<{
      response: string;
      topic: string;
      mode: string;
      quiz?: Array<{ question: string; options: string[]; answer: string; explanation: string }>;
      flashcards?: Array<{ front: string; back: string }>;
      study_plan?: string[];
    }>('/ai/study', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const statsApi = {
  getStats: () =>
    apiRequest<{
      total_students: number;
      total_faculty: number;
      total_courses: number;
      total_assignments: number;
      active_jobs: number;
      current_user_role: string;
      current_user_name: string;
    }>('/users/dashboard-stats'),
};

export const healthApi = {
  check: () =>
    apiRequest<{
      status: string;
      service: string;
      environment: string;
      database: string;
      timestamp: string;
      version: string;
    }>('/health'),
};
