import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Code,
  Layers,
  Database,
  Wrench,
  User,
  Target,
  BookOpen,
  Loader2,
  Award,
  RefreshCw,
} from "lucide-react";
import { AssessmentData, TargetCareerRole, SkillRating, RoadmapData, UserProfile } from "../../types";
import { analyzeAssessmentAPI, generateRoadmapAPI, generateRoleSkillsAPI } from "../../lib/api";

interface AssessmentWizardProps {
  assessment: AssessmentData;
  setAssessment: (asm: AssessmentData) => void;
  roadmap?: RoadmapData;
  setRoadmap?: (rdm: RoadmapData) => void;
  setActiveTab: (tab: string) => void;
  addNotification?: (title: string, message: string, type?: "info" | "success" | "warning" | "achievement") => void;
  user?: UserProfile;
}

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({
  assessment,
  setAssessment,
  roadmap,
  setRoadmap,
  setActiveTab,
  addNotification,
  user,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingSkills, setFetchingSkills] = useState(false);

  // Clean Initial States
  const [personalInfo, setPersonalInfo] = useState(assessment.personalInfo || {
    university: "",
    semester: "",
    degree: "BS Computer Science",
    graduationYear: "2026",
  });

  // Use user's profile targetCareer as default, fall back to existing assessment or "Backend Developer"
  const [targetCareer, setTargetCareer] = useState<TargetCareerRole | string>(
    assessment.careerGoals?.targetCareer ||
    (user?.targetCareer as TargetCareerRole) ||
    "Backend Developer"
  );
  const [customRoleText, setCustomRoleText] = useState("");

  const [programmingSkills, setProgrammingSkills] = useState<SkillRating[]>(
    assessment.programmingSkills?.length > 0 ? assessment.programmingSkills : []
  );

  const [frameworks, setFrameworks] = useState<SkillRating[]>(
    assessment.frameworks?.length > 0 ? assessment.frameworks : []
  );

  const [databases, setDatabases] = useState<SkillRating[]>(
    assessment.databases?.length > 0 ? assessment.databases : []
  );

  const [tools, setTools] = useState<SkillRating[]>(
    assessment.tools?.length > 0 ? assessment.tools : []
  );

  const [softSkills, setSoftSkills] = useState<SkillRating[]>(
    assessment.softSkills?.length > 0 ? assessment.softSkills : [
      { name: "Problem Solving (DSA)", category: "Analytical", rating: 0 },
      { name: "System Architecture", category: "Design", rating: 0 },
      { name: "Technical Communication", category: "Soft Skill", rating: 0 },
    ]
  );

  const [targetSalary, setTargetSalary] = useState(assessment.careerGoals?.targetSalary || "$80,000");
  const [learningStyle, setLearningStyle] = useState(assessment.learningStyle || "Hands-on Projects");
  const [dailyHours, setDailyHours] = useState(assessment.dailyHours || 3);

  const careerOptions: TargetCareerRole[] = [
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

  // Fetch dynamic skills from Gemini AI based on target career role
  const loadDynamicSkills = async (roleToFetch: string) => {
    setFetchingSkills(true);
    try {
      const skillsData = await generateRoleSkillsAPI(roleToFetch);
      if (skillsData) {
        if (skillsData.programmingSkills) setProgrammingSkills(skillsData.programmingSkills);
        if (skillsData.frameworks) setFrameworks(skillsData.frameworks);
        if (skillsData.databases) setDatabases(skillsData.databases);
        if (skillsData.tools) setTools(skillsData.tools);
      }
    } catch (err) {
      console.warn("Could not fetch dynamic skills:", err);
    } finally {
      setFetchingSkills(false);
    }
  };

  useEffect(() => {
    // Auto load dynamic skills based on user's profile targetCareer if skills are empty
    const roleToLoad =
      assessment.careerGoals?.targetCareer ||
      (user?.targetCareer as string) ||
      targetCareer;
    if (programmingSkills.length === 0) {
      loadDynamicSkills(roleToLoad);
      // Also sync the displayed targetCareer with the user's profile role
      if (!assessment.careerGoals?.targetCareer && user?.targetCareer) {
        setTargetCareer(user.targetCareer as TargetCareerRole);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleSelect = (selectedRole: string) => {
    setTargetCareer(selectedRole as TargetCareerRole);
    loadDynamicSkills(selectedRole);
  };

  const updateRating = (
    setList: React.Dispatch<React.SetStateAction<SkillRating[]>>,
    name: string,
    rating: number
  ) => {
    setList((prev) => prev.map((item) => (item.name === name ? { ...item, rating } : item)));
  };

  const handleFinish = async () => {
    setLoading(true);

    const resolvedRole = targetCareer === "Other" ? (customRoleText.trim() || "Software Engineer") : targetCareer;

    const payload = {
      personalInfo,
      programmingSkills: programmingSkills.filter((s) => s.rating > 0),
      frameworks: frameworks.filter((s) => s.rating > 0),
      databases: databases.filter((s) => s.rating > 0),
      tools: tools.filter((s) => s.rating > 0),
      softSkills: softSkills.filter((s) => s.rating > 0),
      careerGoals: { targetCareer: resolvedRole, preferredCompanyType: "Tech SaaS", targetSalary },
      learningStyle,
      dailyHours,
    };

    const result = await analyzeAssessmentAPI(payload);

    const updatedAssessment: AssessmentData = {
      id: "asm_" + Date.now(),
      userId: assessment.userId,
      personalInfo,
      programmingSkills,
      frameworks,
      databases,
      tools,
      softSkills,
      careerGoals: { targetCareer: resolvedRole as TargetCareerRole, preferredCompanyType: "Tech SaaS", targetSalary },
      learningStyle,
      dailyHours,
      overallScore: result.overallScore || 80,
      careerReadiness: result.careerReadiness || 78,
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
      missingSkills: result.missingSkills || [],
      careerRecommendation: result.careerRecommendation || "",
      estimatedLearningTime: result.estimatedLearningTime || "3 Months",
      recommendedTechnologies: result.recommendedTechnologies || [],
      summary: result.summary || "",
      createdAt: new Date().toISOString(),
    };

    setAssessment(updatedAssessment);

    if (setRoadmap) {
      const allRatedSkills = [
        ...programmingSkills,
        ...frameworks,
        ...databases,
        ...tools,
      ];
      const currentSkills = allRatedSkills
        .filter((s) => s.rating >= 3)
        .map((s) => s.name);
      const weakSkillNames = allRatedSkills
        .filter((s) => s.rating <= 2 && s.rating > 0)
        .map((s) => s.name);
      const missingSkills = (updatedAssessment.missingSkills.length > 0
        ? updatedAssessment.missingSkills
        : weakSkillNames
      );

      const roadmapResult = await generateRoadmapAPI({
        targetCareer: resolvedRole,
        currentSkills,
        missingSkills,
        dailyHours,
        durationMonths: 3,
      });

      if (roadmapResult) {
        setRoadmap({
          id: "rdm_" + Date.now(),
          userId: assessment.userId,
          career: (roadmapResult.career || resolvedRole) as TargetCareerRole,
          estimatedMonths: roadmapResult.estimatedMonths || 3,
          estimatedWeeks: roadmapResult.estimatedWeeks || 12,
          difficulty: roadmapResult.difficulty || "Intermediate",
          summary: roadmapResult.summary || `Personalized AI roadmap for ${resolvedRole}.`,
          progress: 0,
          capstoneProject: roadmapResult.capstoneProject || roadmap?.capstoneProject,
          milestones: (roadmapResult.milestones || []).map((m: any, idx: number) => ({
            ...m,
            id: `m_${idx + 1}`,
            completed: false,
            weeklyTasks: (m.weeklyTasks || []).map((t: any, tidx: number) => ({
              ...t,
              id: `t_${idx + 1}_${tidx + 1}`,
              completed: false,
            })),
          })),
          createdAt: new Date().toISOString(),
        });
      }
    }

    setLoading(false);
    setStep(9); // Completion Screen

    if (addNotification) {
      addNotification(
        "Career Assessment Completed 🎉",
        `Assessment complete! Readiness updated to ${updatedAssessment.careerReadiness}%. View your customized AI roadmap.`,
        "achievement"
      );
    }
  };

  const renderSkillRatingSection = (
    title: string,
    skills: SkillRating[],
    setSkills: React.Dispatch<React.SetStateAction<SkillRating[]>>
  ) => (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rate your proficiency for <strong>{targetCareer}</strong> from 1 (Novice) to 5 (Expert).
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadDynamicSkills(targetCareer)}
          disabled={fetchingSkills}
          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1.5"
        >
          {fetchingSkills ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          <span>Re-generate Skills</span>
        </button>
      </div>

      {fetchingSkills ? (
        <div className="py-12 text-center text-xs text-slate-400 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
          <p>Generating dynamic AI skill matrix for {targetCareer}...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {skills.map((s) => (
            <div
              key={s.name}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">{s.name}</div>
                <div className="text-[10px] text-slate-400">{s.category}</div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateRating(setSkills, s.name, star)}
                    className={`w-6 h-6 rounded-lg text-xs font-bold transition-all ${
                      s.rating >= star
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Dynamic Skill Diagnostic
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Career Skill Assessment</h1>
          <p className="text-xs text-slate-400 mt-1">
            Target Role: <strong className="text-blue-400 font-bold">{targetCareer}</strong> • Step {step} of 8.
          </p>
        </div>

        <div className="text-right font-black text-2xl text-blue-400">{Math.round((step / 8) * 100)}%</div>
      </div>

      {/* Wizard Steps */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Academic Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">University / College</label>
                <input
                  type="text"
                  placeholder="e.g. FAST-NUCES / NUST / University"
                  value={personalInfo.university}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, university: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Degree</label>
                <input
                  type="text"
                  placeholder="e.g. BS Computer Science"
                  value={personalInfo.degree}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, degree: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Current Semester</label>
                <input
                  type="text"
                  placeholder="e.g. 6th Semester"
                  value={personalInfo.semester}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, semester: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Target Graduation Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2026"
                  value={personalInfo.graduationYear}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, graduationYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && renderSkillRatingSection("Programming & Core Languages", programmingSkills, setProgrammingSkills)}
        {step === 3 && renderSkillRatingSection("Frameworks & Tech Stack", frameworks, setFrameworks)}
        {step === 4 && renderSkillRatingSection("Databases & Storage Layers", databases, setDatabases)}
        {step === 5 && renderSkillRatingSection("DevOps, Tools & Infrastructure", tools, setTools)}
        {step === 6 && renderSkillRatingSection("Soft Skills & Problem Solving", softSkills, setSoftSkills)}

        {step === 7 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Target Software Engineering Role</h3>
            <p className="text-xs text-slate-500">Selecting a role instantly re-generates Gemini AI dynamic skills for your diagnostic evaluation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {careerOptions.map((roleOption) => (
                <div
                  key={roleOption}
                  onClick={() => handleRoleSelect(roleOption)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    targetCareer === roleOption
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-100 font-bold shadow-md"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400"
                  }`}
                >
                  <span>{roleOption}</span>
                  {targetCareer === roleOption && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                </div>
              ))}
              <div
                onClick={() => setTargetCareer("Other")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  targetCareer === "Other"
                    ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-100 font-bold shadow-md"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400"
                }`}
              >
                <span>Other (Custom Role)</span>
                {targetCareer === "Other" && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
              </div>
            </div>
            {targetCareer === "Other" && (
              <input
                type="text"
                placeholder="Type your custom target role..."
                value={customRoleText}
                onChange={(e) => setCustomRoleText(e.target.value)}
                onBlur={() => loadDynamicSkills(customRoleText)}
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              />
            )}
          </div>
        )}

        {step === 8 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Learning Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Daily Study Hours Dedicated</label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                >
                  <option value={1}>1 Hour / day</option>
                  <option value={2}>2 Hours / day</option>
                  <option value={3}>3 Hours / day (Recommended)</option>
                  <option value={4}>4+ Hours / day</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Preferred Learning Style</label>
                <select
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                >
                  <option value="Hands-on Projects">Hands-on Projects & Builds</option>
                  <option value="Video Tutorials">Interactive Video Courses</option>
                  <option value="Documentation">Official Tech Documentation</option>
                  <option value="Interactive Coding">Interactive Coding Challenges</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="text-center py-8 space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Assessment Analyzed & Dynamic AI Roadmap Generated!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Your overall readiness score is <strong>{assessment.careerReadiness}%</strong>. Gemini AI has generated your personalized 12-week learning roadmap for <strong>{assessment.careerGoals.targetCareer}</strong>.
            </p>
            <button
              onClick={() => setActiveTab("roadmap")}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2"
            >
              <span>View Custom AI Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Wizard Controls */}
        {step <= 8 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              disabled={step === 1 || loading}
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-40 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step < 8 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Analyze & Generate AI Roadmap</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
