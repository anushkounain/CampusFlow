import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  PlusCircle,
  CheckCircle2,
  Send,
  Building,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { careerApi } from '../api';
import { JobPosting, JobApplication } from '../types';
import { useAuth } from '../context/AuthContext';

export const CareerPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'openings' | 'applications'>('openings');

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [applyNotes, setApplyNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // New posting form
  const [showAddJob, setShowAddJob] = useState(false);
  const [company, setCompany] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [jobType, setJobType] = useState('Internship');
  const [stipend, setStipend] = useState('₹1,00,000 / month');
  const [location, setLocation] = useState('Bangalore / Hybrid');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [jRes, aRes] = await Promise.all([
          careerApi.getJobs(),
          careerApi.getMyApplications(),
        ]);
        setJobs(jRes);
        setApplications(aRes);
      } catch (err) {
        console.error('Error loading career data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleApply = async (jobId: number) => {
    try {
      const app = await careerApi.applyForJob(jobId, applyNotes);
      setApplications((prev) => [...prev, app]);
      setApplyingId(null);
      setApplyNotes('');
      setMessage('Application successfully submitted to the placement registry.');
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Application failed');
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await careerApi.createJob({
        company_name: company,
        role_title: roleTitle,
        job_type: jobType,
        stipend_or_salary: stipend,
        location,
        requirements,
      });
      setJobs((prev) => [created, ...prev]);
      setShowAddJob(false);
      setCompany('');
      setRoleTitle('');
      setMessage('Opportunity published successfully.');
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to create job');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Career & Placement Hub</h1>
          <p className="text-sm text-slate-500 mt-1">
            Recruitment drives, verified corporate internships, and candidate tracking
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('openings')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'openings'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Drives ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'applications'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Applications ({applications.length})
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Post New Job Form for Placement Coordinators / Admins */}
      {hasRole('placement_coordinator', 'admin') && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setShowAddJob(!showAddJob)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {showAddJob ? 'Cancel' : 'Publish New Opening'}
          </Button>
        </div>
      )}

      {showAddJob && (
        <Card className="border-blue-200 bg-blue-50/20">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Create Placement / Internship Drive</h3>
          <form onSubmit={handleCreateJob} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Company Name (e.g. Google)"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="px-3 py-2 text-xs border rounded-lg bg-white"
            />
            <input
              type="text"
              placeholder="Role Title"
              required
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="px-3 py-2 text-xs border rounded-lg bg-white"
            />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-3 py-2 text-xs border rounded-lg bg-white"
            >
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
            </select>
            <input
              type="text"
              placeholder="Stipend / CTC"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              className="px-3 py-2 text-xs border rounded-lg bg-white"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-3 py-2 text-xs border rounded-lg bg-white"
            />
            <input
              type="text"
              placeholder="Key Skills / Requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="px-3 py-2 text-xs border rounded-lg bg-white"
            />
            <div className="sm:col-span-3 flex justify-end">
              <Button type="submit" size="sm">Publish Opening</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Openings Tab */}
      {activeTab === 'openings' && (
        <div className="space-y-4">
          {jobs.map((job) => {
            const hasApplied = applications.some((a) => a.job_id === job.id);
            return (
              <Card key={job.id} className="hover:border-blue-300 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                        {job.company_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{job.role_title}</h3>
                        <p className="text-xs font-semibold text-slate-600">{job.company_name}</p>
                      </div>
                      <Badge variant={job.job_type === 'Internship' ? 'blue' : 'navy'} size="sm">
                        {job.job_type}
                      </Badge>
                    </div>

                    {job.requirements && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                        <strong className="text-slate-800">Requirements:</strong> {job.requirements}
                      </p>
                    )}

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
                          Apply by: {job.deadline}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {hasApplied ? (
                      <Badge variant="green" size="md">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Application Submitted
                      </Badge>
                    ) : applyingId === job.id ? (
                      <div className="space-y-2 w-64">
                        <textarea
                          rows={2}
                          value={applyNotes}
                          onChange={(e) => setApplyNotes(e.target.value)}
                          placeholder="Brief candidate note / GPA / Key skills..."
                          className="w-full text-xs p-2 border rounded-lg bg-slate-50"
                        />
                        <div className="flex items-center space-x-2">
                          <Button size="sm" onClick={() => handleApply(job.id)}>
                            Confirm Apply
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setApplyingId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => setApplyingId(job.id)}>
                        Apply Now
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* My Applications Tab */}
      {activeTab === 'applications' && (
        <Card title="Submitted Placement Applications" subtitle="Real-time recruiter pipeline updates">
          {applications.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              You haven't submitted any placement applications yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((app) => (
                <div key={app.id} className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Application #{app.id} • Job ID #{app.job_id}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Applied on: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                    {app.notes && (
                      <p className="text-[11px] text-slate-600 mt-1 bg-slate-50 px-2.5 py-1 rounded">
                        Note: {app.notes}
                      </p>
                    )}
                  </div>
                  <Badge variant="blue" size="md">{app.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
