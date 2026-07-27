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

interface ResumeAnalyzerViewProps {
  addNotification?: (title: string, message: string, type?: "info" | "success" | "warning" | "achievement") => void;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({ addNotification }) => {
  const [resumeText, setResumeText] = useState("");
  const [targetJobTitle, setTargetJobTitle] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await analyzeResumeAPI({
        resumeContent: resumeText,
        targetJobTitle,
      });

      if (!data) {
        throw new Error("No data returned from analysis API");
      }

      setAnalysisResult(data);

      if (addNotification) {
        addNotification(
          "Resume ATS Scan Complete 📄",
          `ATS Match Score for ${targetJobTitle}: ${data.atsScore ?? 82}%. ${data.improvements?.length || 0} areas flagged for optimization.`,
          "success"
        );
      }
    } catch (err) {
      console.error("Resume analysis failed:", err);
      setErrorMsg("We couldn't analyze your resume right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
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
            Scan your resume content with Gemini AI to identify missing keywords, ATS score, and optimization tips.
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
              placeholder="e.g. Backend Developer, Frontend Engineer, AI Engineer"
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Paste Your Resume Content / Plain Text
            </label>
            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your complete resume text here (education, experience, projects, technical skills)..."
              className="w-full p-4 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!resumeText.trim() || loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Run Gemini ATS Resume Analysis</span>
          </button>
        </div>

        {/* Results Column */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          {!analysisResult ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500">
                <FileSearch className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Awaiting Resume Content</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                Paste your resume text on the left and click 'Run Gemini ATS Resume Analysis' to see keyword density and ATS scores.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">ATS Analysis Overview</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Target Role: {targetJobTitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-500">{analysisResult.atsScore}%</div>
                  <div className="text-[10px] text-slate-400 font-bold">ATS Score</div>
                </div>
              </div>

              {analysisResult.summary && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700">
                  💡 <strong>Summary:</strong> {analysisResult.summary}
                </div>
              )}

              {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Missing Keywords for {targetJobTitle}:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.missingKeywords.map((kw: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.improvements && analysisResult.improvements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Actionable Recommendations:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {analysisResult.improvements.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};