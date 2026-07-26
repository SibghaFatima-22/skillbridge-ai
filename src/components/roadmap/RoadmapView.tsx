import React, { useState } from "react";
import {
  Map,
  CheckCircle2,
  Circle,
  Sparkles,
  Clock,
  Layers,
  Code2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FolderGit2,
  Loader2,
  Check,
} from "lucide-react";
import { RoadmapData, RoadmapTask, AssessmentData } from "../../types";
import { generateRoadmapAPI } from "../../lib/api";

interface RoadmapViewProps {
  roadmap: RoadmapData;
  setRoadmap: (rdm: RoadmapData) => void;
  setActiveTab: (tab: string) => void;
  // FIX: previously handleRegenerate always sent the exact same hardcoded
  // currentSkills/missingSkills arrays regardless of who the user was,
  // which is why every regenerated roadmap looked identical. Passing the
  // real assessment through lets regeneration reflect actual skill data.
  assessment?: AssessmentData;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  setRoadmap,
  setActiveTab,
  assessment,
}) => {
  const [openMilestone, setOpenMilestone] = useState<string>(roadmap.milestones[0]?.id || "");
  const [regenerating, setRegenerating] = useState(false);

  const toggleTask = (milestoneId: string, taskId: string) => {
    const updatedMilestones = roadmap.milestones.map((m) => {
      if (m.id !== milestoneId) return m;
      const updatedTasks = m.weeklyTasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      const allTasksCompleted = updatedTasks.every((t) => t.completed);
      return { ...m, weeklyTasks: updatedTasks, completed: allTasksCompleted };
    });

    // Calculate total completed tasks
    let totalTasks = 0;
    let completedTasks = 0;
    updatedMilestones.forEach((m) => {
      m.weeklyTasks.forEach((t) => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });

    const newProgress = Math.round((completedTasks / (totalTasks || 1)) * 100);

    setRoadmap({
      ...roadmap,
      progress: newProgress,
      milestones: updatedMilestones,
    });
  };

  const handleRegenerate = async () => {
    setRegenerating(true);

    // FIX: derive real current/missing skills from the actual assessment
    // (if available) instead of always sending the same hardcoded arrays.
    // Falls back to the previous generic defaults only if no assessment
    // data has been recorded yet for this user.
    let currentSkills = ["TypeScript", "Node.js", "PostgreSQL"];
    let missingSkills = ["Docker", "Redis", "Kafka", "System Design"];

    if (assessment) {
      const allRatedSkills = [
        ...(assessment.programmingSkills || []),
        ...(assessment.frameworks || []),
        ...(assessment.databases || []),
        ...(assessment.tools || []),
      ];
      const derivedCurrent = allRatedSkills.filter((s) => s.rating >= 3).map((s) => s.name);
      const derivedWeak = allRatedSkills.filter((s) => s.rating <= 2).map((s) => s.name);

      if (derivedCurrent.length > 0) currentSkills = derivedCurrent;
      if (assessment.missingSkills && assessment.missingSkills.length > 0) {
        missingSkills = assessment.missingSkills;
      } else if (derivedWeak.length > 0) {
        missingSkills = derivedWeak;
      }
    }

    const newRoadmapData = await generateRoadmapAPI({
      targetCareer: roadmap.career,
      currentSkills,
      missingSkills,
      dailyHours: assessment?.dailyHours || 3,
      durationMonths: 3,
    });

    if (newRoadmapData) {
      setRoadmap({
        id: "rdm_" + Date.now(),
        userId: roadmap.userId,
        career: newRoadmapData.career || roadmap.career,
        estimatedMonths: newRoadmapData.estimatedMonths || 3,
        estimatedWeeks: newRoadmapData.estimatedWeeks || 12,
        difficulty: newRoadmapData.difficulty || "Intermediate",
        summary: newRoadmapData.summary || roadmap.summary,
        progress: 0,
        capstoneProject: newRoadmapData.capstoneProject || roadmap.capstoneProject,
        milestones: newRoadmapData.milestones.map((m: any, idx: number) => ({
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
    setRegenerating(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Map className="w-3.5 h-3.5" /> AI Personalized Roadmap
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {roadmap.career} Career Roadmap
          </h1>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            {roadmap.summary}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
          >
            {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-indigo-400" />}
            <span>Regenerate with AI</span>
          </button>
        </div>
      </div>

      {/* Progress Ring & Stats Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-800" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="6"
                className="text-blue-600 transition-all duration-500"
                fill="transparent"
                strokeDasharray="163"
                strokeDashoffset={163 - (163 * roadmap.progress) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-sm font-black text-slate-900 dark:text-white">{roadmap.progress}%</span>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Overall Roadmap Progress</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {roadmap.milestones.filter((m) => m.completed).length} of {roadmap.milestones.length} Milestones Completed
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-around">
          <div>
            <div className="text-slate-400 font-medium">Estimated Duration</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> {roadmap.estimatedMonths} Months ({roadmap.estimatedWeeks} Wks)
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-medium">Difficulty Level</div>
            <div className="text-sm font-bold text-amber-500 mt-0.5">{roadmap.difficulty}</div>
          </div>
        </div>
      </div>

      {/* Milestones Accordion List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-500" /> Milestones & Weekly Action Plan
        </h2>

        {roadmap.milestones.map((milestone, idx) => {
          const isOpen = openMilestone === milestone.id;
          return (
            <div
              key={milestone.id}
              className={`rounded-2xl border transition-all ${
                milestone.completed
                  ? "bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
              }`}
            >
              {/* Milestone Accordion Header */}
              <button
                onClick={() => setOpenMilestone(isOpen ? "" : milestone.id)}
                className="w-full p-5 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      milestone.completed
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {milestone.completed ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Month {milestone.month} • Week {milestone.week}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                        {milestone.estimatedHours} Hours
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{milestone.title}</div>
                  </div>
                </div>

                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{milestone.description}</p>

                  {/* Key Topics Badges */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Key Topics</div>
                    <div className="flex flex-wrap gap-2">
                      {milestone.keyTopics.map((topic, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Tasks Checklist */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actionable Tasks</div>
                    {milestone.weeklyTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(milestone.id, task.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          task.completed
                            ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through"
                            : "bg-slate-50/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/60 hover:border-blue-400 text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <div>
                            <div className="text-xs font-semibold">{task.title}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal no-underline">{task.description}</div>
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold no-underline">
                          {task.type}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Mini Project Box if present */}
                  {milestone.miniProject && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900/40 border border-blue-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                        <Code2 className="w-4 h-4" /> Milestone Mini Project: {milestone.miniProject.title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{milestone.miniProject.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {milestone.miniProject.techStack.map((tech, ti) => (
                          <span key={ti} className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Capstone Project Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <FolderGit2 className="w-5 h-5" /> Major Capstone Production Build
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-white">{roadmap.capstoneProject.title}</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">{roadmap.capstoneProject.description}</p>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deliverables & Recruiter Criteria</div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
            {roadmap.capstoneProject.deliverables.map((d, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};