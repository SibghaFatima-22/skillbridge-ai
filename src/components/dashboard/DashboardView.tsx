import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Award,
  TrendingUp,
  Flame,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  FileText,
  Video,
  Briefcase,
  Github,
  Zap,
  Target,
  RefreshCw,
  Clock,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { UserProfile, AssessmentData, RoadmapData, JobMatch } from "../../types";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getDashboardInsightsAPI } from "../../lib/api";

interface DashboardViewProps {
  user: UserProfile;
  assessment: AssessmentData;
  roadmap: RoadmapData;
  jobs: JobMatch[];
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  assessment,
  roadmap,
  jobs,
  setActiveTab,
}) => {
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoadingInsights(true);
    const data = await getDashboardInsightsAPI({
      targetCareer: user.targetCareer,
      careerReadiness: user.careerReadiness,
      resumeScore: user.resumeScore,
      interviewScore: user.interviewScore,
    });
    setInsights(data);
    setLoadingInsights(false);
  };

  // Skill Radar Data
  const radarData = [
    { subject: "Languages", A: 85, fullMark: 100 },
    { subject: "Frameworks", A: 78, fullMark: 100 },
    { subject: "Databases", A: 82, fullMark: 100 },
    { subject: "DevTools", A: 68, fullMark: 100 },
    { subject: "DSA Logic", A: 80, fullMark: 100 },
    { subject: "System Design", A: 60, fullMark: 100 },
  ];

  // Career Progress Trend
  const trendData = [
    { month: "Month 1", readiness: 45 },
    { month: "Month 2", readiness: 58 },
    { month: "Month 3", readiness: 66 },
    { month: "Month 4", readiness: 72 },
    { month: "Current", readiness: user.careerReadiness },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Bento Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Welcome Card (Wide - 8 Cols) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-blue-600/10 via-indigo-500/10 to-blue-50 dark:from-blue-700/20 dark:via-indigo-900/10 dark:to-slate-900 border border-blue-200 dark:border-blue-500/30 rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> AI Career Coach Active
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Good day, {user.fullName}! 👋
            </h1>
            <p className="text-slate-600 dark:text-blue-200/80 max-w-lg text-xs md:text-sm leading-relaxed">
              Your <span className="font-semibold text-slate-900 dark:text-white">{user.targetCareer}</span> career path is <span className="font-bold text-emerald-600 dark:text-emerald-400">{user.careerReadiness}%</span> ready. You are 3 milestones away from being job-ready for top-tier tech roles.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab("roadmap")}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all w-fit shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab("mentor")}
                className="bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Ask AI Mentor</span>
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />
        </div>

        {/* Career Readiness Circular Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          <div className="relative w-32 h-32 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-200 dark:text-slate-800"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="326"
                strokeDashoffset={326 - (326 * user.careerReadiness) / 100}
                className="text-emerald-500 transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-3xl font-extrabold text-slate-900 dark:text-white">
              {user.careerReadiness}<span className="text-sm font-semibold text-slate-400">%</span>
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Career Readiness</h3>
          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-widest flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Market Competitiveness: High
          </p>
        </div>
      </div>

      {/* 4 Metric Bento Grid Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ATS Resume Score Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ATS Resume</span>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md uppercase border border-emerald-500/20">
              Verified
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{user.resumeScore}%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Top 15% candidate ATS rating</p>
          </div>
          <button
            onClick={() => setActiveTab("resume-builder")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 pt-1"
          >
            Edit Resume <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mock Interview Rating */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mock Interview</span>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-md uppercase border border-amber-500/20">
              Strong Hire
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{user.interviewScore}%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Completed 3 AI Mock Sessions</p>
          </div>
          <button
            onClick={() => setActiveTab("interview")}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 pt-1"
          >
            Start Practice <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Job Match Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Fit Score</span>
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-md uppercase border border-purple-500/20">
              4 Hot Roles
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{user.jobMatchScore}%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Matching Google, Vercel & Stripe</p>
          </div>
          <button
            onClick={() => setActiveTab("job-matcher")}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 pt-1"
          >
            View Matches <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Streak & XP Tile */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Streak & XP</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold rounded-md uppercase border border-amber-500/30">
              Level {user.level}
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-amber-500 flex items-center gap-1">
              <Flame className="w-6 h-6 fill-amber-500 inline" /> {user.currentStreak} Days
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.xp} Total Career XP Points</p>
          </div>
          <button
            onClick={() => setActiveTab("achievements")}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 pt-1"
          >
            View Badges <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle Bento Row: AI Career Insight + Active Roadmap + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* AI Career Mentor Insight (Indigo Bento Tile - 4 Cols) */}
        <div className="lg:col-span-4 bg-indigo-600 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-2xl">💡</div>
            <button
              onClick={loadInsights}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Refresh Insights"
            >
              <RefreshCw className={`w-4 h-4 ${loadingInsights ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="my-4 space-y-2">
            <h4 className="font-bold text-lg leading-tight">AI Mentor Insight</h4>
            <p className="text-xs text-indigo-100 leading-relaxed">
              {insights?.recommendedAction || "Backend roles in FinTech are growing 12% faster. Focus on PostgreSQL query optimization & Redis caching layers."}
            </p>
            {insights?.motivationQuote && (
              <p className="text-[11px] italic text-indigo-200/80 border-l-2 border-indigo-300 pl-2 mt-2">
                "{insights.motivationQuote}"
              </p>
            )}
          </div>

          <button
            onClick={() => setActiveTab("mentor")}
            className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl text-center transition-all border border-white/20"
          >
            Explore Industry Trends →
          </button>
        </div>

        {/* Active Roadmap Timeline Tile (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Roadmap</h3>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Week 4 of 12</span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] flex-shrink-0" />
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mt-1" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Weeks 1-3 • Completed</p>
                  <p className="text-xs text-slate-900 dark:text-white font-semibold">Node.js System Architecture</p>
                </div>
              </div>

              <div className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mt-1" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Week 4 • In Progress</p>
                  <p className="text-xs text-slate-900 dark:text-white font-semibold">PostgreSQL & Query Optimization</p>
                </div>
              </div>

              <div className="flex gap-3.5 opacity-60">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full flex-shrink-0" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Week 5 • Upcoming</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Redis Distributed Caching</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("roadmap")}
            className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80"
          >
            <span>Open Interactive Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Actions Bento Tile (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Platform Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setActiveTab("roadmap")}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 text-left transition-all group"
              >
                <BookOpen className="w-4 h-4 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Roadmap</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">64% Done</div>
              </button>

              <button
                onClick={() => setActiveTab("resume-builder")}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 text-left transition-all group"
              >
                <FileText className="w-4 h-4 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">ATS Resume</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Export PDF</div>
              </button>

              <button
                onClick={() => setActiveTab("interview")}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 text-left transition-all group"
              >
                <Video className="w-4 h-4 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">AI Coach</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Mock Session</div>
              </button>

              <button
                onClick={() => setActiveTab("github")}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 text-left transition-all group"
              >
                <Github className="w-4 h-4 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">GitHub AI</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Code Audit</div>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-3 text-center border-t border-slate-100 dark:border-slate-800/80">
            Powered by Gemini API
          </div>
        </div>
      </div>

      {/* Bento Row: Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Skill Matrix Radar Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Skill Matrix Radar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Evaluated against {user.targetCareer} benchmarks</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/30">
              Verified
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#94a3b8" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 9 }} />
                <Radar name="Ali Ahmed" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Progression Area Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Career Readiness Trajectory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly diagnostic progression</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +31% total growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="readiness" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#readinessGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Matching Job Recommendations Teaser */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-500" /> Top Matched Roles for You
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Based on your skills & roadmap completion</p>
          </div>
          <button
            onClick={() => setActiveTab("job-matcher")}
            className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
          >
            View All Jobs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.slice(0, 2).map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3"
            >
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{job.jobTitle}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{job.company} • {job.location}</div>
                <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">{job.salary}</div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-500/20">
                  {job.matchPercentage}% Match
                </span>
                <button
                  onClick={() => setActiveTab("job-matcher")}
                  className="mt-3 block text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Apply Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
