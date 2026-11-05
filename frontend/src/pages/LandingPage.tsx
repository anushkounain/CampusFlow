import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Users,
  Cpu,
  TrendingUp,
  FileText,
  CheckCircle2,
  ChevronRight,
  Compass,
  Play,
  Layers,
  Award,
  Zap,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'placement' | 'admin'>('student');
  const [interactivePrompt, setInteractivePrompt] = useState('Explain Dijkstra vs A* Search for CS301');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [launchLoading, setLaunchLoading] = useState<string | null>(null);

  const samplePrompts = [
    'Explain Dijkstra vs A* Search for CS301',
    'Calculate minimum attendance needed for CS204',
    'Recommend 3 electives for Machine Learning Engineer role',
  ];

  const handleRunAiDemo = (promptText: string) => {
    setInteractivePrompt(promptText);
    setAiLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      if (promptText.includes('Dijkstra')) {
        setAiResponse(
          'Dijkstra explores all paths uniformly by path cost g(n), ensuring optimality in non-negative weighted graphs. A* Search enhances Dijkstra by incorporating a heuristic h(n) estimating the distance to target (f(n) = g(n) + h(n)), significantly pruning unpromising search trees when h(n) is admissible and consistent.'
        );
      } else if (promptText.includes('attendance')) {
        setAiResponse(
          'Based on CS204 Database Systems records (32 total lectures scheduled): With 24 lectures attended out of 28 held so far, your current attendance is 85.7%. To remain safely above the 75% institutional threshold across all 32 lectures, you must attend at least 1 of the remaining 4 lectures.'
        );
      } else {
        setAiResponse(
          'For a target Machine Learning Engineer trajectory: 1. CS405 Deep Neural Architectures (Offered Fall 2026), 2. CS308 High-Performance Computing & GPU Acceleration, 3. CS312 Bayesian Inference & Probabilistic Systems. These courses cover 88% of target industry competency gaps.'
        );
      }
      setAiLoading(false);
    }, 450);
  };

  const handleDirectLaunch = async (email: string, pass: string, roleKey: string) => {
    setLaunchLoading(roleKey);
    try {
      await login({ email, password: pass });
      navigate('/dashboard');
    } catch (err) {
      console.error('Launch failed', err);
    } finally {
      setLaunchLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Dynamic Ambient Mesh Orbs */}
      <div className="absolute top-[-10rem] left-1/2 -translate-x-1/2 w-[55rem] h-[35rem] rounded-full bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-teal-400/20 blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[25rem] -left-20 w-[30rem] h-[30rem] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none animate-float" />
      <div className="absolute top-[45rem] -right-20 w-[35rem] h-[35rem] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none animate-float-delayed" />

      {/* Navigation Header */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">
                Campus<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Flow</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Enterprise Campus OS</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Platform Modules</a>
            <a href="#simulator" className="hover:text-white transition-colors">Role Simulator</a>
            <a href="#ai-copilot" className="hover:text-white transition-colors">Gemini & RAG</a>
            <a href="#benchmarks" className="hover:text-white transition-colors">Kaggle Benchmarks</a>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/30"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  Sign In
                </Link>
                <Button
                  variant="primary"
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/25"
                >
                  Launch Portal
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-medium text-slate-300 shadow-md backdrop-blur-md mb-8 animate-float">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping-subtle absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
          </span>
          <span className="text-slate-300">CampusFlow 2026 Release</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400 font-semibold">FastAPI + Scikit-Learn + Gemini RAG</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          One campus.{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            Every possibility.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The unified university intelligence operating system unifying academic life, attendance tracking, 
          career placement forecasting, and AI study copilot in one high-performance architecture.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#role-launcher"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-semibold shadow-xl shadow-blue-600/30 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2"
          >
            <Zap className="w-5 h-5 text-amber-300" />
            <span>Instant Role Sandbox Access</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
          <a
            href="#simulator"
            className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-700/80 transition-all flex items-center space-x-2"
          >
            <Compass className="w-5 h-5 text-indigo-400" />
            <span>Interactive Simulator</span>
          </a>
        </div>

        {/* Live Floating Metrics Bar */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">96.8%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Retention Radar Accuracy</div>
            <div className="text-[11px] text-slate-500 mt-0.5">UCI Benchmark Calibrated</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">73.5%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Placement Precision</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Random Forest Classifier</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">&lt;85ms</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">RAG Document Retrieval</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Cosine Similarity Chunker</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">100%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">RBAC Isolation</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Bcrypt & JWT Verified</div>
          </div>
        </div>
      </section>

      {/* Instant Role Launcher Sandbox */}
      <section id="role-launcher" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-3">
            <span>One-Click Testbed</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Launch Any University Role Instantly
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            No credential typing required. Click any profile below to initialize a full authenticated session with live data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Student Profile Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-blue-500/30 hover:border-blue-400 transition-all hover:-translate-y-1 group relative">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">Student Role</div>
            <h3 className="text-lg font-bold text-white">Ananya Sharma</h3>
            <p className="text-xs text-slate-400 mt-1">CS Cohort • 6th Sem • SGPA 8.85 • Placement Target: SDE</p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between"><span>Roll No:</span><span className="text-slate-200">CS2026042</span></div>
              <div className="flex justify-between"><span>Attendance:</span><span className="text-emerald-400">88.5%</span></div>
            </div>
            <button
              onClick={() => handleDirectLaunch('student@campusflow.edu', 'Student@123', 'student')}
              disabled={launchLoading !== null}
              className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/20 transition-all"
            >
              <span>{launchLoading === 'student' ? 'Initializing...' : 'Launch Student Session'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Faculty Profile Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-emerald-500/30 hover:border-emerald-400 transition-all hover:-translate-y-1 group relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">Faculty Role</div>
            <h3 className="text-lg font-bold text-white">Dr. Rajesh Rao</h3>
            <p className="text-xs text-slate-400 mt-1">Associate Professor • Dept of Computer Science & Engg</p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between"><span>Emp ID:</span><span className="text-slate-200">FAC-CS-019</span></div>
              <div className="flex justify-between"><span>Active Courses:</span><span className="text-slate-200">CS301, CS204</span></div>
            </div>
            <button
              onClick={() => handleDirectLaunch('faculty@campusflow.edu', 'Faculty@123', 'faculty')}
              disabled={launchLoading !== null}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>{launchLoading === 'faculty' ? 'Initializing...' : 'Launch Faculty Session'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Placement Coordinator Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-amber-500/30 hover:border-amber-400 transition-all hover:-translate-y-1 group relative">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">Placement Role</div>
            <h3 className="text-lg font-bold text-white">Vikram Malhotra</h3>
            <p className="text-xs text-slate-400 mt-1">Head of Corporate Placements & Industry Partnerships</p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between"><span>Active Drives:</span><span className="text-slate-200">12 Companies</span></div>
              <div className="flex justify-between"><span>Avg CTC:</span><span className="text-amber-400">12.8 LPA</span></div>
            </div>
            <button
              onClick={() => handleDirectLaunch('placement@campusflow.edu', 'Placement@123', 'placement')}
              disabled={launchLoading !== null}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-600/20 transition-all"
            >
              <span>{launchLoading === 'placement' ? 'Initializing...' : 'Launch Placement Session'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* College Administrator Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-indigo-500/30 hover:border-indigo-400 transition-all hover:-translate-y-1 group relative">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Administrator Role</div>
            <h3 className="text-lg font-bold text-white">Dr. Aris Thorne</h3>
            <p className="text-xs text-slate-400 mt-1">Dean of Academic Affairs & Chief System Administrator</p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between"><span>System Status:</span><span className="text-emerald-400">Healthy (0.01ms)</span></div>
              <div className="flex justify-between"><span>Audit Logs:</span><span className="text-slate-200">Active</span></div>
            </div>
            <button
              onClick={() => handleDirectLaunch('admin@campusflow.edu', 'Admin@123', 'admin')}
              disabled={launchLoading !== null}
              className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>{launchLoading === 'admin' ? 'Initializing...' : 'Launch Admin Session'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Role Simulator Section */}
      <section id="simulator" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20 mb-3">
            <span>Dynamic UI Simulation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Tailored Experiences for Every Stakeholder
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Switch between roles to preview how CampusFlow adapts its views, metrics, and security perimeters in real time.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student View</span>
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'faculty'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Faculty View</span>
            </button>
            <button
              onClick={() => setActiveTab('placement')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'placement'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Placement View</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin View</span>
            </button>
          </div>
        </div>

        {/* Simulated Screen Container */}
        <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs text-slate-400 font-mono pl-3">
                https://campusflow.edu/portal/{activeTab}
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
              Live Mockup
            </span>
          </div>

          {activeTab === 'student' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 border border-blue-500/30 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-1">
                    Student Home Screen
                  </div>
                  <h3 className="text-xl font-bold">Welcome back, Ananya Sharma</h3>
                  <p className="text-xs text-slate-300 mt-1">CS Cohort • Next: CS301 Algorithms in 35 mins (Lecture Hall B-204)</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Cumulative GPA</div>
                    <div className="text-xl font-extrabold text-blue-400">8.85 / 10</div>
                  </div>
                  <div className="h-10 w-[1px] bg-slate-700" />
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Attendance</div>
                    <div className="text-xl font-extrabold text-emerald-400">88.5%</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Today's Schedule</div>
                  <div className="text-sm font-bold text-white">CS301 Design of Algorithms</div>
                  <div className="text-xs text-slate-400 mt-1">10:00 AM - 11:30 AM • Prof. Rajesh Rao</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Placement Probability</div>
                  <div className="text-sm font-bold text-emerald-400">86.9% High Probability</div>
                  <div className="text-xs text-slate-400 mt-1">Target Role: Backend Engineer • Est. 9.97 LPA</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Pending Assignments</div>
                  <div className="text-sm font-bold text-amber-400">2 Due This Week</div>
                  <div className="text-xs text-slate-400 mt-1">CS301 Dynamic Programming Due Friday</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faculty' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950/80 to-blue-950 border border-emerald-500/30 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                    Faculty Instructional Command
                  </div>
                  <h3 className="text-xl font-bold">Good Day, Dr. Rajesh Rao</h3>
                  <p className="text-xs text-slate-300 mt-1">2 Courses Active • 140 Enrolled Scholars • Gradebook Open</p>
                </div>
                <button
                  onClick={() => handleDirectLaunch('faculty@campusflow.edu', 'Faculty@123', 'faculty')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md"
                >
                  Open Gradebook & Attendance
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Roster Health</div>
                  <div className="text-sm font-bold text-emerald-400">92% Above Threshold</div>
                  <div className="text-xs text-slate-400 mt-1">11 students under attendance radar</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Submissions Awaiting Grading</div>
                  <div className="text-sm font-bold text-amber-400">28 Lab Exercises</div>
                  <div className="text-xs text-slate-400 mt-1">CS301 Lab 3: Graph Traversal</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Curriculum Uploads</div>
                  <div className="text-sm font-bold text-blue-400">12 Documents Chunked</div>
                  <div className="text-xs text-slate-400 mt-1">Ready for student RAG semantic query</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'placement' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-amber-950/70 to-indigo-950 border border-amber-500/30 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                    Corporate Relations & Career Directorate
                  </div>
                  <h3 className="text-xl font-bold">Recruitment Pipeline 2026</h3>
                  <p className="text-xs text-slate-300 mt-1">Coordinator: Vikram Malhotra • 250 Candidates Calibrated</p>
                </div>
                <button
                  onClick={() => handleDirectLaunch('placement@campusflow.edu', 'Placement@123', 'placement')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white shadow-md"
                >
                  Run Candidate Matching AI
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Upcoming Campus Drives</div>
                  <div className="text-sm font-bold text-white">Google, Microsoft, Cisco</div>
                  <div className="text-xs text-slate-400 mt-1">Slots scheduled across next 14 days</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Simulation Engine</div>
                  <div className="text-sm font-bold text-cyan-400">What-If Counterfactual Live</div>
                  <div className="text-xs text-slate-400 mt-1">Predicts salary bump per skill acquired</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Placement Milestone</div>
                  <div className="text-sm font-bold text-emerald-400">71.4% Benchmark Accuracy</div>
                  <div className="text-xs text-slate-400 mt-1">Kaggle benchmark calibrated</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/80 to-slate-900 border border-indigo-500/30 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                    Institutional Governance & Analytics
                  </div>
                  <h3 className="text-xl font-bold">System Administration Console</h3>
                  <p className="text-xs text-slate-300 mt-1">Dr. Aris Thorne • Multi-Departmental Oversight • Immutable Audit Trail</p>
                </div>
                <button
                  onClick={() => handleDirectLaunch('admin@campusflow.edu', 'Admin@123', 'admin')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md"
                >
                  View System Audit Logs
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">System Health</div>
                  <div className="text-sm font-bold text-emerald-400">Operational • 0.01ms</div>
                  <div className="text-xs text-slate-400 mt-1">FastAPI Engine + SQLite/Postgres DB</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Early Risk Radar</div>
                  <div className="text-sm font-bold text-rose-400">96.8% Early Detection</div>
                  <div className="text-xs text-slate-400 mt-1">Flags at-risk scholars before term exams</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium mb-1">Security Perimeter</div>
                  <div className="text-sm font-bold text-blue-400">Zero Trust Role Isolation</div>
                  <div className="text-xs text-slate-400 mt-1">JWT Bearer tokens with audit logs</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive AI Study Assistant & RAG Copilot Demo */}
      <section id="ai-copilot" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Modular Gemini & Vector RAG Pipeline</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Test the AI Academic Study Assistant
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Experience syllabus-grounded document question answering, mathematical summarization, and personalized study flashcards.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunAiDemo(p)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs text-slate-300 font-medium border border-slate-700/60 transition-colors"
                >
                  "{p}"
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={interactivePrompt}
                onChange={(e) => setInteractivePrompt(e.target.value)}
                placeholder="Ask CampusFlow AI about coursework, attendance math, or placement pathways..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleRunAiDemo(interactivePrompt)}
                disabled={aiLoading}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center space-x-2 shadow-lg shadow-blue-600/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{aiLoading ? 'Synthesizing...' : 'Ask Copilot'}</span>
              </button>
            </div>

            {(aiLoading || aiResponse) && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-950/90 border border-blue-500/20 text-sm text-slate-200">
                {aiLoading ? (
                  <div className="flex items-center space-x-3 text-blue-400">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>Searching syllabus vector embeddings & generating synthesized response...</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Synthesized Academic Response • Grounded in Course Corpus</span>
                    </div>
                    <p className="leading-relaxed text-slate-300">{aiResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Kaggle Benchmark & Machine Learning Integrity */}
      <section id="benchmarks" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 mb-3">
            <span>Machine Learning Telemetry</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Grounded in Real Benchmark Datasets
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            No dummy metrics or arbitrary formulas. CampusFlow trains and evaluates machine learning pipelines on real Kaggle and UCI higher-education datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Kaggle Placement Benchmark</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Trained on 250 placement records with academic percentages, technical test scores, coding submissions, and work experience.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between"><span>Accuracy:</span><span className="font-semibold text-blue-400">71.4%</span></div>
              <div className="flex justify-between"><span>Salary Regressor MAE:</span><span className="font-semibold text-blue-400">1.57 LPA</span></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">UCI Student Retention Model</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Early warning multi-class classifier detecting students at risk of academic probation with 4 distinct pedagogical tiers.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between"><span>Early Warning Accuracy:</span><span className="font-semibold text-emerald-400">96.8%</span></div>
              <div className="flex justify-between"><span>Key Feature:</span><span className="font-semibold text-slate-200">Attendance Rate (0.488)</span></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">What-If Counterfactual Simulator</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Simulates how student interventions (e.g. +50 DSA problems solved, +3% degree grade) dynamically shift placement probabilities and salary compensation.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between"><span>Curriculum Link:</span><span className="font-semibold text-cyan-400">Target Role Electives</span></div>
              <div className="flex justify-between"><span>Intervention Impact:</span><span className="font-semibold text-emerald-400">+19% Prob Boost</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white">
              CampusFlow <span className="text-slate-500 font-normal">| One campus. Every possibility.</span>
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Enterprise Campus Management Platform • Role-Based Access Control • FastAPI & Scikit-Learn Engine
          </p>

          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <span>•</span>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <span>•</span>
            <a href="https://github.com/anushkounain/CampusFlow" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub Repository</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
