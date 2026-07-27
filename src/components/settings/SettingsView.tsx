import React from "react";
import { Settings, Moon, Sun, Bell, Shield, Key, Sparkles, CheckCircle2 } from "lucide-react";

interface SettingsViewProps {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ theme, setTheme }) => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5" /> Preferences & Security
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure theme mode, notifications, and AI credentials.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Appearance Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" /> Appearance Theme
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 p-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                theme === "dark"
                  ? "bg-slate-900 text-white border-blue-500"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Moon className="w-4 h-4 text-amber-400" /> Dark Mode
            </button>
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 p-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                theme === "light"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" /> Light Mode
            </button>
          </div>
        </div>

        {/* Gemini Key Status */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" /> Gemini AI Engine Integration
          </h3>
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> GEMINI_API_KEY Active (Server-Side Proxy)
            </div>
            <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-200">
              const AI_MODEL = "gemini-flash-latest";
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
