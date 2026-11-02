import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, GraduationCap, Briefcase, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
    setLoading(true);
    try {
      await login({ email: userEmail, password: userPass });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-slate-900 text-white items-center justify-center shadow-lg shadow-slate-900/10 mb-4">
          <Building2 className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">CampusFlow</h2>
        <p className="mt-1 text-sm text-slate-500 font-medium">One campus. Every possibility.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200/80 sm:rounded-2xl space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Campus Email Address</label>
              <div className="mt-1 relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@campusflow.edu"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Account Password</label>
              <div className="mt-1 relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
                />
              </div>
            </div>

            <Button type="submit" isLoading={loading} className="w-full mt-2" size="lg">
              Sign In to CampusFlow <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Instant Role Demo Logins */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              Fast Demo Credentials (1-Click Test)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student@campusflow.edu', 'Student@123')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Student</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">student@campusflow.edu</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('faculty@campusflow.edu', 'Faculty@123')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">Faculty</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">faculty@campusflow.edu</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('placement@campusflow.edu', 'Placement@123')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-800">Placement</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">placement@campusflow.edu</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@campusflow.edu', 'Admin@123')}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Admin</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">admin@campusflow.edu</p>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Need a new account?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                Register as Student or Faculty
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
