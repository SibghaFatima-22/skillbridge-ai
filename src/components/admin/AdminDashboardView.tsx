import React from "react";
import { ShieldCheck, Users, Activity, Server, Database, CheckCircle2 } from "lucide-react";

export const AdminDashboardView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Admin Console
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Admin & System Health</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Platform telemetry, Gemini endpoint response times, and student diagnostic logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Active Students</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">1,248</div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-1">+14% this month</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Roadmaps Generated</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">3,890</div>
          <div className="text-[11px] text-blue-500 font-semibold mt-1">Avg 12s generation</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Mock Interviews</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">8,412</div>
          <div className="text-[11px] text-amber-500 font-semibold mt-1">98.4% STAR graded</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-400 font-bold uppercase">Server Uptime</div>
          <div className="text-2xl font-black text-emerald-400 mt-2">99.98%</div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-1">Cloud Run Active</div>
        </div>
      </div>
    </div>
  );
};
