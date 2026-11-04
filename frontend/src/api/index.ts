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
  DocumentItem,
  RAGQueryResult,
  DiscussionThread,
  DiscussionComment,
  StudyGroup,
  MarketplaceListing,
  GradebookSummary,
  AuditLogEntry,
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

export const documentsApi = {
  getDocuments: (courseId?: number) =>
    apiRequest<DocumentItem[]>(`/documents/${courseId ? `?course_id=${courseId}` : ''}`),
  indexDocument: (data: { title: string; filename: string; content_text: string; course_id?: number }) =>
    apiRequest<DocumentItem>('/documents/index', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  ragQuery: (data: { query: string; course_id?: number; top_k?: number }) =>
    apiRequest<RAGQueryResult>('/documents/rag-query', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const discussionsApi = {
  getThreads: (tag?: string) =>
    apiRequest<DiscussionThread[]>(`/discussions/${tag ? `?tag=${tag}` : ''}`),
  createThread: (data: { title: string; content: string; tags?: string; course_id?: number }) =>
    apiRequest<DiscussionThread>('/discussions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getThread: (id: number) =>
    apiRequest<DiscussionThread>(`/discussions/${id}`),
  addComment: (threadId: number, content: string) =>
    apiRequest<DiscussionComment>(`/discussions/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  upvoteThread: (threadId: number) =>
    apiRequest<{ upvotes: number }>(`/discussions/${threadId}/upvote`, {
      method: 'POST',
    }),
  getStudyGroups: () =>
    apiRequest<StudyGroup[]>('/discussions/study-groups/all'),
  createStudyGroup: (data: Partial<StudyGroup>) =>
    apiRequest<StudyGroup>('/discussions/study-groups/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const marketplaceApi = {
  getListings: (category?: string) =>
    apiRequest<MarketplaceListing[]>(`/marketplace/${category && category !== 'All' ? `?category=${category}` : ''}`),
  createListing: (data: Partial<MarketplaceListing>) =>
    apiRequest<MarketplaceListing>('/marketplace/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatus: (id: number, status: string) =>
    apiRequest<MarketplaceListing>(`/marketplace/${id}/status?new_status=${status}`, {
      method: 'PATCH',
    }),
  sendInquiry: (listingId: number, message: string) =>
    apiRequest<any>(`/marketplace/${listingId}/inquiries`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};

export const analyticsApi = {
  getGradebook: () =>
    apiRequest<GradebookSummary>('/analytics/gradebook'),
  getAttendanceRisks: () =>
    apiRequest<any[]>('/analytics/attendance-risks'),
  getPlacementStats: () =>
    apiRequest<any>('/analytics/placement-stats'),
};

export const auditApi = {
  getLogs: (action?: string) =>
    apiRequest<AuditLogEntry[]>(`/audit/logs${action ? `?action=${action}` : ''}`),
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
