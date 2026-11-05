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

export interface DocumentItem {
  id: number;
  title: string;
  filename: string;
  file_size_bytes: number;
  mime_type: string;
  course_id?: number;
  summary?: string;
  page_count: number;
  created_at: string;
}

export interface RAGSource {
  title: string;
  page: number;
  relevance_score: number;
  excerpt: string;
}

export interface RAGQueryResult {
  query: string;
  answer: string;
  sources: RAGSource[];
}

export interface DiscussionComment {
  id: number;
  thread_id: number;
  author_id: number;
  content: string;
  is_solution: boolean;
  upvotes: number;
  created_at: string;
}

export interface DiscussionThread {
  id: number;
  course_id?: number;
  author_id: number;
  title: string;
  content: string;
  tags: string;
  upvotes: number;
  views: number;
  is_resolved: boolean;
  created_at: string;
  comments: DiscussionComment[];
}

export interface StudyGroup {
  id: number;
  name: string;
  course_id?: number;
  description?: string;
  meeting_schedule: string;
  meeting_link?: string;
  max_members: number;
  created_by_id: number;
  created_at: string;
}

export interface MarketplaceListing {
  id: number;
  title: string;
  description: string;
  category: string;
  price: string;
  condition: string;
  seller_id: number;
  status: string;
  contact_phone_or_email?: string;
  created_at: string;
}

export interface GradeItem {
  course_id: number;
  course_code: string;
  course_name: string;
  letter_grade: string;
  grade_point: number;
  credit_hours: number;
  remarks?: string;
}

export interface SemesterGradebook {
  semester: number;
  sgpa: number;
  total_credits: number;
  courses: GradeItem[];
}

export interface GradebookSummary {
  cumulative_cgpa: number;
  total_credits_earned: number;
  semesters: SemesterGradebook[];
}

export interface AuditLogEntry {
  id: number;
  user_id?: number;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

// Machine Learning & Intelligence Entities

export interface FeatureImpact {
  feature: string;
  importance_weight: number;
  student_value: number;
}

export interface PlacementPredictionResult {
  placement_probability: number;
  placement_percentage: number;
  status_bracket: string;
  projected_salary_lpa: number;
  top_factors: FeatureImpact[];
}

export interface PlacementSimulationResult {
  baseline: PlacementPredictionResult;
  simulated: PlacementPredictionResult;
  deltas: {
    placement_prob_change_pct: number;
    projected_salary_change_lpa: number;
  };
  recommendation: string;
}

export interface AcademicRiskAssessmentResult {
  risk_category: 'DEANS_LIST' | 'GOOD_STANDING' | 'MODERATE_RISK' | 'CRITICAL_RISK';
  confidence: number;
  class_probabilities: Record<string, number>;
  actionable_interventions: string[];
  primary_driver: string;
}

export interface CohortStudentRisk {
  student_id: number;
  name: string;
  roll_number: string;
  current_cgpa: number;
  attendance_rate: number;
  risk_category: string;
  interventions: string[];
}

export interface CohortRiskOverview {
  summary: Record<string, number>;
  students: CohortStudentRisk[];
}

export interface RecommendedCourse {
  code: string;
  name: string;
}

export interface SkillMatchReport {
  match_percentage: number;
  status: string;
  matched_required_skills: string[];
  missing_required_skills: string[];
  matched_preferred_skills: string[];
  missing_preferred_skills: string[];
  recommended_courses: RecommendedCourse[];
}

export interface MLModelMetrics {
  accuracy: number;
  precision?: number;
  recall?: number;
  f1_score?: number;
  roc_auc?: number;
  mae_salary_lpa?: number;
  total_records?: number;
  confusion_matrix?: number[][];
  feature_importances?: Record<string, number>;
  feature_importance?: Record<string, number>;
}

export interface MLTelemetry {
  status: string;
  placement_model: {
    name: string;
    dataset: string;
    metrics: MLModelMetrics;
  };
  retention_model: {
    name: string;
    dataset: string;
    metrics: MLModelMetrics;
  };
  skill_matcher: {
    name: string;
    taxonomy_roles_count: number;
  };
}
