import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building,
  CheckCircle,
  TrendingUp,
  PlusCircle,
  Users,
  MapPin,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { careerApi } from '../../api';
import { JobPosting } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const PlacementDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const jRes = await careerApi.getJobs();
        setJobs(jRes);
      } catch (err) {
        console.error('Failed to load placement dashboard', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-8 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-400/20 mb-3">
            <span>Career & Industry Relations Directorate</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Placement Command Center
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Coordinator: {user?.full_name} • Office of Career Services • 2026 Graduating Cohort
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/career')}
            className="bg-blue-600 hover:bg-blue-500"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Post New Opportunity
          </Button>
        </div>
      </div>

      {/* Placement Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Drives
            </span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{jobs.length} Companies</span>
            <Badge variant="blue" size="sm">Recruiting</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Tier-1 & Core tech sectors</p>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Placement Rate
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">88.6%</span>
            <Badge variant="green" size="sm">+4.2% YoY</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Target: 95% by end of session</p>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Highest Package
            </span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">₹44.5 LPA</span>
            <Badge variant="amber" size="sm">Record</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Average: ₹14.8 LPA</p>
        </Card>

        <Card className="border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Eligible Students
            </span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">420</span>
            <Badge variant="green" size="sm">Verified</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">All criteria validated</p>
        </Card>
      </div>

      {/* Active Corporate Recruiters */}
      <Card
        title="Active Corporate Recruiters & Openings"
        subtitle="Manage recruitment pipelines and candidate rosters"
        action={
          <Button size="sm" variant="outline" onClick={() => navigate('/career')}>
            Manage All Drives
          </Button>
        }
      >
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h4 className="text-base font-bold text-slate-900">{job.company_name}</h4>
                  <Badge variant={job.job_type === 'Internship' ? 'blue' : 'navy'} size="sm">
                    {job.job_type}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-blue-600">{job.role_title}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {job.stipend_or_salary}
                  </span>
                  {job.deadline && (
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Deadline: {job.deadline}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => navigate('/career')}>
                  View Applicants
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
