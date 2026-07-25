import React, { useState } from "react";
import {
  Briefcase,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  ExternalLink,
  Search,
  Building,
  DollarSign,
  HelpCircle,
  Cpu,
  Layers,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Zap,
  Filter,
  Check,
} from "lucide-react";
import { JobMatch } from "../../types";

interface JobMatcherViewProps {
  jobs: JobMatch[];
  setJobs: (j: JobMatch[]) => void;
}

export const JobMatcherView: React.FC<JobMatcherViewProps> = ({
  jobs,
  setJobs,
}) => {
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [applyNotification, setApplyNotification] = useState<string | null>(null);

  const toggleBookmark = (id: string) => {
    setJobs(
      jobs.map((j) => {
        if (j.id === id) {
          const isCurrentlySaved = !!(j.bookmarked || j.saved);
          return { ...j, bookmarked: !isCurrentlySaved, saved: !isCurrentlySaved };
        }
        return j;
      })
    );
  };

  const handleApply = (job: JobMatch) => {
    const targetUrl = job.applyUrl || `https://www.google.com/search?q=${encodeURIComponent(`${job.company} ${job.jobTitle} careers`)}`;
    setApplyNotification(`Opening career portal for ${job.company} (${job.jobTitle})...`);
    setTimeout(() => {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      setApplyNotification(null);
    }, 600);
  };

  // Tab count calculations
  const filterCounts = {
    All: jobs.length,
    "Pakistan 🇵🇰": jobs.filter(
      (j) =>
        j.location.toLowerCase().includes("pakistan") ||
        j.location.toLowerCase().includes("lahore") ||
        j.location.toLowerCase().includes("karachi") ||
        j.location.toLowerCase().includes("islamabad") ||
        j.salary.toLowerCase().includes("pkr")
    ).length,
    Internships: jobs.filter(
      (j) =>
        (j.type || "").toLowerCase().includes("intern") ||
        j.jobTitle.toLowerCase().includes("intern")
    ).length,
    "Junior Roles": jobs.filter(
      (j) =>
        (j.type || "").toLowerCase().includes("junior") ||
        (j.type || "").toLowerCase().includes("associate") ||
        j.jobTitle.toLowerCase().includes("junior") ||
        j.jobTitle.toLowerCase().includes("associate")
    ).length,
    Remote: jobs.filter((j) => j.location.toLowerCase().includes("remote")).length,
    Bookmarked: jobs.filter((j) => j.bookmarked || j.saved).length,
  };

  const filteredJobs = jobs.filter((j) => {
    // 1. Tab filter
    let matchesTab = true;
    if (filterType === "Pakistan 🇵🇰") {
      matchesTab =
        j.location.toLowerCase().includes("pakistan") ||
        j.location.toLowerCase().includes("lahore") ||
        j.location.toLowerCase().includes("karachi") ||
        j.location.toLowerCase().includes("islamabad") ||
        j.salary.toLowerCase().includes("pkr");
    } else if (filterType === "Internships") {
      matchesTab =
        (j.type || "").toLowerCase().includes("intern") ||
        j.jobTitle.toLowerCase().includes("intern");
    } else if (filterType === "Junior Roles") {
      matchesTab =
        (j.type || "").toLowerCase().includes("junior") ||
        (j.type || "").toLowerCase().includes("associate") ||
        j.jobTitle.toLowerCase().includes("junior") ||
        j.jobTitle.toLowerCase().includes("associate");
    } else if (filterType === "Remote") {
      matchesTab = j.location.toLowerCase().includes("remote");
    } else if (filterType === "Bookmarked") {
      matchesTab = !!(j.bookmarked || j.saved);
    }

    // 2. Search query filter
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesTab;

    const matchesSearch =
      j.jobTitle.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      (j.type || "").toLowerCase().includes(q) ||
      j.matchingSkills.some((s) => s.toLowerCase().includes(q)) ||
      j.missingSkills.some((s) => s.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {applyNotification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-purple-500/50 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <ExternalLink className="w-4 h-4 animate-bounce" />
          </div>
          <span className="text-xs font-semibold">{applyNotification}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" /> AI Skill-Job Matcher
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Job Recommendations</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time Junior & Internship role matching calculated against your diagnostic skills matrix.
          </p>
        </div>

        <button
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="px-4 py-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 font-bold text-xs transition-all flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>How Matching Algorithm Works</span>
          {showHowItWorks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* How Job Matcher Works Collapsible Drawer */}
      {showHowItWorks && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/10 via-slate-900 to-indigo-900/10 border border-purple-500/30 text-slate-900 dark:text-slate-100 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Under the Hood: AI Match Matrix</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">How SkillBridge AI pairs your CS skills with software engineering job listings.</p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              Real-time Precision Model
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="text-purple-600 dark:text-purple-400 font-extrabold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center text-[10px]">1</span>
                Primary Tech Stack (40%)
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Direct overlap in core languages & frameworks (React, Node, Python, Java, TypeScript).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="text-blue-600 dark:text-blue-400 font-extrabold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center text-[10px]">2</span>
                System Architecture (20%)
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Evaluates API design, CI/CD, microservices knowledge, and system design diagnostic score.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center text-[10px]">3</span>
                Database & Data Systems (20%)
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Matches relational SQL & NoSQL experience (PostgreSQL, MongoDB, Redis query tuning).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center text-[10px]">4</span>
                Project Proof & ATS (20%)
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Validates production builds from your GitHub commits and ATS resume key phrase density.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200 flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              💡 <strong>Pro Tip:</strong> Completing weekly tasks in your Career Roadmap automatically updates your diagnostic skill vector and raises your job match score!
            </span>
            <button
              onClick={() => setShowHowItWorks(false)}
              className="text-[11px] font-bold text-purple-600 dark:text-purple-300 hover:underline flex-shrink-0"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      )}

      {/* Controls Bar: Filter Tabs + Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Filter Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {(["All", "Pakistan 🇵🇰", "Internships", "Junior Roles", "Remote", "Bookmarked"] as const).map((tab) => {
            const count = filterCounts[tab];
            const isActive = filterType === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {tab === "Bookmarked" && <Bookmark className={`w-3.5 h-3.5 ${isActive ? "fill-current" : ""}`} />}
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72 flex-shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, company, skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 outline-none focus:border-purple-500 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Jobs List / Cards Grid */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">No Matching Jobs Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No job postings fit your current filter criteria ("{filterType}" {searchQuery ? `+ query "${searchQuery}"` : ""}).
            </p>
            <button
              onClick={() => {
                setFilterType("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-all"
            >
              Reset Filters & View All
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isSaved = !!(job.bookmarked || job.saved);
            return (
              <div
                key={job.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-purple-500/50 transition-all"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-base">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{job.jobTitle}</span>
                        {job.type && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 font-semibold">
                            {job.type}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{job.company}</span> •{" "}
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/40">
                      {job.salary}
                    </span>

                    {job.matchingSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        ✓ {sk}
                      </span>
                    ))}

                    {job.missingSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40"
                      >
                        ! Need: {sk}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                    💡 <strong>Application Tip:</strong> {job.applicationTip}
                  </div>
                </div>

                {/* Right Action Column */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 gap-3">
                  <div className="text-right">
                    <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                      {job.matchPercentage}%
                    </span>
                    <div className="text-[10px] text-slate-400 font-medium">Match Fit</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(job.id)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isSaved
                          ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      }`}
                      title={isSaved ? "Remove Bookmark" : "Bookmark Role"}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleApply(job)}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5"
                    >
                      <span>Apply Role</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

