import React, { useState } from "react";
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
} from "lucide-react";
import { AssessmentData, TargetCareerRole, SkillRating } from "../../types";
import { analyzeAssessmentAPI } from "../../lib/api";

interface AssessmentWizardProps {
  assessment: AssessmentData;
  setAssessment: (asm: AssessmentData) => void;
  setActiveTab: (tab: string) => void;
  addNotification?: (title: string, message: string, type?: "info" | "success" | "warning" | "achievement") => void;
}

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({
  assessment,
  setAssessment,
  setActiveTab,
  addNotification,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [personalInfo, setPersonalInfo] = useState(assessment.personalInfo);
  const [programmingSkills, setProgrammingSkills] = useState<SkillRating[]>(assessment.programmingSkills);
  const [frameworks, setFrameworks] = useState<SkillRating[]>(assessment.frameworks);
  const [databases, setDatabases] = useState<SkillRating[]>(assessment.databases);
  const [tools, setTools] = useState<SkillRating[]>(assessment.tools);
  const [softSkills, setSoftSkills] = useState<SkillRating[]>(assessment.softSkills);
  const [targetCareer, setTargetCareer] = useState<TargetCareerRole>(assessment.careerGoals.targetCareer);
  const [targetSalary, setTargetSalary] = useState(assessment.careerGoals.targetSalary || "$80,000 - $110,000");
  const [learningStyle, setLearningStyle] = useState(assessment.learningStyle);
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

  const updateRating = (list: SkillRating[], setList: (l: SkillRating[]) => void, name: string, rating: number) => {
    setList(list.map((item) => (item.name === name ? { ...item, rating } : item)));
  };

  const handleFinish = async () => {
    setLoading(true);
    const payload = {
      personalInfo,
      programmingSkills,
      frameworks,
      databases,
      tools,
      softSkills,
      careerGoals: { targetCareer, preferredCompanyType: "Tech SaaS", targetSalary },
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
      careerGoals: { targetCareer, preferredCompanyType: "Tech SaaS", targetSalary },
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
    setLoading(false);
    setStep(9); // Completion Screen

    if (addNotification) {
      addNotification(
        "Career Assessment Completed 🎉",
        `Assessment complete! Readiness updated to ${updatedAssessment.careerReadiness}%. View your customized learning roadmap.`,
        "achievement"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> 8-Step Career Diagnostic
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">AI Skill Diagnostic Wizard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Step {step > 8 ? 8 : step} of 8 • {step === 9 ? "Diagnostic Complete" : "Personalizing roadmap & readiness score"}
          </p>
        </div>

        {/* Step Progress Pills */}
        <div className="hidden sm:flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                s === step
                  ? "bg-blue-500 ring-4 ring-blue-500/30 scale-110"
                  : s < step
                  ? "bg-emerald-500"
                  : "bg-slate-800 border border-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal & Academic Background</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Where are you currently in your Computer Science journey?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">University / Institute</label>
                <input
                  type="text"
                  value={personalInfo.university}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, university: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Degree Program</label>
                <input
                  type="text"
                  value={personalInfo.degree}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, degree: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current Semester / Year</label>
                <input
                  type="text"
                  value={personalInfo.semester}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, semester: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Expected Graduation Year</label>
                <input
                  type="text"
                  value={personalInfo.graduationYear}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, graduationYear: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Programming Languages */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Programming Languages</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rate your confidence level in core programming languages (1 to 5 stars).</p>
              </div>
            </div>

            <div className="space-y-4">
              {programmingSkills.map((skill) => (
                <div key={skill.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{skill.name}</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateRating(programmingSkills, setProgrammingSkills, skill.name, star)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          star <= skill.rating
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Frameworks */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Frameworks & Libraries</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Which backend and frontend frameworks have you built projects with?</p>
              </div>
            </div>

            <div className="space-y-4">
              {frameworks.map((skill) => (
                <div key={skill.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{skill.name}</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateRating(frameworks, setFrameworks, skill.name, star)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          star <= skill.rating
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Databases */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Databases & Persistence</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Relational databases, NoSQL, and caching stores.</p>
              </div>
            </div>

            <div className="space-y-4">
              {databases.map((skill) => (
                <div key={skill.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{skill.name}</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateRating(databases, setDatabases, skill.name, star)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          star <= skill.rating
                            ? "bg-purple-600 text-white shadow-sm"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Dev Tools */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Developer Tools & Infrastructure</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Git, Docker, Postman, Linux CLI, CI/CD pipelines.</p>
              </div>
            </div>

            <div className="space-y-4">
              {tools.map((skill) => (
                <div key={skill.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{skill.name}</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateRating(tools, setTools, skill.name, star)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          star <= skill.rating
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Soft Skills */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Soft Skills & CS Fundamentals</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Data Structures & Algorithms, System Design, Communication.</p>
              </div>
            </div>

            <div className="space-y-4">
              {softSkills.map((skill) => (
                <div key={skill.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{skill.name}</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateRating(softSkills, setSoftSkills, skill.name, star)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          star <= skill.rating
                            ? "bg-sky-600 text-white shadow-sm"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Target Career Goal */}
        {step === 7 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Target Career Role</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Select the specific role you want to be job-ready for.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {careerOptions.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetCareer(role)}
                  className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all ${
                    targetCareer === role
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Learning Style */}
        {step === 8 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Learning Preference & Commitment</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">How do you learn best and how many hours can you commit daily?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Preferred Learning Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Hands-on Projects", "Video Tutorials", "Interactive Coding", "Books & Reading", "Documentation"].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setLearningStyle(style as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                        learningStyle === style
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Daily Study Commitment: <span className="text-blue-500">{dailyHours} hours/day</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Diagnostic Output Summary */}
        {step === 9 && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/30 text-white space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" /> AI Diagnostic Analysis Complete!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Job Readiness Score</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1">{assessment.careerReadiness}%</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Target Role</div>
                  <div className="text-xl font-bold text-white mt-1">{assessment.careerGoals.targetCareer}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Key Strengths</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {assessment.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span> {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Missing Priority Skills</div>
                <div className="flex flex-wrap gap-2">
                  {assessment.missingSkills.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("roadmap")}
                className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>View Generated Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        {step <= 8 && (
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step < 8 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2 shadow-md shadow-blue-600/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate Diagnostic & Roadmap</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
