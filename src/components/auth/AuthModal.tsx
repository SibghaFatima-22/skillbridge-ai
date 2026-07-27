import React, { useState } from "react";
import {
  User, Lock, Mail, Sparkles, LogIn, UserPlus, X,
  GraduationCap, Target, Github, Linkedin, Building, Calendar, Loader2, CheckCircle2, KeyRound
} from "lucide-react";
import { UserProfile, TargetCareerRole, ExperienceLevel } from "../../types";
import {
  signUpWithEmail,
  signInWithEmail,
  resetPasswordEmail,
  getAuthErrorMessage,
  saveUserProfileToFirestore
} from "../../lib/firebase";
import { storage } from "../../lib/storage";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserProfile) => void;
  currentUser: UserProfile;
  presetUsers: UserProfile[];
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  currentUser,
  presetUsers,
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Reset Password form
  const [forgotEmail, setForgotEmail] = useState("");

  // Signup form - all required fields
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("BS Computer Science");
  const [semester, setSemester] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [targetCareer, setTargetCareer] = useState<TargetCareerRole | "Other">("Full Stack Developer");
  const [customCareer, setCustomCareer] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("Beginner (0-1 yrs)");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  if (!isOpen) return null;

  const buildUserProfile = (uid: string, photoURL: string, emailArg: string, nameArg: string): UserProfile => {
    const resolvedCareer = targetCareer === "Other" ? (customCareer.trim() || "Software Engineer") : targetCareer;
    return {
      id: uid,
      fullName: nameArg,
      email: emailArg,
      photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      university: university.trim(),
      degree: degree.trim(),
      semester: semester.trim(),
      graduationYear: graduationYear.trim(),
      targetCareer: resolvedCareer as TargetCareerRole,
      experienceLevel,
      bio: `${nameArg} is a ${resolvedCareer} candidate studying ${degree} at ${university || "University"}.`,
      githubUrl: githubUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      portfolioUrl: "",
      careerReadiness: 0,
      roadmapProgress: 0,
      resumeScore: 0,
      interviewScore: 0,
      plan: "Pro",
      theme: "dark",
      createdAt: new Date().toISOString(),
    };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccess(null);

    if (!EMAIL_REGEX.test(loginEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (loginPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const firebaseUser = await signInWithEmail(loginEmail, loginPassword);
      // Load saved profile from local storage or construct from firebase user
      const savedProfile = storage.getUserProfile(firebaseUser.uid);
      const profile = (savedProfile?.id === firebaseUser.uid)
        ? savedProfile
        : {
          id: firebaseUser.uid,
          fullName: firebaseUser.displayName || loginEmail.split("@")[0],
          email: loginEmail,
          photoURL: firebaseUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          university: "",
          degree: "",
          semester: "",
          graduationYear: "",
          targetCareer: "Full Stack Developer" as TargetCareerRole,
          experienceLevel: "Beginner (0-1 yrs)" as ExperienceLevel,
          bio: "",
          githubUrl: "",
          linkedinUrl: "",
          portfolioUrl: "",
          careerReadiness: 0,
          roadmapProgress: 0,
          resumeScore: 0,
          interviewScore: 0,
          plan: "Pro" as const,
          theme: "dark" as const,
          createdAt: new Date().toISOString(),
        };
      onSelectUser(profile);
      onClose();
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccess(null);

    if (!EMAIL_REGEX.test(forgotEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordEmail(forgotEmail.trim());
      setResetSuccess(`Password reset email sent to ${forgotEmail}. Please check your inbox.`);
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccess(null);

    // Validate all fields
    if (!fullName.trim()) { setError("Please enter your full name."); return; }
    if (!EMAIL_REGEX.test(signupEmail)) { setError("Please enter a valid email address."); return; }
    if (signupPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (signupPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    if (!university.trim()) { setError("Please enter your university name."); return; }
    if (!semester.trim()) { setError("Please enter your current semester."); return; }
    if (!graduationYear.trim()) { setError("Please enter your graduation year."); return; }
    if (targetCareer === "Other" && !customCareer.trim()) { setError("Please specify your custom career role."); return; }

    setLoading(true);
    try {
      const firebaseUser = await signUpWithEmail(signupEmail, signupPassword, fullName.trim());
      const profile = buildUserProfile(
        firebaseUser.uid,
        firebaseUser.photoURL || "",
        signupEmail,
        fullName.trim()
      );
      storage.setUserProfile(profile);
      await saveUserProfileToFirestore(profile.id, profile);
      onSelectUser(profile);
      onClose();
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors";
  const labelClass = "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 p-6 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> SkillBridge AI
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {activeTab === "login" && "Welcome Back!"}
            {activeTab === "signup" && "Create Candidate Account"}
            {activeTab === "forgot" && "Reset Password"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeTab === "login" && "Sign in to access your personalized career dashboard."}
            {activeTab === "signup" && "Fill in your details to get started with AI career coaching."}
            {activeTab === "forgot" && "Enter your email to receive a password reset link."}
          </p>
        </div>

        {/* Tabs */}
        {activeTab !== "forgot" && (
          <div className="mx-6 grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl text-xs font-bold mb-4">
            <button
              onClick={() => { setActiveTab("login"); setError(null); setResetSuccess(null); }}
              className={`py-2 rounded-xl transition-all ${activeTab === "login" ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab("signup"); setError(null); setResetSuccess(null); }}
              className={`py-2 rounded-xl transition-all ${activeTab === "signup" ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
            >
              Register New
            </button>
          </div>
        )}

        {/* Error / Success Banners */}
        {error && (
          <div className="mx-6 mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <X className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="mx-6 mb-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 pb-6 flex-1">
          {/* ── LOGIN ── */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" required placeholder="you@university.edu" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className={`${inputClass} pl-9`} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={labelClass}>Password</label>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("forgot"); setForgotEmail(loginEmail); setError(null); setResetSuccess(null); }}
                    className="text-xs font-bold text-blue-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" required placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={`${inputClass} pl-9`} />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  <span>Sign In to Dashboard</span>
                </button>

                <p className="text-center text-[11px] text-slate-500 pt-2">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => { setActiveTab("signup"); setError(null); }} className="text-blue-500 font-bold hover:underline">Register here</button>
                </p>
              </div>
            </form>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {activeTab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className={labelClass}>Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" required placeholder="you@university.edu" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className={`${inputClass} pl-9`} />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>Send Password Reset Email</span>
                </button>

                <button type="button" onClick={() => { setActiveTab("login"); setError(null); setResetSuccess(null); }} className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ── SIGNUP ── */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-3">
              {/* Personal Info */}
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-1">Personal Information</div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" required placeholder="e.g. Ali Hassan" value={fullName} onChange={(e) => setFullName(e.target.value)} className={`${inputClass} pl-9`} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" required placeholder="you@university.edu" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className={`${inputClass} pl-9`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="password" required placeholder="Min 6 chars" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className={`${inputClass} pl-9`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Confirm Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="password" required placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputClass} pl-9`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-2">Academic Background</div>

              <div>
                <label className={labelClass}>University / College *</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" required placeholder="e.g. FAST-NUCES, NUST, COMSATS" value={university} onChange={(e) => setUniversity(e.target.value)} className={`${inputClass} pl-9`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Degree</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="BS Computer Science" value={degree} onChange={(e) => setDegree(e.target.value)} className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Current Semester *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" required placeholder="e.g. 6th Semester" value={semester} onChange={(e) => setSemester(e.target.value)} className={`${inputClass} pl-9`} />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Expected Graduation Year *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" required placeholder="e.g. 2026" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} className={`${inputClass} pl-9`} />
                </div>
              </div>

              {/* Career Goals */}
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-2">Career Goals</div>

              <div>
                <label className={labelClass}>Target Career Role *</label>
                <div className="relative">
                  <Target className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={targetCareer}
                    onChange={(e) => setTargetCareer(e.target.value as TargetCareerRole | "Other")}
                    className={`${inputClass} pl-9`}
                  >
                    {CAREER_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                    <option value="Other">Other (Specify Custom Role)</option>
                  </select>
                </div>
                {targetCareer === "Other" && (
                  <input
                    type="text"
                    required
                    placeholder="Describe your target career role (e.g. Game Developer, Blockchain Engineer)"
                    value={customCareer}
                    onChange={(e) => setCustomCareer(e.target.value)}
                    className={`${inputClass} mt-2`}
                  />
                )}
              </div>

              <div>
                <label className={labelClass}>Experience Level</label>
                <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)} className={inputClass}>
                  {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Links */}
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-2">Online Profiles (Optional)</div>

              <div>
                <label className={labelClass}>GitHub Profile URL</label>
                <div className="relative">
                  <Github className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="url" placeholder="https://github.com/yourusername" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className={`${inputClass} pl-9`} />
                </div>
              </div>

              <div>
                <label className={labelClass}>LinkedIn Profile URL</label>
                <div className="relative">
                  <Linkedin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="url" placeholder="https://linkedin.com/in/yourusername" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className={`${inputClass} pl-9`} />
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>Create Candidate Account</span>
                </button>

                <p className="text-center text-[11px] text-slate-500 pt-1">
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setActiveTab("login"); setError(null); }} className="text-blue-500 font-bold hover:underline">Sign in</button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
