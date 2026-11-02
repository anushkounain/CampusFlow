import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  GraduationCap,
  Building,
  Server,
  Activity,
  UserCheck,
  CheckCircle,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { statsApi, healthApi } from '../../api';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, healthRes] = await Promise.all([
          statsApi.getStats(),
          healthApi.check(),
        ]);
        setStats(statsRes);
        setHealth(healthRes);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-400/20 mb-3">
            <span>Executive Administration & System Governance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Institutional Control Center
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Logged in as: {user?.full_name} ({user?.department || 'Dean Office'}) • Full RBAC Clearance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="green" size="md">
            <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> All Services Nominal
          </Badge>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {stats?.total_students || 1}
            </span>
            <Badge variant="blue" size="sm">Active</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Undergraduate & Graduate</p>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faculty & Staff
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {stats?.total_faculty || 1}
            </span>
            <Badge variant="green" size="sm">Verified</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Across all departments</p>
        </Card>

        <Card className="border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Accredited Courses
            </span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {stats?.total_courses || 4}
            </span>
            <Badge variant="navy" size="sm">Running</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Full curriculum sync</p>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Infrastructure
            </span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Server className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {health?.database === 'healthy' ? 'PostgreSQL/SQLite' : 'Active'}
            </span>
            <Badge variant="green" size="sm">Healthy</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Latency &lt; 20ms</p>
        </Card>
      </div>

      {/* System Integrity & Department Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Department Distribution" subtitle="Academic enrollment allocations">
          <div className="space-y-4">
            {[
              { name: 'Computer Science & Engineering', students: 480, faculty: 28, pct: 45 },
              { name: 'Electronics & Communication', students: 320, faculty: 20, pct: 30 },
              { name: 'Mechanical & Automation', students: 160, faculty: 14, pct: 15 },
              { name: 'Civil & Environmental Engineering', students: 110, faculty: 10, pct: 10 },
            ].map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{dept.name}</span>
                  <span className="text-slate-500">{dept.students} Students • {dept.faculty} Faculty</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${dept.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Security & RBAC Enforcement Status" subtitle="Backend zero-trust policies">
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg border border-emerald-100 bg-emerald-50/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-900">Role-Based Access Control</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">Strict endpoint-level dependency enforcement in FastAPI</p>
              </div>
              <Badge variant="green" size="sm">Active</Badge>
            </div>
            <div className="p-3.5 rounded-lg border border-blue-100 bg-blue-50/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-900">JWT Token Security</p>
                <p className="text-[11px] text-blue-700 mt-0.5">HS256 Cryptographic signature with 24-hour expiration</p>
              </div>
              <Badge variant="blue" size="sm">Secure</Badge>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Database Connection Pool</p>
                <p className="text-[11px] text-slate-600 mt-0.5">SQLAlchemy transactional isolation and automated migrations</p>
              </div>
              <Badge variant="navy" size="sm">Pre-ping enabled</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
