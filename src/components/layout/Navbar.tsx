import React, { useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Sparkles,
  CheckCheck,
  Briefcase,
  Trophy,
  Flame,
  X,
} from "lucide-react";
import { UserProfile, NotificationItem } from "../../types";

interface NavbarProps {
  user: UserProfile;
  notifications: NotificationItem[];
  setNotifications: (notifs: NotificationItem[]) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  setIsMobileOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  notifications,
  setNotifications,
  setActiveTab,
  theme,
  setTheme,
  setIsMobileOpen,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    if (query.includes("resume")) setActiveTab("resume-builder");
    else if (query.includes("interview")) setActiveTab("interview");
    else if (query.includes("roadmap")) setActiveTab("roadmap");
    else if (query.includes("job")) setActiveTab("job-matcher");
    else if (query.includes("github")) setActiveTab("github");
    else if (query.includes("resource")) setActiveTab("resources");
    else setActiveTab("mentor");
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      {/* Mobile Toggle & Search / Breadcrumb */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 md:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search roadmaps, resume tips, jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Streak Counter */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          <Flame className="w-4 h-4 fill-amber-500" />
          <span>{user.currentStreak} Day Streak</span>
        </div>

        {/* AI Mentor Quick Launch */}
        <button
          onClick={() => setActiveTab("mentor")}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Mentor</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">No notifications right now</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border transition-all text-xs ${
                        notif.read
                          ? "bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                          : "bg-blue-50/70 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40 text-slate-900 dark:text-slate-100 font-medium"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {notif.type === "achievement" && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                          {notif.type === "info" && <Briefcase className="w-3.5 h-3.5 text-blue-500" />}
                          {notif.title}
                        </div>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Clickable */}
        <button
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <img
            src={user.photoURL}
            alt={user.fullName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
          />
        </button>
      </div>
    </header>
  );
};
