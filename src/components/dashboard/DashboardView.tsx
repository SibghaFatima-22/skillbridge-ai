import React from "react";
import {
  Sparkles,
  ArrowRight,
  ClipboardList,
  Map,
  BookOpen,
  FileText,
  Video,
  Github,
  MessageSquare,
  Target,
  CheckCircle2,
  Brain,
  Award,
} from "lucide-react";
import { UserProfile, AssessmentData, RoadmapData } from "../../types";

interface DashboardViewProps {
  user: UserProfile;
  assessment: AssessmentData;
  roadmap: RoadmapData;
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  assessment,
  roadmap,
  setActiveTab,
}) => {
  const candidateName = user.fullName || "Candidate";
  const userRole = user.targetCareer || "Software Engineer";
  const hasCompletedAssessment = (assessment.overallScore || 0) > 0 || (assessment.programmingSkills || []).length > 0;
  const milestonesCount = roadmap?.milestones?.length || 0;
  const completedMilestones = roadmap?.milestones?.filter((m) => m.completed)?.length || 0;

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/20 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Candidate Workspace
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Welcome, {candidateName}!
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
            Target Career Path: <strong className="text-blue-400 font-bold">{userRole}</strong>. Use your AI toolkit below to assess your skills, generate roadmaps, and practice interviews.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto relative z-10">
          <button
            onClick={() => setActiveTab(hasCompletedAssessment ? "roadmap" : "assessment")}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{hasCompletedAssessment ? "View AI Roadmap" : "Start Skill Assessment"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real Candidate Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs text-slate-400 font-bold flex items-center justify-between">
            <span>Career Readiness</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {user.careerReadiness || 0}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {hasCompletedAssessment ? "Based on diagnostic skill matrix" : "Assessment pending"}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs text-slate-400 font-bold flex items-center justify-between">
            <span>Roadmap Milestones</span>
            <Map className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {completedMilestones} / {milestonesCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {milestonesCount > 0 ? "Completed weekly coding milestones" : "No roadmap generated yet"}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs text-slate-400 font-bold flex items-center justify-between">
            <span>ATS Resume Score</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {user.resumeScore || 0}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {user.resumeScore ? "Optimized for ATS keyword density" : "Scan resume in Resume Builder"}
          </p>
        </div>
      </div>

      {/* Core Tools Quick Launcher */}
      <div className="space-y-4">
        <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Core AI Career Tools</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveTab("assessment")}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 cursor-pointer transition-all space-y-3 group"
          >
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 w-fit">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                Career Skill Assessment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Rate your programming languages, frameworks, and databases to generate your roadmap.
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("roadmap")}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 cursor-pointer transition-all space-y-3 group"
          >
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 w-fit">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                12-Week AI Roadmap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                View weekly coding milestones, tasks, and capstone project deliverables.
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("resources")}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 cursor-pointer transition-all space-y-3 group"
          >
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 w-fit">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                Learning Resources
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Documentation and learning guides tailored for {userRole}.
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("resume-builder")}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 cursor-pointer transition-all space-y-3 group"
          >
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 w-fit">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                AI Resume Builder & Analyzer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Draft ATS-optimized resume bullet points with AI suggestion tools.
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("interview")}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 cursor-pointer transition-all space-y-3 group"
          >
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 w-fit">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                AI Mock Interview Coach
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Practice technical and STAR behavioral questions tailored to {userRole}.
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("github")}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 cursor-pointer transition-all space-y-3 group"
          >
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500 w-fit">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                GitHub Repository Analyzer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Audit public repository code quality, README docs, and commit history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
