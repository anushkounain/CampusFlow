import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Briefcase,
  Users,
  ShoppingBag,
  LogOut,
  ShieldCheck,
  Building2,
  FileText,
  MessageSquare,
  BarChart2,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Academics', to: '/academics', icon: GraduationCap },
    { name: 'AI Study Assistant', to: '/ai-study', icon: Sparkles },
    { name: 'Document RAG', to: '/documents-rag', icon: FileText },
    { name: 'Discussions & Groups', to: '/discussions', icon: MessageSquare },
    { name: 'Career & Placement', to: '/career', icon: Briefcase },
    { name: 'Campus Community', to: '/community', icon: Users },
    { name: 'Marketplace', to: '/marketplace', icon: ShoppingBag },
    { name: 'Analytics & Transcripts', to: '/analytics', icon: BarChart2 },
    ...(user?.role === 'admin'
      ? [{ name: 'Audit Logs', to: '/audit-logs', icon: ShieldCheck }]
      : []),
  ];

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'navy';
      case 'faculty':
        return 'blue';
      case 'placement_coordinator':
        return 'amber';
      case 'student':
      default:
        return 'green';
    }
  };

  const formatRoleName = (role?: string) => {
    switch (role) {
      case 'placement_coordinator':
        return 'Placement Officer';
      case 'admin':
        return 'College Admin';
      case 'faculty':
        return 'Faculty Member';
      case 'student':
        return 'Student';
      default:
        return 'Member';
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">CampusFlow</h1>
            <p className="text-[11px] text-slate-400 font-medium">One campus. Every possibility.</p>
          </div>
        </div>
      </div>

      {/* User Identity Chip */}
      {user && (
        <div className="p-4 mx-4 mt-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-400/30">
              {user.full_name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user.full_name}</p>
              <div className="mt-1">
                <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                  {formatRoleName(user.role)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Campus Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`
              }
            >
              <Icon className="w-4 h-4 mr-3 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info & Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center text-xs text-slate-400 space-x-2 px-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>RBAC Enforcement Active</span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-red-950/40 hover:text-red-400 rounded-lg transition-colors border border-slate-700/60"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
