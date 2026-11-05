import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  CheckSquare,
  PlusCircle,
  FilePlus,
  Send,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { academicsApi, communityApi } from '../../api';
import { Course, TimetableSlot, Assignment, Announcement } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { CampusAmbientMesh } from './CampusAmbientMesh';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, ttRes, aRes, annRes] = await Promise.all([
          academicsApi.getCourses(),
          academicsApi.getTimetable(),
          academicsApi.getAssignments(),
          communityApi.getAnnouncements(),
        ]);
        setCourses(cRes);
        setTimetable(ttRes);
        setAssignments(aRes);
        setAnnouncements(annRes);
      } catch (err) {
        console.error('Error loading faculty dashboard', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 relative">
      <CampusAmbientMesh variant="emerald" />

      {/* Signature Emerald & Sapphire Gradient Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950/80 to-blue-950 rounded-2xl p-8 text-white border border-emerald-500/30 shadow-xl shadow-emerald-950/20 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-400/30 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping-subtle" />
            <span>Faculty & Academic Instruction Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">{user?.full_name}</span>
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            {user?.faculty_profile?.designation || 'Associate Professor'} • {user?.department || 'Computer Science & Engineering'} • Emp ID: {user?.faculty_profile?.employee_id || 'FAC204'}
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="outline"
            onClick={() => navigate('/academics')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-md backdrop-blur-sm"
          >
            <FilePlus className="w-4 h-4 mr-2 text-emerald-300" />
            New Assignment
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/community')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30"
          >
            <Send className="w-4 h-4 mr-2" />
            Publish Notice
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assigned Courses
            </span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{courses.length} Active</span>
            <Badge variant="blue" size="sm">Semester VI</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Undergraduate Program</p>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">184</span>
            <Badge variant="green" size="sm">Active</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Across 4 lecture divisions</p>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Submissions to Grade
            </span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <CheckSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">28 Papers</span>
            <Badge variant="amber" size="sm">Pending</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Raft Consensus & Neural Nets</p>
        </Card>

        <Card className="border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Attendance Rate
            </span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">92.4%</span>
            <Badge variant="green" size="sm">High</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Exceeds university benchmark</p>
        </Card>
      </div>

      {/* Courses & Teaching Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Curriculum Management"
            subtitle="Courses under your academic instruction"
            action={
              <Button size="sm" variant="outline" onClick={() => navigate('/academics')}>
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                Add Course Module
              </Button>
            }
          >
            <div className="space-y-3">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="navy" size="md">{c.code}</Badge>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{c.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{c.department} • {c.credits} Credits • Sem {c.semester}</p>
                      </div>
                    </div>
                    <Badge variant="blue" size="sm">Enrolled: 62</Badge>
                  </div>
                  {c.description && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {c.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Timetable / Office Hours */}
        <div className="space-y-6">
          <Card
            title="Teaching Schedule"
            subtitle="Classrooms & Laboratories"
          >
            <div className="space-y-3">
              {timetable.slice(0, 5).map((slot) => (
                <div key={slot.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{slot.day_of_week}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Room: {slot.room}</p>
                  </div>
                  <Badge variant="blue" size="sm">
                    {slot.start_time} - {slot.end_time}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Quick Actions">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-xs text-slate-700"
                onClick={() => navigate('/academics')}
              >
                <Layers className="w-3.5 h-3.5 mr-2 text-blue-600" />
                Manage Course Syllabus
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-xs text-slate-700"
                onClick={() => navigate('/community')}
              >
                <Send className="w-3.5 h-3.5 mr-2 text-blue-600" />
                Post Department Circular
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
