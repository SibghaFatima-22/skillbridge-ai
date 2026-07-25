import React from "react";
import { Trophy, Flame, Zap, Award, CheckCircle2, ShieldAlert } from "lucide-react";
import { UserProfile, AchievementBadge } from "../../types";

interface AchievementsViewProps {
  user: UserProfile;
  badges: AchievementBadge[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ user, badges }) => {
  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" /> Gamified Progress & Badges
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Level {user.level} Career Engineer</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Earn XP points by completing weekly roadmap tasks, practicing AI interviews, and scanning resumes.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="text-right">
            <div className="text-xl font-black text-amber-500">{user.xp} XP</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Total Career Points</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
              badge.unlocked
                ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
                : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-60"
            }`}
          >
            <div className="text-3xl p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {badge.icon}
            </div>

            <div className="space-y-1">
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>{badge.title}</span>
                {badge.unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{badge.description}</p>
              {badge.unlockedAt && (
                <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 pt-1">
                  Unlocked {badge.unlockedAt}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
