import React, { useEffect, useState } from 'react';
import { Bell, Search, Activity } from 'lucide-react';
import { healthApi } from '../../api';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'checking' | 'error'>('checking');

  useEffect(() => {
    let mounted = true;
    async function checkHealth() {
      try {
        const res = await healthApi.check();
        if (mounted) {
          setHealthStatus(res.status === 'healthy' ? 'healthy' : 'error');
        }
      } catch {
        if (mounted) setHealthStatus('error');
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Search Input */}
      <div className="flex items-center w-80">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses, timetables, jobs, campus..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-5">
        {/* System Health Status Indicator */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200/70 text-slate-600">
          <Activity
            className={`w-3.5 h-3.5 ${
              healthStatus === 'healthy'
                ? 'text-emerald-500 animate-pulse'
                : healthStatus === 'error'
                ? 'text-red-500'
                : 'text-amber-500'
            }`}
          />
          <span className="text-[11px]">
            API: {healthStatus === 'healthy' ? 'Connected (v1.0)' : healthStatus === 'error' ? 'Degraded' : 'Checking...'}
          </span>
        </div>

        {/* Current Academic Term */}
        <div className="hidden md:flex text-xs text-slate-500 font-medium bg-blue-50/60 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100">
          Academic Year 2026-27 • Sem VI
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Mini Profile */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.full_name}</p>
            <p className="text-[10px] text-slate-500">{user?.department || 'Engineering'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
