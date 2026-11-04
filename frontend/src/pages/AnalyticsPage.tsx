import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  DollarSign,
  BarChart2,
  Calendar,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { analyticsApi } from '../api';
import { GradebookSummary } from '../types';

export const AnalyticsPage: React.FC = () => {
  const [gradebook, setGradebook] = useState<GradebookSummary | null>(null);
  const [attendanceRisks, setAttendanceRisks] = useState<any[]>([]);
  const [placementStats, setPlacementStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [gbRes, arRes, psRes] = await Promise.all([
          analyticsApi.getGradebook(),
          analyticsApi.getAttendanceRisks().catch(() => []),
          analyticsApi.getPlacementStats(),
        ]);
        setGradebook(gbRes);
        setAttendanceRisks(arRes);
        setPlacementStats(psRes);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Institutional & Academic Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Official semester transcripts, SGPA/CGPA trajectories, attendance risk audits, and placement conversion stats
        </p>
      </div>

      {/* KPI Cards */}
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
              {gradebook?.cumulative_cgpa?.toFixed(2) || '8.84'}
            </span>
            <Badge variant="green" size="sm">Top 5% Cohort</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Scale of 10.0</p>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Credits Earned
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {gradebook?.total_credits_earned || 118} / 160
            </span>
            <span className="text-xs font-medium text-slate-500">Degree Ready</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Undergraduate B.Tech Degree</p>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average CTC
            </span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              ₹{placementStats?.average_ctc_lpa || 14.8} LPA
            </span>
            <Badge variant="blue" size="sm">Engineering</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Highest: ₹44.5 LPA</p>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Attendance Alert Radar
            </span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {attendanceRisks.length} Students
            </span>
            <Badge variant={attendanceRisks.length > 0 ? 'red' : 'green'} size="sm">
              {attendanceRisks.length > 0 ? 'Action Req' : 'Zero Risk'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Below 75% compliance</p>
        </Card>
      </div>

      {/* Semester Gradebook Breakdown */}
      <Card title="Official Academic Transcript & Semester Breakdown" subtitle="Course-wise letter grades and grade points">
        <div className="space-y-6">
          {gradebook?.semesters?.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No grade records generated yet.</p>
          ) : (
            gradebook?.semesters?.map((sem) => (
              <div key={sem.semester} className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Semester {sem.semester}</h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-500">{sem.total_credits} Total Credits</span>
                    <Badge variant="blue" size="md">SGPA: {sem.sgpa.toFixed(2)}</Badge>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {sem.courses.map((course, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-blue-600">{course.course_code}</span>
                          <span className="text-sm font-semibold text-slate-800">{course.course_name}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{course.credit_hours} Credits • {course.remarks}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            course.letter_grade.startsWith('A')
                              ? 'green'
                              : course.letter_grade.startsWith('B')
                              ? 'blue'
                              : 'amber'
                          }
                          size="md"
                        >
                          Grade: {course.letter_grade} ({course.grade_point} pts)
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
