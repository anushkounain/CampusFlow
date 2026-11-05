import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle,
  HelpCircle,
  UserCheck,
  Search,
  Sparkles,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { intelligenceApi } from '../api';
import { CohortRiskOverview, AcademicRiskAssessmentResult } from '../types';

export const AcademicRiskAdvisorPage: React.FC = () => {
  const [cohort, setCohort] = useState<CohortRiskOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Individual Student Evaluator form
  const [showEvaluator, setShowEvaluator] = useState(false);
  const [studyHours, setStudyHours] = useState(14.0);
  const [attendance, setAttendance] = useState(82.0);
  const [midterm, setMidterm] = useState(72.0);
  const [quiz, setQuiz] = useState(75.0);
  const [assignmentRate, setAssignmentRate] = useState(85.0);
  const [failures, setFailures] = useState(0);
  const [customResult, setCustomResult] = useState<AcademicRiskAssessmentResult | null>(null);
  const [evalLoading, setEvalLoading] = useState(false);

  useEffect(() => {
    async function loadCohort() {
      try {
        const res = await intelligenceApi.getCohortRisk();
        setCohort(res);
      } catch (err) {
        console.error('Failed to load cohort risk overview', err);
      } finally {
        setLoading(false);
      }
    }
    loadCohort();
  }, []);

  const handleEvaluateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvalLoading(true);
    try {
      const res = await intelligenceApi.assessAcademicRisk({
        study_hours_weekly: studyHours,
        attendance_rate: attendance,
        midterm_avg: midterm,
        quiz_avg: quiz,
        assignment_completion_rate: assignmentRate,
        past_failures: failures,
        extracurricular_hours: 6.0,
      });
      setCustomResult(res);
    } catch (err) {
      console.error('Evaluation failed', err);
    } finally {
      setEvalLoading(false);
    }
  };

  const getRiskBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'CRITICAL_RISK':
        return 'red';
      case 'MODERATE_RISK':
        return 'amber';
      case 'DEANS_LIST':
        return 'navy';
      case 'GOOD_STANDING':
      default:
        return 'green';
    }
  };

  const filteredStudents = cohort?.students?.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Academic Retention Early Warning System (UCI Benchmark)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Academic Risk & Advisory Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Machine learning early detection of course dropouts, attendance violations, and academic probation
          </p>
        </div>

        <Button size="sm" onClick={() => setShowEvaluator(!showEvaluator)}>
          <Sparkles className="w-4 h-4 mr-2" />
          {showEvaluator ? 'Close Simulator' : 'Simulate Single Student'}
        </Button>
      </div>

      {/* Cohort Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dean's List / Honors</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">{cohort?.summary?.DEANS_LIST || 1} Students</div>
          <p className="text-xs text-slate-400 mt-1">CGPA &gt; 8.75 & Attendance &gt; 88%</p>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Good Standing</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">{cohort?.summary?.GOOD_STANDING || 3} Students</div>
          <p className="text-xs text-slate-400 mt-1">Normal academic velocity</p>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Moderate Risk</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">{cohort?.summary?.MODERATE_RISK || 0} Students</div>
          <p className="text-xs text-slate-400 mt-1">Advisory meeting recommended</p>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Risk</span>
          <div className="mt-2 text-2xl font-bold text-slate-900">{cohort?.summary?.CRITICAL_RISK || 0} Students</div>
          <p className="text-xs text-slate-400 mt-1">Immediate remedial action required</p>
        </Card>
      </div>

      {/* Evaluator Modal */}
      {showEvaluator && (
        <Card className="border-blue-200 bg-blue-50/20" title="Simulate Candidate Academic Profile">
          <form onSubmit={handleEvaluateCustom} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Weekly Study Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={studyHours}
                  onChange={(e) => setStudyHours(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Attendance Rate (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={attendance}
                  onChange={(e) => setAttendance(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Midterm Exam Score (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={midterm}
                  onChange={(e) => setMidterm(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assignment Rate (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={assignmentRate}
                  onChange={(e) => setAssignmentRate(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Past Backlogs / Failures</label>
                <input
                  type="number"
                  value={failures}
                  onChange={(e) => setFailures(parseInt(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" size="sm" isLoading={evalLoading} className="w-full">
                  Run Classifier Assessment
                </Button>
              </div>
            </div>

            {customResult && (
              <div className="mt-4 p-4 rounded-xl border border-blue-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Predicted Classification: <Badge variant={getRiskBadgeVariant(customResult.risk_category)} size="md">{customResult.risk_category}</Badge>
                  </span>
                  <span className="text-xs text-slate-500">Confidence: {(customResult.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs font-bold text-slate-700">Actionable Interventions:</p>
                  <ul className="list-disc list-inside text-xs text-slate-600 mt-1 space-y-1">
                    {customResult.actionable_interventions.map((inv, idx) => (
                      <li key={idx}>{inv}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </form>
        </Card>
      )}

      {/* Cohort Table */}
      <Card title="Undergraduate Cohort Risk Radar" subtitle="Live student assessments updated automatically">
        <div className="mb-4">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or roll..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border rounded-lg"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Roll Number</th>
                <th className="px-4 py-3">Current CGPA</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Retention Classification</th>
                <th className="px-4 py-3">Prescribed Advisory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.student_id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono">{s.roll_number}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{s.current_cgpa.toFixed(2)}</td>
                  <td className="px-4 py-3">{s.attendance_rate.toFixed(1)}%</td>
                  <td className="px-4 py-3">
                    <Badge variant={getRiskBadgeVariant(s.risk_category)} size="sm">
                      {s.risk_category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-sm truncate">
                    {s.interventions[0] || 'Maintain trajectory'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
