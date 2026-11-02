export type UserRole = 'student' | 'faculty' | 'placement_coordinator' | 'admin';

export interface StudentProfile {
  id: number;
  roll_number: string;
  semester: number;
  program: string;
  cgpa: number;
  attendance_percentage: number;
  credits_completed: number;
  total_credits: number;
}

export interface FacultyProfile {
  id: number;
  employee_id: string;
  designation: string;
  specialization?: string;
  office_room?: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  student_profile?: StudentProfile;
  faculty_profile?: FacultyProfile;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
  department: string;
  semester: number;
  faculty_name?: string;
  timetable_slots?: TimetableSlot[];
}

export interface TimetableSlot {
  id: number;
  course_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room: string;
}

export interface AttendanceRecord {
  id: number;
  course_id: number;
  course_name?: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface Assignment {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  due_date: string;
  max_marks: number;
  created_at: string;
}

export interface JobPosting {
  id: number;
  company_name: string;
  role_title: string;
  job_type: string;
  location: string;
  stipend_or_salary: string;
  deadline?: string;
  requirements?: string;
  is_active: boolean;
  created_at: string;
}

export interface JobApplication {
  id: number;
  job_id: number;
  student_id: number;
  applied_at: string;
  status: string;
  notes?: string;
  job?: JobPosting;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  author_id?: number;
  created_at: string;
}

export interface CampusEvent {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  location: string;
  organizer_club: string;
  registration_link?: string;
  created_at: string;
}

export interface AcademicSummary {
  cgpa: number;
  attendance_rate: number;
  credits_completed: number;
  total_credits: number;
  enrolled_courses_count: number;
  pending_assignments_count: number;
}
