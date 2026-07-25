import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Brain,
  Map,
  FileText,
  Video,
  Briefcase,
  Github,
  Zap,
  Users,
  Award,
  ChevronRight,
  Code2,
  LogIn,
  X,
  User,
  KeyRound,
  Lock,
  Target,
  Cpu,
  Layers,
  TrendingUp,
  Check,
  Building,
  MapPin,
  AlertCircle,
} from "lucide-react";
import logoImg from "../../assets/images/skillbridge_logo_1784917378061.jpg";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("ali.ahmed@university.edu");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedDemoRole, setSelectedDemoRole] = useState(0);

  const demoRoles = [
    {
      company: "Vercel",
      role: "Junior Full-Stack Engineer",
      match: 92,
      location: "San Francisco / Remote",
      salary: "$110k - $130k",
      matched: ["React & Next.js", "TypeScript", "Node.js REST APIs", "Tailwind CSS"],
      missing: ["GraphQL Subscriptions", "Redis Caching"],
      tip: "Your Next.js production builds match Vercel's core tech stack. Highlight your API route optimizations on your ATS resume.",
    },
    {
      company: "Stripe",
      role: "Backend Infrastructure Intern",
      match: 86,
      location: "Seattle / Remote",
      salary: "$55 / hr",
      matched: ["Node.js Architecture", "PostgreSQL Query Tuning", "Git CI/CD Pipeline"],
      missing: ["Distributed Locks", "gRPC Protocol"],
      tip: "Stripe values clean API design & idempotent endpoints. Complete Week 5 of your roadmap to bridge the Redis gap.",
    },
    {
      company: "Google",
      role: "Associate Software Engineer",
      match: 78,
      location: "Mountain View, CA",
      salary: "$135k - $150k",
      matched: ["Data Structures & Algorithms", "System Design Basics", "TypeScript"],
      missing: ["System Concurrency", "Dynamic Programming Mastery"],
      tip: "Focus on AI Mock Interview sessions in System Design to raise your interview confidence score from 78% to 90%+.",
    },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoginModal(false);
    onGetStarted();
  };

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
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-job-matcher" className="hover:text-white transition-colors text-purple-400 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> How Job Matcher Works
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2"
          >
            <LogIn className="w-4 h-4 text-blue-400" />
            <span>Log In</span>
          </button>
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-semibold mb-8 shadow-inner">
          <img
            src={logoImg}
            alt="SkillBridge AI"
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-md object-cover"
          />
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>The #1 AI Career Development Platform for CS Students</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          From CS Student to <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Job-Ready Engineer</span>.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Stop watching random YouTube tutorials and guessing what to learn. SkillBridge AI continuously evaluates your skills, builds custom roadmaps, optimizes your resume, conducts AI interviews, and connects you with top jobs.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 group"
          >
            <span>Start Free Career Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#how-job-matcher"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 text-purple-400" />
            <span>How Job Matcher Works</span>
          </a>
        </div>

        {/* Feature Pill Tags */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-medium">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Powered by Gemini API
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ATS Resume Scanner
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Voice AI Mock Interviews
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 AI Mentor
          </span>
        </div>
      </section>

      {/* How Job Matcher Works Section */}
      <section id="how-job-matcher" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/30 mb-4">
            <Briefcase className="w-4 h-4 text-purple-400" /> AI Skill-Job Match Engine
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            How the AI Job Matcher Works
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
            Eliminate spray-and-pray job applications. Our AI algorithm compares your verified diagnostic skill matrix directly against live market employer requirements.
          </p>
        </div>

        {/* 4-Step Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all relative">
            <div className="text-4xl font-black text-purple-500/20 absolute top-4 right-6">01</div>
            <div className="p-3.5 w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 mb-5 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Skill Diagnostic Vector</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates a 360° technical score from your diagnostic assessment, GitHub commits, ATS resume, and completed roadmap milestones.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all relative">
            <div className="text-4xl font-black text-purple-500/20 absolute top-4 right-6">02</div>
            <div className="p-3.5 w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 mb-5 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Employer Spec Parsing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scrapes & tokenizes actual job postings from Google, Vercel, Stripe, Meta, and tech startups into required vs. optional tech competencies.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all relative">
            <div className="text-4xl font-black text-purple-500/20 absolute top-4 right-6">03</div>
            <div className="p-3.5 w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-5 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Weighted Fit Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applies multi-variable weighting: Primary Stack (40%), System Architecture (20%), Databases (20%), & Practical Project Proof (20%).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all relative">
            <div className="text-4xl font-black text-purple-500/20 absolute top-4 right-6">04</div>
            <div className="p-3.5 w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 mb-5 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Skill Gap Injection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identifies exact missing skill tags (e.g. <i>Redis, gRPC</i>) and auto-queues target learning modules into your interactive roadmap.
            </p>
          </div>
        </div>

        {/* Live Interactive Simulation Widget */}
        <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Match Calculator Demo
              </div>
              <h3 className="text-xl font-extrabold text-white">Select a Target Employer Role</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {demoRoles.map((role, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDemoRole(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedDemoRole === idx
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {role.company}
                </button>
              ))}
            </div>
          </div>

          {/* Role Match Breakdown */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-400" />
                    {demoRoles[selectedDemoRole].role}
                  </h4>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{demoRoles[selectedDemoRole].company}</span> •
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {demoRoles[selectedDemoRole].location}</span> •
                    <span className="text-emerald-400 font-bold">{demoRoles[selectedDemoRole].salary}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-purple-400">{demoRoles[selectedDemoRole].match}%</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Skill Fit Score</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${demoRoles[selectedDemoRole].match}%` }}
                />
              </div>

              {/* Skills breakdown */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-300">Verified Matching Competencies:</div>
                <div className="flex flex-wrap gap-2">
                  {demoRoles[selectedDemoRole].matched.map((sk, i) => (
                    <span key={i} className="text-xs font-medium px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Target Skill Gaps To Close:</div>
                <div className="flex flex-wrap gap-2">
                  {demoRoles[selectedDemoRole].missing.map((sk, i) => (
                    <span key={i} className="text-xs font-medium px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Need: {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
                💡 <strong>AI Application Strategy:</strong> {demoRoles[selectedDemoRole].tip}
              </div>
            </div>

            {/* CTA Box */}
            <div className="lg:col-span-4 bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/30 rounded-2xl p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Match Your CS Profile</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your diagnostic skill matrix to calculate live match percentages across 100+ junior tech listings.
              </p>
              <button
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Check My Job Match Score</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Everything You Need to Land Your Dream Tech Role
          </h2>
          <p className="mt-3 text-slate-400 text-sm md:text-base">
            One cohesive system supporting every step from sophomore year to your first offer letter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-all">
            <div className="p-3 w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 mb-4 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Career Diagnostic Assessment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluate your programming languages, frameworks, databases, tools, and soft skills across an 8-step wizard.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-all">
            <div className="p-3 w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 flex items-center justify-center">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Dynamic AI Career Roadmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step-by-step milestones with weekly tasks, curated resources, mini projects, and capstone production builds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-all">
            <div className="p-3 w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">ATS Resume Builder & Analyzer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate ATS-optimized resumes with action verbs and analyze existing PDFs against real job recruiter specifications.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-all">
            <div className="p-3 w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 mb-4 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Voice AI Mock Interview Coach</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Practice Technical, Behavioral, and System Design interviews with real-time feedback and STAR technique scoring.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-all">
            <div className="p-3 w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 mb-4 flex items-center justify-center">
              <Github className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">GitHub Portfolio Analyzer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get recruiter-level feedback on your GitHub repositories, code architecture, README quality, and project impact.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 transition-all">
            <div className="p-3 w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 mb-4 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Job Matcher</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculate match percentages for Junior SE roles, discover missing skills, and receive tailored application strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white">Simple, Student-Friendly Pricing</h2>
          <p className="text-slate-400 text-sm mt-2">Invest in your career development for the price of two coffees per month.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-lg font-bold text-white">Free Student</div>
              <div className="text-3xl font-extrabold text-white mt-4">$0 <span className="text-xs font-normal text-slate-400">/ forever</span></div>
              <p className="text-xs text-slate-400 mt-2">Essential career tools for CS undergraduates.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Basic Career Assessment</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 AI Career Roadmap</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Resume Builder Export</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 20 AI Mentor Prompts/day</li>
              </ul>
            </div>
            <button onClick={onGetStarted} className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all">
              Get Started Free
            </button>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900 border-2 border-blue-500 relative flex flex-col justify-between shadow-2xl shadow-blue-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-widest">
              Most Popular
            </div>
            <div>
              <div className="text-lg font-bold text-white">Pro Engineer</div>
              <div className="text-3xl font-extrabold text-white mt-4">$9 <span className="text-xs font-normal text-slate-400">/ month</span></div>
              <p className="text-xs text-slate-400 mt-2">Unlimited AI career guidance, interviews & ATS scanning.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Everything in Free</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited AI Roadmaps & Tasks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full ATS Resume Analyzer</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Voice AI Mock Interviews</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> GitHub Portfolio Audits</li>
              </ul>
            </div>
            <button onClick={onGetStarted} className="mt-8 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all">
              Upgrade to Pro
            </button>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-lg font-bold text-white">Career+ Hiring</div>
              <div className="text-3xl font-extrabold text-white mt-4">$19 <span className="text-xs font-normal text-slate-400">/ month</span></div>
              <p className="text-xs text-slate-400 mt-2">Direct recruiter referral pipeline & priority mentor access.</p>
              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Priority Recruiter Job Matching</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live System Design Review Sessions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Official Verified Certificate</li>
              </ul>
            </div>
            <button onClick={onGetStarted} className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all">
              Join Career+
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-10 bg-slate-950 text-slate-500 text-xs text-center">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="SkillBridge AI Logo"
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-blue-500/30"
            />
            <span className="font-bold text-slate-300 text-sm">SkillBridge AI</span>
            <span className="text-slate-600">|</span>
            <span>© {new Date().getFullYear()} Built for CS Students & Software Engineers.</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-slate-300 cursor-pointer">Contact Support</span>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
                <Lock className="w-3.5 h-3.5" /> Secure Authentication
              </div>
              <h2 className="text-2xl font-extrabold text-white">Log in to SkillBridge AI</h2>
              <p className="text-xs text-slate-400">Access your personalized roadmap, ATS resumes, and AI interview scores.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">University Email</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-800/80 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-800/80 text-white border border-slate-700 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In & Launch Dashboard</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800 text-center space-y-2">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Demo Quick Access</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60"
                >
                  🎓 Student Account
                </button>
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700/60"
                >
                  💼 Recruiter Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
