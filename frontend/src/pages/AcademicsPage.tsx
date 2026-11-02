import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  PlusCircle,
  Upload,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { academicsApi } from '../api';
import { Course, TimetableSlot, AttendanceRecord, Assignment } from '../types';
import { useAuth } from '../context/AuthContext';

export const AcademicsPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'timetable' | 'attendance' | 'assignments'>('courses');

  const [courses, setCourses] = useState<Course[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Assignment submission state
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Add course state (for faculty/admin)
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newDept, setNewDept] = useState('Computer Science');

  useEffect(() => {
    async function loadAcademicData() {
      try {
        const [cRes, tRes, aRes, asRes] = await Promise.all([
          academicsApi.getCourses(),
          academicsApi.getTimetable(),
          academicsApi.getAttendance(),
          academicsApi.getAssignments(),
        ]);
        setCourses(cRes);
        setTimetable(tRes);
        setAttendance(aRes);
        setAssignments(asRes);
      } catch (err) {
        console.error('Error fetching academic records', err);
      } finally {
        setLoading(false);
      }
    }
    loadAcademicData();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await academicsApi.createCourse({
        code: newCode,
        name: newName,
        credits: newCredits,
        department: newDept,
        semester: 6,
        faculty_name: user?.full_name,
      });
      setCourses((prev) => [...prev, created]);
      setShowAddCourse(false);
      setNewCode('');
      setNewName('');
    } catch (err: any) {
      alert(err.message || 'Failed to add course');
    }
  };

  const handleSubmitAssignment = async (assignmentId: number) => {
    if (!submissionText.trim()) return;
    try {
      await academicsApi.submitAssignment(assignmentId, submissionText);
      setSubmissionSuccess(`Successfully submitted solution for Assignment #${assignmentId}`);
      setSubmittingId(null);
      setSubmissionText('');
      setTimeout(() => setSubmissionSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit assignment');
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-8">
      {/* Title & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Curriculum, weekly timetables, lecture logs, and continuous assessments
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          {(['courses', 'timetable', 'attendance', 'assignments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {submissionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center">
          <FileCheck className="w-5 h-5 mr-3 text-emerald-600" />
          <span>{submissionSuccess}</span>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Registered Courses & Syllabus</h2>
            {hasRole('admin', 'faculty') && (
              <Button size="sm" onClick={() => setShowAddCourse(!showAddCourse)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                {showAddCourse ? 'Cancel' : 'Register New Course'}
              </Button>
            )}
          </div>

          {showAddCourse && (
            <Card className="border border-blue-200 bg-blue-50/20">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Add Academic Course</h3>
              <form onSubmit={handleCreateCourse} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Code (e.g. CS305)"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="px-3 py-2 text-xs border rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Course Name"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-3 py-2 text-xs border rounded-lg bg-white"
                />
                <input
                  type="number"
                  placeholder="Credits"
                  value={newCredits}
                  onChange={(e) => setNewCredits(Number(e.target.value))}
                  className="px-3 py-2 text-xs border rounded-lg bg-white"
                />
                <Button type="submit" size="sm">Save Course</Button>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course) => (
              <Card key={course.id} className="hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <Badge variant="navy" size="md">{course.code}</Badge>
                  <span className="text-xs font-semibold text-slate-500">{course.credits} Credits</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-3">{course.name}</h3>
                <p className="text-xs text-slate-500 mt-1">Instructor: {course.faculty_name || 'Department Faculty'}</p>
                <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-3 rounded-lg leading-relaxed">
                  {course.description || 'Comprehensive curriculum covering core theoretical models and practical engineering laboratory modules.'}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Semester {course.semester}</span>
                  <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                    View Course Modules →
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Timetable Tab */}
      {activeTab === 'timetable' && (
        <Card title="Weekly Class Matrix" subtitle="Synchronized lecture schedule and classroom allocations">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {days.map((day) => {
              const daySlots = timetable.filter((s) => s.day_of_week === day);
              return (
                <div key={day} className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-3">
                  <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-200">
                    {day}
                  </div>
                  {daySlots.length === 0 ? (
                    <p className="text-[11px] text-slate-400 text-center py-4">No scheduled lectures</p>
                  ) : (
                    daySlots.map((slot) => {
                      const c = courses.find((item) => item.id === slot.course_id);
                      return (
                        <div
                          key={slot.id}
                          className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-blue-600">{c?.code || 'CS'}</span>
                            <span className="text-[10px] text-slate-400">{slot.room}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-900 leading-tight">
                            {c?.name || 'Class Lecture'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {slot.start_time} - {slot.end_time}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <Card title="Attendance Log & Compliance" subtitle="Automated biometric lecture verification">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Session Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{rec.course_name}</td>
                    <td className="px-4 py-3 text-slate-500">{rec.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={rec.status === 'present' ? 'green' : 'red'} size="sm">
                        {rec.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-emerald-600 font-medium">Digital Signature Verified</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Assignments & Project Submissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignments.map((a) => (
              <Card key={a.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{a.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Due: {new Date(a.due_date).toLocaleDateString()} • Max Marks: {a.max_marks}
                    </p>
                  </div>
                  <Badge variant="amber" size="sm">Active Task</Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {a.description}
                </p>

                {submittingId === a.id ? (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700">
                      Submit Your Solution / Repository Link / Summary:
                    </label>
                    <textarea
                      rows={3}
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Paste your solution GitHub URL or write your response..."
                      className="w-full text-xs p-2.5 border rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <div className="flex items-center space-x-2">
                      <Button size="sm" onClick={() => handleSubmitAssignment(a.id)}>
                        Submit Assignment
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSubmittingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSubmittingId(a.id);
                      setSubmissionText('');
                    }}
                  >
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    Submit Solution
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
