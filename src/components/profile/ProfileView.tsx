import React, { useState } from "react";
import { User, Mail, GraduationCap, Calendar, Target, Github, Linkedin, Edit3, Save, X, CheckCircle2 } from "lucide-react";
import { UserProfile, TargetCareerRole, ExperienceLevel } from "../../types";
import { saveUserProfileToFirestore } from "../../lib/firebase";

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

const isCustomRole = (role: string): boolean => !CAREER_ROLES.includes(role as TargetCareerRole);

export const ProfileView: React.FC<ProfileViewProps> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile & { customCareer?: string }>({
    ...user,
    customCareer: isCustomRole(user.targetCareer) ? user.targetCareer : "",
  });
  const [careerSelection, setCareerSelection] = useState<string>(
    isCustomRole(user.targetCareer) ? "Other" : user.targetCareer
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleOpenEdit = () => {
    setFormData({
      ...user,
      customCareer: isCustomRole(user.targetCareer) ? user.targetCareer : "",
    });
    setCareerSelection(isCustomRole(user.targetCareer) ? "Other" : user.targetCareer);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedCareer =
      careerSelection === "Other"
        ? (formData.customCareer?.trim() || "Software Engineer")
        : careerSelection;

    const updated: UserProfile = {
      ...formData,
      targetCareer: resolvedCareer as TargetCareerRole,
    };

    setUser(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    await saveUserProfileToFirestore(updated.id, updated);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const inputClass = "w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 text-xs";
  const labelClass = "font-bold text-slate-700 dark:text-slate-300 text-xs";

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Profile updated and synced to Firestore successfully!</span>
          </div>
          <button onClick={() => setSavedSuccess(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={user.fullName || "Candidate"}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover ring-4 ring-blue-500/30 shadow-md"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {user.fullName || "Candidate User"}
            </h1>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> {user.targetCareer || "Software Engineer"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {user.university || "University"} • {user.degree || "BS CS"} • {user.semester || ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenEdit}
          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit Candidate Profile</h3>
            <button type="button" onClick={() => setIsEditing(false)} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              Cancel
            </button>
          </div>

          {/* Personal */}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Personal Information</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Full Name</label>
              <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Email Address</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className={labelClass}>Professional Bio</label>
              <textarea rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Brief summary of your technical background..." className={inputClass} />
            </div>
          </div>

          {/* Academic */}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">Academic Background</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>University / College</label>
              <input type="text" value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Degree & Major</label>
              <input type="text" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Current Semester</label>
              <input type="text" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Graduation Year</label>
              <input type="text" value={formData.graduationYear} onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })} className={inputClass} />
            </div>
          </div>

          {/* Career */}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">Career Goals</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Target Career Role</label>
              <select
                value={careerSelection}
                onChange={(e) => setCareerSelection(e.target.value)}
                className={inputClass}
              >
                {CAREER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                <option value="Other">Other (Specify Custom Role)</option>
              </select>
              {careerSelection === "Other" && (
                <input
                  type="text"
                  required
                  placeholder="Describe your target role (e.g. Game Developer)"
                  value={formData.customCareer || ""}
                  onChange={(e) => setFormData({ ...formData, customCareer: e.target.value })}
                  className={`${inputClass} mt-2`}
                />
              )}
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Experience Level</label>
              <select value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })} className={inputClass}>
                {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Links */}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">Online Profiles</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>GitHub Profile URL</label>
              <input type="url" placeholder="https://github.com/yourusername" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>LinkedIn Profile URL</label>
              <input type="url" placeholder="https://linkedin.com/in/yourusername" value={formData.linkedinUrl} onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">About</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {user.bio || "No bio added yet. Click 'Edit Profile' to add your summary."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-900 dark:text-white font-medium truncate">{user.email || "—"}</span>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-900 dark:text-white font-medium truncate">
                {user.university ? `${user.university} (${user.graduationYear})` : "University not specified"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Github className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {user.githubUrl ? (
                <a href={user.githubUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate">{user.githubUrl}</a>
              ) : (
                <span className="text-slate-400">No GitHub link</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Linkedin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {user.linkedinUrl ? (
                <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate">{user.linkedinUrl}</a>
              ) : (
                <span className="text-slate-400">No LinkedIn link</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
