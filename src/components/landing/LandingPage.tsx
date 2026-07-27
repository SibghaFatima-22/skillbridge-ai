import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  Map,
  FileText,
  Video,
  Github,
  Zap,
  Users,
  ChevronRight,
  Code2,
  LogIn,
  X,
  Target,
  Cpu,
  Layers,
  TrendingUp,
  Building,
} from "lucide-react";
import logoImg from "../../assets/images/skillbridge_logo_1784917378061.jpg";

interface LandingPageProps {
  onGetStarted: () => void;
  isLoggedIn?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, isLoggedIn = false }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Banner Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="SkillBridge AI Logo"
            referrerPolicy="no-referrer"
            className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20"
          />
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
            SkillBridge <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Core AI Tools</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <span>Open Candidate App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4" /> Tailored AI Career Engine for Computer Science
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Transform Your CS Skills into <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Production Software Careers</span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Comprehensive diagnostic career assessment, personalized 12-week AI roadmaps, ATS resume builder, target-role learning resources, and 24/7 AI interview coaching.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 group"
          >
            <span>{isLoggedIn ? "Access Candidate Dashboard" : "Start Free Career Assessment"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Core Features Overview Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-800/80">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">All-in-One CS Career Suite</h2>
          <p className="text-xs text-slate-400">Powered by Gemini AI to accelerate software engineering careers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 w-fit">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">AI Diagnostic Assessment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diagnostic diagnostic evaluation of your programming languages, frameworks, databases, and software tools.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Dynamic Learning Roadmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customized 12-week roadmap with hands-on weekly coding milestones and capstone project deliverables.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">AI Interview Coach</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Voice-enabled technical and behavioral mock interview practice tailored to your exact target career role.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        SkillBridge AI • Production Ready Computer Science Career Acceleration Engine
      </footer>
    </div>
  );
};
