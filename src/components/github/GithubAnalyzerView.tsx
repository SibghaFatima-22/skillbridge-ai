/**
 * SkillBridge AI - GitHub Profile & Repository Analyzer
 */

import React, { useState } from 'react';
import { GitHubAnalysisResult } from '../../types';
import {
  Github,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Star,
  GitFork,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Award,
  Layers,
  BookOpen,
  TrendingUp,
  RefreshCw,
  Target
} from 'lucide-react';

interface GitHubAnalyzerViewProps {
  user?: any;
  setActiveTab?: (tab: string) => void;
}

export const GitHubAnalyzerView: React.FC<GitHubAnalyzerViewProps> = ({
  user,
  setActiveTab
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [targetRoleInput, setTargetRoleInput] = useState(user?.targetRole || 'Full Stack Software Engineer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<GitHubAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedBullet, setCopiedBullet] = useState<string | null>(null);

  const handleAnalyze = async (overrideUser?: string) => {
    const handleToUse = (overrideUser || usernameInput).trim().replace(/^@/, '');
    if (!handleToUse) {
      setErrorMsg('Please enter a valid GitHub username.');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/github/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: handleToUse,
          targetRole: targetRoleInput
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setAnalysis(data.data);
      } else {
        setErrorMsg(data.error || 'Failed to analyze GitHub profile. Please check the username and try again.');
      }
    } catch (err: any) {
      console.error('Error calling github analyzer api:', err);
      setErrorMsg('Network error while connecting to analyzer. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyBullet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBullet(text);
    setTimeout(() => setCopiedBullet(null), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-[#27272a]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
            <Github className="w-4 h-4" /> Portfolio & Code Quality Audit
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-[#fafafa] tracking-tight">
            GitHub Profile & Repository Analyzer
          </h1>
          <p className="text-xs text-zinc-500 dark:text-[#71717a] mt-1">
            Analyze public GitHub repositories to evaluate portfolio strength, detect skill gaps, calculate ATS project scores, and generate resume bullet points.
          </p>
        </div>

        {analysis && (
          <button
            onClick={() => setAnalysis(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-[#18181b] hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-700 dark:text-zinc-200 text-xs font-semibold border border-zinc-200 dark:border-[#27272a] transition-colors cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Analyze Another Handle
          </button>
        )}
      </div>

      {/* GitHub Username Input Form */}
      {!analysis && (
        <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-2xl shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-blue-500/20">
              <Github className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Audit Your GitHub Profile</h2>
            <p className="text-xs text-zinc-500 dark:text-[#71717a] max-w-md mx-auto">
              Enter any GitHub handle to fetch public repositories, rate project depth, identify missing tech skills, and get quantified resume bullets.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-[#a1a1aa] mb-1.5">
                GitHub Username / Handle
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  @
                </div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                  placeholder="e.g. octocat, gaearon, or your-username"
                  className="w-full pl-8 pr-4 py-2.5 bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-[#27272a] rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-[#a1a1aa] mb-1.5">
                Target Engineering Role
              </label>
              <input
                type="text"
                value={targetRoleInput}
                onChange={e => setTargetRoleInput(e.target.value)}
                placeholder="e.g. Full Stack Software Engineer"
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-[#27272a] rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Fetching & Analyzing GitHub Repositories...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run GitHub AI Audit</span>
                </>
              )}
            </button>

            {/* Quick Demo Handles */}
            <div className="pt-4 border-t border-zinc-100 dark:border-[#27272a] text-center">
              <span className="text-[11px] text-zinc-400 dark:text-[#71717a] block mb-2">Or test with demo handles:</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['octocat', 'gaearon', 'shadcn', 'yyx990803'].map(demo => (
                  <button
                    key={demo}
                    onClick={() => {
                      setUsernameInput(demo);
                      handleAnalyze(demo);
                    }}
                    className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-[#27272a] hover:bg-zinc-200 dark:hover:bg-[#3f3f46] text-zinc-700 dark:text-zinc-300 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    @{demo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results Screen */}
      {analysis && (
        <div className="space-y-8">
          {/* User Profile Card */}
          <div className="p-6 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={analysis.avatarUrl || `https://github.com/${analysis.username}.png`}
                alt={analysis.name || analysis.username}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-200 dark:border-[#27272a] bg-zinc-100 dark:bg-[#09090b]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{analysis.name}</h2>
                  <a
                    href={`https://github.com/${analysis.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline flex items-center gap-1 font-mono"
                  >
                    @{analysis.username} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {analysis.bio && (
                  <p className="text-xs text-zinc-500 dark:text-[#71717a] mt-0.5 max-w-xl">{analysis.bio}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-[#71717a] mt-2 font-medium">
                  <span><strong>{analysis.publicReposCount}</strong> Repositories</span>
                  <span><strong>{analysis.followersCount}</strong> Followers</span>
                  <span><strong>{analysis.followingCount}</strong> Following</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/20 max-w-md">
              <div className="text-[10px] uppercase font-bold tracking-wider text-blue-500 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Recruiter AI Assessment Summary
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {analysis.overview}
              </p>
            </div>
          </div>

          {/* Core Rating Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-[#71717a]">
                <span>Overall Profile Rating</span>
                <Github className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">{analysis.profileRating}/100</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  analysis.profileRating >= 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {analysis.profileRating >= 80 ? 'Strong' : 'Moderate'}
                </span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${analysis.profileRating}%` }} />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-[#71717a]">
                <span>Portfolio Variety Score</span>
                <Layers className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">{analysis.portfolioScore}/100</span>
                <span className="text-xs font-bold text-purple-500 px-2 py-0.5 rounded bg-purple-500/10">
                  {analysis.portfolioScore >= 80 ? 'Diverse' : 'Basic'}
                </span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${analysis.portfolioScore}%` }} />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-[#71717a]">
                <span>ATS Resume Impact Score</span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">{analysis.atsScore}/100</span>
                <span className="text-xs font-bold text-emerald-500 px-2 py-0.5 rounded bg-emerald-500/10">
                  {analysis.atsScore >= 80 ? 'High ATS Impact' : 'Needs Bullets'}
                </span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.atsScore}%` }} />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-[#71717a]">
                <span>Code Quality Estimate</span>
                <Code2 className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">{analysis.codeQualityScore}/100</span>
                <span className="text-xs font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10">
                  {analysis.codeQualityScore >= 80 ? 'Structured' : 'Refactor'}
                </span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-[#27272a] h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${analysis.codeQualityScore}%` }} />
              </div>
            </div>
          </div>

          {/* Languages Breakdown */}
          {analysis.detectedLanguages && analysis.detectedLanguages.length > 0 && (
            <div className="p-6 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-500" /> Language Distribution across Repositories
              </h3>

              <div className="w-full h-3 bg-zinc-100 dark:bg-[#27272a] rounded-full overflow-hidden flex">
                {analysis.detectedLanguages.map((lang, idx) => {
                  const colors = ['bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-emerald-500', 'bg-pink-500', 'bg-cyan-500'];
                  return (
                    <div
                      key={lang.name}
                      style={{ width: `${lang.percentage}%` }}
                      className={`${colors[idx % colors.length]} h-full transition-all`}
                      title={`${lang.name}: ${lang.percentage}%`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                {analysis.detectedLanguages.map((lang, idx) => {
                  const colors = ['bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-emerald-500', 'bg-pink-500', 'bg-cyan-500'];
                  return (
                    <div key={lang.name} className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
                      <span className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`} />
                      <span>{lang.name}</span>
                      <span className="text-zinc-400 text-[11px]">({lang.percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Project Ratings & Resume Bullet Suggestions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" /> Repository & Project Deep-Dive ({analysis.projectRatings?.length || 0} Analyzed)
              </h3>
              <span className="text-xs text-zinc-500 dark:text-[#71717a]">
                Includes auto-generated quantified resume bullets
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {analysis.projectRatings?.map((project, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-2xl space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-[#27272a]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-[#09090b] border border-zinc-200 dark:border-[#27272a] flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300">
                        {project.language ? project.language.substring(0, 2).toUpperCase() : 'JS'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{project.name}</h4>
                          {project.htmlUrl && (
                            <a
                              href={project.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-blue-500 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-[#71717a] mt-0.5">{project.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-[#71717a]">
                        <span className="flex items-center gap-1 font-medium"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {project.stars}</span>
                        <span className="flex items-center gap-1 font-medium"><GitFork className="w-3.5 h-3.5 text-zinc-400" /> {project.forks}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        project.score >= 80
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        Score: {project.score}/100
                      </span>
                    </div>
                  </div>

                  {/* Strengths and Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Key Project Strengths
                      </span>
                      <ul className="space-y-1 text-zinc-700 dark:text-zinc-300 pl-4 list-disc">
                        {project.strengths?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                      <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Code & Repo Enhancements
                      </span>
                      <ul className="space-y-1 text-zinc-700 dark:text-zinc-300 pl-4 list-disc">
                        {project.improvements?.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Quantified Resume Bullet Suggestion */}
                  {project.resumeBulletSuggestion && (
                    <div className="p-3.5 rounded-xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/20 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Ready-to-Use Resume Bullet Point
                        </span>
                        <button
                          onClick={() => handleCopyBullet(project.resumeBulletSuggestion)}
                          className="text-xs text-blue-500 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedBullet === project.resumeBulletSuggestion ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Bullet
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs font-mono text-zinc-800 dark:text-zinc-200">
                        • {project.resumeBulletSuggestion}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps Grid */}
          {analysis.skillGaps && analysis.skillGaps.length > 0 && (
            <div className="p-6 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" /> Skill Gaps Detected for {targetRoleInput}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.skillGaps.map((gap, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-[#27272a] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">{gap.skill}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        gap.importance === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {gap.importance} Priority
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-[#71717a]">{gap.reason}</p>
                    <div className="pt-2 border-t border-zinc-200/60 dark:border-[#27272a] text-xs font-medium text-blue-600 dark:text-blue-400">
                      💡 {gap.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Enhancements & Actionable Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Actionable GitHub Profile Enhancements
              </h3>
              <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                {analysis.improvements?.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Top Strengths Identified
              </h3>
              <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                {analysis.topStrengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Next Projects to Build */}
          {analysis.recommendedNextProjects && analysis.recommendedNextProjects.length > 0 && (
            <div className="p-6 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" /> Recommended Portfolio Projects to Build Next
              </h3>
              <p className="text-xs text-zinc-500 dark:text-[#71717a]">
                Building these target projects will directly close your detected skill gaps for {targetRoleInput} positions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.recommendedNextProjects.map((proj, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-[#27272a] space-y-3">
                    <div className="font-bold text-sm text-zinc-900 dark:text-white">{proj.title}</div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack?.map(tech => (
                        <span key={tech} className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded border border-blue-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-zinc-200 dark:border-[#27272a] text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                      🎯 {proj.whyNeeded}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Navigation Action */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Ready to attach these project bullets to your ATS Resume?</h4>
              <p className="text-xs text-zinc-500 dark:text-[#71717a] mt-0.5">Use the SkillBridge ATS Resume Builder to format your projects for maximum recruiter callback rate.</p>
            </div>
            {setActiveTab && (
              <button
                onClick={() => setActiveTab('resume-builder')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>Go to ATS Resume Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubAnalyzerView;
export const GithubAnalyzerView = GitHubAnalyzerView;
