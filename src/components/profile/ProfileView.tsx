import React, { useState, useEffect } from "react";
import { User, Mail, GraduationCap, Calendar, Target, Github, Linkedin, Award, MapPin, Edit3, Save, X, Sparkles, CheckCircle2, Database, LogIn, LogOut, RefreshCw } from "lucide-react";
import { UserProfile, TargetCareerRole, ExperienceLevel } from "../../types";
import { auth, loginWithGoogle, logoutUser } from "../../lib/firebase";
import { syncUserWithFirestore } from "../../lib/firebaseSync";

interface ProfileViewProps {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
}

const CAREER_ROLES: TargetCareerRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "AI Engineer",
  "ML Engineer",
  "Data Scientist",
  "Cloud Engineer",
  "DevOps Engineer",
  "Cyber Security Engineer",
  "Mobile Developer",
  "UI/UX Designer",
];

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "Beginner (0-1 yrs)",
  "Intermediate (1-3 yrs)",
  "Advanced (3+ yrs)",
];

export const ProfileView: React.FC<ProfileViewProps> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleOpenEdit = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    // Sync to Firestore
    setIsSyncing(true);
    await syncUserWithFirestore(user.id, formData);
    setIsSyncing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    try {
      if (auth.currentUser) {
        await logoutUser();
      } else {
        const loggedUser = await loginWithGoogle();
        if (loggedUser) {
          const updated: UserProfile = {
            ...user,
            id: loggedUser.uid,
            fullName: loggedUser.displayName || user.fullName,
            email: loggedUser.email || user.email,
            photoURL: loggedUser.photoURL || user.photoURL,
          };
          setUser(updated);
          await syncUserWithFirestore(loggedUser.uid, updated);
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncUserWithFirestore(user.id, user);
    setIsSyncing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Profile and Firestore database synced successfully!</span>
          </div>
          <button onClick={() => setSavedSuccess(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Firebase Cloud Sync Tile */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600/10 via-slate-100 to-indigo-600/10 dark:from-blue-900/40 dark:via-slate-900 dark:to-indigo-900/40 border border-blue-200 dark:border-blue-500/30 text-slate-900 dark:text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400">
            <Database className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Firebase Firestore Sync</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {auth.currentUser 
                ? `Logged in as ${auth.currentUser.email}. All roadmap progress, assessment scores, and resumes are saved to cloud.`
                : "Your career assessment, roadmaps, and interview feedback are synced with Firebase Firestore."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-500" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Database"}</span>
          </button>

          <button
            onClick={handleGoogleAuth}
            disabled={authLoading}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            {auth.currentUser ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
            <span>{auth.currentUser ? "Sign Out" : "Sign In with Google"}</span>
          </button>
        </div>
      </div>

      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.photoURL}
            alt={user.fullName}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/30"
          />

          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user.fullName}</h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center justify-center md:justify-start gap-2">
              <GraduationCap className="w-4 h-4 text-blue-500" /> {user.degree} • {user.university}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 font-semibold border border-blue-500/30">
                Target: {user.targetCareer}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-semibold border border-emerald-500/30">
                Graduation: {user.graduationYear}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenEdit}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 self-center md:self-start"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Profile Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Contact & Academic Overview
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Email Address</span>
              <span className="font-semibold">{user.email}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">University</span>
              <span className="font-semibold">{user.university}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Current Semester</span>
              <span className="font-semibold">{user.semester}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Experience Level</span>
              <span className="font-semibold">{user.experienceLevel}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="text-slate-400">Streak Record</span>
              <span className="font-semibold text-amber-500">{user.currentStreak} Days</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Professional Profiles & Bio
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2 text-slate-400"><Github className="w-4 h-4 text-slate-900 dark:text-white" /> GitHub</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{user.githubUrl || "github.com/aliahmed"}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2 text-slate-400"><Linkedin className="w-4 h-4 text-blue-500" /> LinkedIn</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{user.linkedinUrl || "linkedin.com/in/aliahmed"}</span>
            </div>
            {user.bio && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs italic">
                "{user.bio}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto scrollbar-none">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile Details</h2>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">University</label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Degree</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Semester</label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Graduation Year</label>
                  <input
                    type="text"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Target Career Role</label>
                  <select
                    value={formData.targetCareer}
                    onChange={(e) => setFormData({ ...formData, targetCareer: e.target.value as TargetCareerRole })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                  >
                    {CAREER_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Experience Level</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                  >
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">GitHub Profile URL</label>
                  <input
                    type="text"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Avatar Photo URL</label>
                <input
                  type="text"
                  value={formData.photoURL}
                  onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Short Bio / Career Goals</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Passionate CS student aiming to master backend distributed systems..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

