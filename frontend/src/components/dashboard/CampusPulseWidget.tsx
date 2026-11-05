import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Send,
} from 'lucide-react';
import { Button } from '../common/Button';

interface CampusPulseWidgetProps {
  attendanceRate?: number;
  cgpa?: number;
  nextLecture?: {
    courseCode: string;
    courseTitle: string;
    time: string;
    room: string;
    instructor: string;
  };
  role?: string;
}

export const CampusPulseWidget: React.FC<CampusPulseWidgetProps> = ({
  attendanceRate = 88.5,
  cgpa = 8.85,
  nextLecture = {
    courseCode: 'CS301',
    courseTitle: 'Design & Analysis of Algorithms',
    time: '10:00 AM - 11:30 AM',
    room: 'Hall B-204',
    instructor: 'Prof. Rajesh Rao',
  },
  role = 'student',
}) => {
  const navigate = useNavigate();
  const [quickQuery, setQuickQuery] = useState('');

  // Circular gauge math for attendance
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attendanceRate / 100) * circumference;

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    navigate(`/ai-study?q=${encodeURIComponent(quickQuery.trim())}`);
  };

  const getAttendanceStatus = (rate: number) => {
    if (rate >= 85) return { label: 'Optimal Margin', color: 'text-emerald-400', stroke: '#10b981' };
    if (rate >= 75) return { label: 'Standard Safe', color: 'text-amber-400', stroke: '#f59e0b' };
    return { label: 'Attendance Risk (<75%)', color: 'text-rose-400', stroke: '#f43f5e' };
  };

  const status = getAttendanceStatus(attendanceRate);

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border border-indigo-500/30 shadow-xl shadow-indigo-950/20 text-white relative overflow-hidden backdrop-blur-md">
      {/* Subtle interior gradient flare */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Section: Next Academic Slot */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping-subtle absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
              Live Campus Pulse • Fall 2026
            </span>
          </div>

          <div>
            <div className="text-xs text-blue-300 font-medium">Upcoming Session</div>
            <div className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2 mt-0.5">
              <span>{nextLecture.courseCode} — {nextLecture.courseTitle}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {nextLecture.time}
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {nextLecture.room}
              </span>
              <span className="text-slate-400">• {nextLecture.instructor}</span>
            </div>
          </div>
        </div>

        {/* Center: Circular Attendance Gauge */}
        <div className="flex items-center space-x-5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="#1e293b"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke={status.stroke}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-base font-extrabold text-white">{attendanceRate}%</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Attendance</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-300">Biometric Register</div>
            <div className={`text-xs font-bold ${status.color}`}>{status.label}</div>
            <div className="text-[11px] text-slate-400">Institutional Rule: Min 75.0%</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3 h-3" />
              Eligible for Term Finals
            </div>
          </div>
        </div>

        {/* Right Section: SGPA & Quick Navigation */}
        <div className="flex lg:flex-col justify-between items-end gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Cumulative Grade Pointer</div>
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              {cgpa.toFixed(2)} / 10.0
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">Dean's Honor Roll Trajectory</div>
          </div>

          <button
            onClick={() => navigate('/placement-ai')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-semibold text-indigo-200 transition-colors flex items-center gap-1.5"
          >
            <span>Run Career AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Home Screen AI Prompt Bar */}
      <form onSubmit={handleQuickAsk} className="mt-5 pt-4 border-t border-slate-800/80 flex gap-2">
        <div className="relative flex-1">
          <Sparkles className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Ask Campus AI Copilot about syllabi, notes, attendance formulas, or job skills..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/25 transition-all"
        >
          <span>Ask Copilot</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
