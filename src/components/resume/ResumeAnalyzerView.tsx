import React, { useState } from "react";
import {
  FileSearch,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Loader2,
  FileText,
  Briefcase,
} from "lucide-react";
import { analyzeResumeAPI } from "../../lib/api";

export const ResumeAnalyzerView: React.FC = () => {
  const [resumeText, setResumeText] = useState(
    "Ali Ahmed\nComputer Science Senior Student\nSkills: C++, JavaScript, Node.js, Express, PostgreSQL, Git\nProjects: E-commerce backend API using Express and PostgreSQL. Implemented JWT authentication and rate limiting."
  );
  const [targetJobTitle, setTargetJobTitle] = useState("Backend Engineer");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    const data = await analyzeResumeAPI({
      resumeContent: resumeText,
      targetJobTitle,
    });
    setAnalysisResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
            <FileSearch className="w-3.5 h-3.5" /> Gemini ATS Scanner
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Resume ATS Analyzer</h1>
          <p className="text-xs text-slate-400 mt-1">
            Scan your resume against real job market algorithms to fix missing keywords and formatting flaws.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form Column */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Job Role Title
            </label>
            <input
              type="text"
              value={targetJobTitle}
              onChange={(e) => setTargetJobTitle(e.target.value)}
              placeholder="e.g. Backend Developer, Frontend Engineer, AI Specialist"
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Paste Resume Content / Text
            </label>
            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your complete resume text here..."
              className="w-full p-4 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Analyze Resume with AI</span>
          </button>
        </div>

        {/* Results Column */}
        {analysisResult ? (
          <div className="space-y-6">
            {/* Score Ring Card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall ATS Match Score</span>
                <span className="text-xs font-extrabold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Ready to Apply
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-5xl font-black text-blue-400">{analysisResult.atsScore}%</div>
                <p className="text-xs text-slate-300 leading-relaxed">{analysisResult.summary}</p>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
                <div className="p-2.5 rounded-xl bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 font-medium">Keywords</div>
                  <div className="text-base font-bold text-white mt-0.5">{analysisResult.keywordScore}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 font-medium">Grammar</div>
                  <div className="text-base font-bold text-white mt-0.5">{analysisResult.grammarScore}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60">
                  <div className="text-[10px] text-slate-400 font-medium">Format</div>
                  <div className="text-base font-bold text-white mt-0.5">{analysisResult.formattingScore}%</div>
                </div>
              </div>
            </div>

            {/* Missing Keywords Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Missing ATS Keywords for {targetJobTitle}
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.missingKeywords.map((kw: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 text-xs font-semibold">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Improvements */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Actionable Improvements
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {analysisResult.improvements.map((imp: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center text-slate-400 space-y-3">
            <FileSearch className="w-10 h-10 text-slate-400" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No Resume Analysis Executed Yet</div>
            <p className="text-xs max-w-xs leading-relaxed">
              Paste your resume text on the left and click "Analyze Resume with AI" to generate real-time ATS feedback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
