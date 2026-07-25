import React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  BookOpen,
  FileText,
  FileSearch,
  Video,
  Briefcase,
  Github,
  MessageSquare,
  BarChart3,
  Trophy,
  User,
  Settings,
  ShieldCheck,
  Globe,
  Sparkles,
  Flame,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { UserProfile } from "../../types";

import logoImg from "../../assets/images/skillbridge_logo_1784917378061.jpg";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "assessment", label: "Career Assessment", icon: ClipboardList, badge: "AI" },
    { id: "roadmap", label: "Career Roadmap", icon: Map, badge: "64%" },
    { id: "resources", label: "Learning Resources", icon: BookOpen, badge: null },
    { id: "resume-builder", label: "AI Resume Builder", icon: FileText, badge: "ATS" },
    { id: "resume-analyzer", label: "Resume Analyzer", icon: FileSearch, badge: `${user.resumeScore}%` },
    { id: "interview", label: "AI Interview Coach", icon: Video, badge: "Practice" },
    { id: "job-matcher", label: "Job Matcher", icon: Briefcase, badge: `${user.jobMatchScore}%` },
    { id: "github", label: "GitHub Analyzer", icon: Github, badge: "New" },
    { id: "mentor", label: "AI Mentor 24/7", icon: MessageSquare, badge: "Live" },
    { id: "analytics", label: "Career Analytics", icon: BarChart3, badge: null },
    { id: "achievements", label: "Achievements", icon: Trophy, badge: `${user.xp} XP` },
  ];

  const secondaryItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "admin", label: "Admin Console", icon: ShieldCheck },
    { id: "landing", label: "Public Website", icon: Globe },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Top Header Logo */}
      <div>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelect("dashboard")}>
            <img
              src={logoImg}
              alt="SkillBridge AI Logo"
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-500/30 shadow-md"
            />
            <div>
              <div className="font-black text-slate-900 dark:text-white text-base tracking-tight flex items-center gap-1.5 uppercase">
                SkillBridge <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/30 lowercase">ai</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">CS Career Platform</div>
            </div>
          </div>
        </div>

        {/* User Quick Readiness Widget */}
        <div className="mx-3 my-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Job Readiness
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{user.careerReadiness}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${user.careerReadiness}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <Flame className="w-3 h-3 fill-amber-500" /> {user.currentStreak}d Streak
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold">{user.targetCareer}</span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)] scrollbar-none py-1">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                        : "bg-slate-200/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-300/60 dark:border-slate-700/60"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Account & System</div>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 opacity-60" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Account Tile */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
        <div
          onClick={() => handleSelect("profile")}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/80 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL}
              alt={user.fullName}
              className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700"
            />
            <div className="truncate max-w-[130px]">
              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.fullName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.degree}</div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSelect("landing");
            }}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
