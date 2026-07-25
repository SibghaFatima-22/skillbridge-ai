import React from "react";
import { BarChart3, TrendingUp, Clock, Trophy, Award, Flame } from "lucide-react";
import { UserProfile } from "../../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

interface AnalyticsViewProps {
  user: UserProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ user }) => {
  const studyHoursData = [
    { day: "Mon", hours: 3.5 },
    { day: "Tue", hours: 4.0 },
    { day: "Wed", hours: 2.5 },
    { day: "Thu", hours: 5.0 },
    { day: "Fri", hours: 3.0 },
    { day: "Sat", hours: 6.0 },
    { day: "Sun", hours: 4.5 },
  ];

  const scoreProgressData = [
    { week: "Wk 1", resume: 65, interview: 50, readiness: 45 },
    { week: "Wk 2", resume: 72, interview: 60, readiness: 58 },
    { week: "Wk 3", resume: 78, interview: 72, readiness: 66 },
    { week: "Wk 4", resume: 82, interview: 78, readiness: user.careerReadiness },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Career Growth Telemetry
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Career Analytics</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track weekly study velocity, score progression, and learning efficiency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Hours Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Daily Study Commitment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total 28.5 Hours logged this week</p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 4.0h Avg
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Velocity Line Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Metric Score Trajectory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Comparing ATS Resume, Interview & Job Readiness</p>
            </div>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Upward Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                <Line type="monotone" dataKey="readiness" stroke="#10b981" strokeWidth={3} name="Readiness" />
                <Line type="monotone" dataKey="resume" stroke="#3b82f6" strokeWidth={2} name="Resume" />
                <Line type="monotone" dataKey="interview" stroke="#f59e0b" strokeWidth={2} name="Interview" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
