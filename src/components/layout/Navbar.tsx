import React, { useState } from "react";
import {
  Bell,
  Sun,
  Moon,
  Menu,
  Sparkles,
  CheckCheck,
  Briefcase,
  Trophy,
  RefreshCw,
  LogOut,
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
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  notifications,
  setNotifications,
  setActiveTab,
  theme,
  setTheme,
  setIsMobileOpen,
  onOpenAuthModal,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      {/* Mobile Toggle & Active Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 md:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            Target Role:
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
            {user.targetCareer || "Software Engineer"}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* AI Mentor Quick Launch */}
        <button
          onClick={() => setActiveTab("mentor")}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Mentor</span>
        </button>

        {/* Account Switcher Button */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 font-bold text-xs transition-all"
          title="Switch Account or Sign In"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">Account</span>
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 font-bold text-xs transition-all"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
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
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                        {notif.title}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <button
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={user.fullName || "Candidate"}
        >
          <img
            src={user.photoURL}
            alt={user.fullName || "User"}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
          />
        </button>
      </div>
    </header>
  );
};
