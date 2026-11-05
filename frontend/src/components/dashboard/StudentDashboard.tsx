import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { academicsApi, communityApi } from '../../api';
import { Course, TimetableSlot, Assignment, Announcement, AcademicSummary } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CampusAmbientMesh } from './CampusAmbientMesh';
import { CampusPulseWidget } from './CampusPulseWidget';
import { CampusScratchpad } from './CampusScratchpad';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<AcademicSummary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, coursesRes, ttRes, assignRes, annRes] = await Promise.all([
          academicsApi.getSummary(),
          academicsApi.getCourses(),
          academicsApi.getTimetable(),
          academicsApi.getAssignments(),
          communityApi.getAnnouncements(),
        ]);
        setSummary(sumRes);
        setCourses(coursesRes);
        setTimetable(ttRes.slice(0, 4));
        setAssignments(assignRes.slice(0, 3));
        setAnnouncements(annRes.slice(0, 2));
      } catch (err) {
        console.error('Failed to load student dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 relative">
      <CampusAmbientMesh variant="blue" />

      {/* Signature Cosmic Aurora Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/95 to-blue-900 rounded-2xl p-8 text-white shadow-xl shadow-indigo-950/20 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-indigo-500/30 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-400/30 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping-subtle" />
            <span>Student Life Management Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">{user?.full_name}</span>
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            {user?.student_profile?.program || 'B.Tech Computer Science & Engineering'} • Semester {user?.student_profile?.semester || 6} • Roll #{user?.student_profile?.roll_number || 'CS2023048'}
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="outline"
            onClick={() => navigate('/ai-study')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-md backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 mr-2 text-cyan-300" />
            AI Study Copilot
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/placement-ai')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Career Intelligence
          </Button>
        </div>
      </div>

      {/* Live Campus Pulse Widget */}
      <CampusPulseWidget
        attendanceRate={summary?.attendance_rate || 88.5}
        cgpa={summary?.cgpa || 8.85}
        role="student"
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cumulative CGPA
            </span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {summary?.cgpa ? summary.cgpa.toFixed(2) : '8.84'}
            </span>
            <Badge variant="green" size="sm">
              <TrendingUp className="w-3 h-3 mr-1 inline" /> Top 5%
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Scale of 10.0</p>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Overall Attendance
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {summary?.attendance_rate ? `${summary.attendance_rate.toFixed(1)}%` : '94.2%'}
            </span>
            <Badge variant="green" size="sm">Compliant</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Minimum requirement: 75%</p>
        </Card>

        <Card className="border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Degree Credits
            </span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {summary?.credits_completed || 118} / {summary?.total_credits || 160}
            </span>
            <span className="text-xs font-medium text-slate-500">74% Done</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '74%' }}></div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Tasks
            </span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {assignments.length} Assignments
            </span>
            <Badge variant="amber" size="sm">Action Req</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Earliest due in 5 days</p>
        </Card>
      </div>

      {/* Main Grid: Today's Schedule & Pending Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Classes & Timetable */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Class Schedule & Lecture Halls"
            subtitle="Live schedule synchronization across registered courses"
            action={
              <button
                onClick={() => navigate('/academics')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
              >
                Full Timetable <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            }
          >
            <div className="space-y-3">
              {timetable.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg">
                      <p className="text-xs font-bold leading-tight">{slot.day_of_week.slice(0, 3)}</p>
                      <p className="text-[10px] font-semibold">{slot.start_time}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {courses.find((c) => c.id === slot.course_id)?.name || 'Course Lecture'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {courses.find((c) => c.id === slot.course_id)?.code || 'CS301'} • Room {slot.room}
                      </p>
                    </div>
                  </div>
                  <Badge variant="blue" size="sm">
                    {slot.start_time} - {slot.end_time}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Courses */}
          <Card
            title="Enrolled Courses this Semester"
            subtitle="Core engineering and departmental electives"
            action={
              <button
                onClick={() => navigate('/academics')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
              >
                View Syllabus <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="navy" size="sm">{c.code}</Badge>
                    <span className="text-xs font-medium text-slate-500">{c.credits} Credits</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mt-2">{c.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">Faculty: {c.faculty_name || 'Department Faculty'}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Column: Assignments & Announcements */}
        <div className="space-y-6">
          {/* Assignments */}
          <Card
            title="Upcoming Assignments"
            subtitle="Submit solutions before deadline"
            action={
              <button
                onClick={() => navigate('/academics')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
              >
                All Tasks <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            }
          >
            <div className="space-y-3">
              {assignments.map((a) => (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-semibold text-slate-900 leading-snug">{a.title}</h5>
                    <Badge variant="amber" size="sm">Max {a.max_marks} pts</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{a.description}</p>
                  <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      Due: {new Date(a.due_date).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => navigate('/academics')}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Campus Announcements */}
          <Card
            title="Notice Board"
            subtitle="Official notifications"
            action={
              <button
                onClick={() => navigate('/community')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
              >
                All Notices <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            }
          >
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <Badge variant={ann.category === 'Academic' ? 'blue' : 'amber'} size="sm">
                      {ann.category}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ann.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-800 mt-1.5">{ann.title}</h5>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Interactive Scratchpad & Checklist */}
          <CampusScratchpad />
        </div>
      </div>
    </div>
  );
};
