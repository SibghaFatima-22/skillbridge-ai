import React, { useState, useEffect, useRef } from "react";
import { exportElementToPdf } from "../../lib/pdfExport";
import {
  Video,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Loader2,
  Award,
  RotateCcw,
  FileText,
  Target,
  Brain,
  TrendingUp,
  BarChart3,
  Download,
  XCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { generateInterviewAPI, evaluateInterviewAnswerAPI, generateInterviewReportAPI } from "../../lib/api";

interface InterviewCoachViewProps {
  addNotification?: (title: string, message: string, type?: "info" | "success" | "warning" | "achievement") => void;
  user?: { targetCareer?: string };
}

export const InterviewCoachView: React.FC<InterviewCoachViewProps> = ({ addNotification, user }) => {
  const [role, setRole] = useState(user?.targetCareer || "Software Engineer");
  const [questionCountChoice, setQuestionCountChoice] = useState<number>(12);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // Active Interview State
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [completedResponses, setCompletedResponses] = useState<any[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const baseAnswerRef = useRef<string>("");

  // Timer State
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef<any>(null);

  // Final Report State
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  const downloadPdfReport = async () => {
    if (!reportData) return;
    try {
      setExportingPdf(true);
      const element = document.getElementById("interview-report-print-area");
      if (!element) throw new Error("Report element not found");

      const filename = `${role.trim().replace(/\s+/g, "_")}_Interview_Evaluation_Report.pdf`;

      await exportElementToPdf({
        elementId: "interview-report-print-area",
        filename,
        backgroundColor: "#0f172a",
        scale: 2,
      });
    } catch (err) {
      console.error("PDF generation failed, falling back to print:", err);
      window.print();
    } finally {
      setExportingPdf(false);
    }
  };

  useEffect(() => {
    if (sessionStarted && !sessionFinished) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionStarted, sessionFinished]);

  // Voice Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = 0; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) {
              finalTranscript += res[0].transcript + " ";
            } else {
              interimTranscript += res[0].transcript;
            }
          }

          const base = baseAnswerRef.current ? baseAnswerRef.current.trim() + " " : "";
          const fullText = (base + finalTranscript + interimTranscript).trimStart();
          setUserAnswer(fullText);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event?.error);
          setIsListening(false);
          if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
            setSpeechError("Microphone access was denied. Please allow microphone permissions in browser settings or type your answer directly.");
          } else if (event?.error === "no-speech") {
            setSpeechError("No speech detected. Please speak clearly into your microphone.");
          } else if (event?.error === "network") {
            setSpeechError("Speech recognition network error. Please check your internet connection.");
          } else if (event?.error !== "aborted") {
            setSpeechError(`Voice dictation issue (${event?.error || "error"}). You can type your answer directly.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("Failed to instantiate SpeechRecognition:", err);
      }
    }
  }, []);

  const toggleMic = () => {
    setSpeechError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Voice dictation is not supported by your current browser window. You can type your response directly.");
      return;
    }

    if (!recognitionRef.current) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = 0; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) {
              finalTranscript += res[0].transcript + " ";
            } else {
              interimTranscript += res[0].transcript;
            }
          }

          const base = baseAnswerRef.current ? baseAnswerRef.current.trim() + " " : "";
          const fullText = (base + finalTranscript + interimTranscript).trimStart();
          setUserAnswer(fullText);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event?.error);
          setIsListening(false);
          if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
            setSpeechError("Microphone access was denied. Please allow microphone permissions in browser settings.");
          } else if (event?.error !== "aborted") {
            setSpeechError(`Voice dictation issue (${event?.error || "error"}). You can type your answer directly.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        setSpeechError("Unable to initialize speech recognition. You can type your response directly.");
        return;
      }
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      baseAnswerRef.current = userAnswer;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e: any) {
        console.warn("Failed to start speech recognition:", e);
        if (e?.name === "InvalidStateError") {
          try {
            recognitionRef.current.stop();
          } catch {}
          setIsListening(false);
        } else {
          setSpeechError("Could not access microphone. Please check browser permissions or type your answer.");
          setIsListening(false);
        }
      }
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const startSession = async () => {
    setLoading(true);
    setCompletedResponses([]);
    setSessionFinished(false);
    setReportData(null);
    setSecondsElapsed(0);

    const result = await generateInterviewAPI({
      targetRole: role,
      interviewType: "Technical & System Design & Behavioral",
      difficulty: "Intermediate",
      questionCount: questionCountChoice
    });

    if (result?.questions && result.questions.length > 0) {
      setQuestions(result.questions);
      setCurrentQuestionIdx(0);
      setSessionStarted(true);
      setEvaluation(null);
      setUserAnswer("");
    } else {
      // Fallback 12 questions
      setQuestions([
        { id: "q1", question: `Explain the core architecture of asynchronous execution and thread management in ${role}.`, keyPointsToCover: ["Event loop queues", "Thread pool", "Non-blocking I/O"], hint: "Focus on single-threaded event loop vs background worker threads." },
        { id: "q2", question: "How do you optimize slow database queries when scaling to millions of rows?", keyPointsToCover: ["B-Tree indexing", "EXPLAIN execution plan", "Partitioning"], hint: "Mention avoiding full table scans and indexing strategy." },
        { id: "q3", question: "Describe a situation where you had to debug a critical production outage under pressure.", keyPointsToCover: ["STAR method", "Root cause analysis", "Post-mortem prevention"], hint: "Use Situation, Task, Action, and Result." },
        { id: "q4", question: "How would you design a rate limiter to prevent API abuse in microservices?", keyPointsToCover: ["Token Bucket algorithm", "Redis sliding window", "Distributed clock sync"], hint: "Discuss Redis atomic increments and sliding window algorithm." },
        { id: "q5", question: "Compare REST vs GraphQL vs gRPC. When would you choose each?", keyPointsToCover: ["Payload size", "Overfetching", "Protocol buffers"], hint: "Compare client flexibility vs internal binary microservice speed." },
        { id: "q6", question: "What is your approach to automated unit and integration testing?", keyPointsToCover: ["Test pyramid", "Mocking dependencies", "CI coverage gates"], hint: "Explain unit vs integration test ratio." },
        { id: "q7", question: "Tell me about a time you disagreed with a senior developer on architectural design.", keyPointsToCover: ["Data-driven benchmarks", "Active listening", "Team alignment"], hint: "Focus on professional benchmarking and empathy." },
        { id: "q8", question: "How do you secure web applications against SQL Injection, XSS, and CSRF?", keyPointsToCover: ["Parameterized SQL", "Content Security Policy", "HttpOnly SameSite cookies"], hint: "Detail sanitization and secure cookie flags." },
        { id: "q9", question: "Explain the CAP theorem and trade-offs between CP and AP systems.", keyPointsToCover: ["Consistency vs Availability", "Network partition behavior"], hint: "Provide real database examples for CP and AP." },
        { id: "q10", question: "How do you manage Redis caching strategies to prevent cache stampedes and stale data?", keyPointsToCover: ["Cache-Aside pattern", "TTL strategies", "Distributed locking"], hint: "Explain cache invalidation and write-through vs cache-aside." },
        { id: "q11", question: "Describe a project where you had to pick up a new technology stack on a tight deadline.", keyPointsToCover: ["Fast documentation reading", "MVP prioritization", "Delivering on time"], hint: "Demonstrate rapid learning and scope management." },
        { id: "q12", question: "How do Docker and Kubernetes simplify environment parity and automated deployments?", keyPointsToCover: ["Immutable containers", "Horizontal scaling", "Zero-downtime rollouts"], hint: "Mention container isolation and autoscaling pods." }
      ]);
      setCurrentQuestionIdx(0);
      setSessionStarted(true);
      setEvaluation(null);
      setUserAnswer("");
    }
    setLoading(false);
  };

  const handleTextToSpeech = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const submitAnswer = async (overrideAnswer?: string) => {
    const textToEvaluate = overrideAnswer !== undefined ? overrideAnswer : userAnswer;
    setEvaluating(true);
    const currentQ = questions[currentQuestionIdx];

    const result = await evaluateInterviewAnswerAPI({
      question: currentQ.question,
      userAnswer: textToEvaluate,
      targetRole: role,
      interviewType: "Technical & Behavioral",
      keyPointsToCover: currentQ.keyPointsToCover || []
    });

    setEvaluation(result);
    setEvaluating(false);

    // Record response in completed list
    const responseRecord = {
      questionIndex: currentQuestionIdx + 1,
      question: currentQ.question,
      userAnswer: textToEvaluate,
      evaluation: result
    };

    setCompletedResponses((prev) => {
      const existing = prev.filter((r) => r.questionIndex !== currentQuestionIdx + 1);
      return [...existing, responseRecord];
    });
  };

  const handleSkipOrDontKnow = () => {
    const text = "I don't know";
    setUserAnswer(text);
    submitAnswer(text);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setUserAnswer("");
      setEvaluation(null);
      setHint(null);
    } else {
      finishInterviewSession();
    }
  };

  const finishInterviewSession = async () => {
    // Stop mic if running
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }

    setSessionFinished(true);
    setReportLoading(true);

    let responsesToUse = [...completedResponses];

    // Check if there is an un-evaluated answer typed into the input
    if (userAnswer.trim() && !completedResponses.some((r) => r.questionIndex === currentQuestionIdx + 1)) {
      responsesToUse.push({
        questionIndex: currentQuestionIdx + 1,
        question: questions[currentQuestionIdx]?.question || `Question ${currentQuestionIdx + 1}`,
        userAnswer: userAnswer.trim(),
        evaluation: evaluation || {
          score: 75,
          hiringRecommendation: "Hire",
          communicationScore: 78,
          technicalAccuracyScore: 75,
          problemSolvingScore: 75,
          feedback: "Answer recorded upon interview completion.",
          missingKeyPoints: [],
          modelAnswer: questions[currentQuestionIdx]?.hint || "Review core technical principles."
        }
      });
    }

    // Fill in any unanswered questions so every question in questions is accounted for
    questions.forEach((q, idx) => {
      const qIdx = idx + 1;
      if (!responsesToUse.some((r) => r.questionIndex === qIdx)) {
        responsesToUse.push({
          questionIndex: qIdx,
          question: q.question || `Question ${qIdx}`,
          userAnswer: "Unanswered",
          evaluation: {
            score: 0,
            communicationScore: 0,
            technicalAccuracyScore: 0,
            problemSolvingScore: 0,
            confidenceScore: 0,
            feedback: "Question unanswered when session finished early.",
            missingKeyPoints: ["Response required"],
            modelAnswer: q.hint || "Review technical mechanics and STAR principles for this question.",
            hiringRecommendation: "No Hire"
          }
        });
      }
    });

    // Sort responses by questionIndex
    responsesToUse.sort((a, b) => a.questionIndex - b.questionIndex);

    try {
      const report = await generateInterviewReportAPI({
        targetRole: role,
        interviewType: "Technical & Behavioral",
        questions,
        responses: responsesToUse
      });

      setReportData(report);

      if (addNotification) {
        const answeredCount = responsesToUse.filter(
          (r) => r.userAnswer && r.userAnswer !== "Unanswered" && !r.userAnswer.toLowerCase().includes("don't know")
        ).length;
        addNotification(
          "Mock Interview Evaluation Ready 🎯",
          `${role} mock interview complete (${answeredCount}/${questions.length} answered). Score: ${report.overallScore}% (${report.hiringVerdict}).`,
          report.overallScore >= 65 ? "success" : "info"
        );
      }
    } catch (err) {
      console.error("Error generating interview report:", err);
    } finally {
      setReportLoading(false);
    }
  };

  const downloadTextReport = () => {
    if (!reportData) return;
    const content = `=======================================================
OFFICIAL AI INTERVIEW EVALUATION REPORT
Target Role: ${role}
=======================================================

OVERALL SCORE: ${reportData.overallScore}%
HIRING RECOMMENDATION: ${reportData.hiringVerdict}

SCORES BREAKDOWN:
- Technical Depth: ${reportData.technicalScore}%
- Communication Clarity: ${reportData.communicationScore}%
- Problem Solving: ${reportData.problemSolvingScore}%
- STAR Methodology: ${reportData.starMethodScore}%

RECRUITER EXECUTIVE SUMMARY:
${reportData.executiveSummary || 'N/A'}

IDENTIFIED SKILL GAPS & RECOMMENDATIONS:
${(reportData.skillGaps || []).map((g: any, i: number) => `
${i + 1}. [${g.severity} Priority] ${g.skill}
   Description: ${g.description}
   How to Fix: ${g.howToFix}
`).join('\n')}

COMMUNICATION STRENGTHS:
${(reportData.communicationFeedback?.strengths || []).map((s: string) => `- ${s}`).join('\n')}

AREAS TO IMPROVE:
${(reportData.communicationFeedback?.areasToImprove || []).map((a: string) => `- ${a}`).join('\n')}

ACTION PLAN ("WHAT TO IMPROVE"):
${(reportData.whatToImprove || []).map((item: string, i: number) => `${i + 1}. ${item}`).join('\n')}

DETAILED QUESTION-BY-QUESTION BREAKDOWN:
${(reportData.questionSummaries || []).map((q: any) => `
Question ${q.questionNumber}: ${q.question}
Score: ${q.score}% (${q.verdict})
Candidate Answer: "${q.candidateAnswerSnippet}"
Takeaway: ${q.keyTakeaway}
`).join('\n-------------------------------------------------------\n')}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${role.replace(/\s+/g, "_")}_Interview_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentQ = questions[currentQuestionIdx];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Video className="w-3.5 h-3.5" /> AI Interview Simulator & Evaluation Coach
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Mock Interview Coach</h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate realistic technical, system design, and STAR behavioral interviews with strict AI scoring and a comprehensive interview report.
          </p>
        </div>

        {sessionStarted && !sessionFinished && (
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-mono font-bold text-amber-300">{formatTimer(secondsElapsed)}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowFinishConfirm(true)}
              className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Finish Interview
            </button>
          </div>
        )}
      </div>

      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-white shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Finish Mock Interview?</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Are you ready to wrap up your interview session? The AI evaluator will calculate overall scores, STAR compliance, communication clarity, and generate your final recruiter report.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFinishConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700 cursor-pointer"
              >
                Continue Answering
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFinishConfirm(false);
                  finishInterviewSession();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Yes, Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {!sessionStarted && !sessionFinished ? (
        /* Setup Configuration Box */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <Target className="w-5 h-5 text-amber-500" />
            <h2>Configure Your Mock Interview Session</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Target Technical Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Backend Engineer, Full Stack Developer, Data Scientist..."
              className="w-full px-4 py-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Number of Questions</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setQuestionCountChoice(12)}
                className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  questionCountChoice === 12
                    ? "bg-slate-900 text-amber-400 border-amber-500 shadow-md"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span>12 Questions (Standard Full Assessment)</span>
                {questionCountChoice === 12 && <CheckCircle className="w-4 h-4 text-amber-400" />}
              </button>
              <button
                type="button"
                onClick={() => setQuestionCountChoice(5)}
                className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  questionCountChoice === 5
                    ? "bg-slate-900 text-amber-400 border-amber-500 shadow-md"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span>5 Questions (Quick Practice Drill)</span>
                {questionCountChoice === 5 && <CheckCircle className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
          </div>

          <button
            onClick={startSession}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>Begin Live AI Interview ({questionCountChoice} Questions)</span>
          </button>
        </div>
      ) : sessionStarted && !sessionFinished ? (
        /* Active Interview Simulator View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question & Voice Reader - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Header */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-600 dark:text-amber-400">
                  Question {currentQuestionIdx + 1} of {questions.length}
                </span>
                <span className="text-slate-400">{Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                  {currentQ.category || "Technical Concept"}
                </span>
                <button
                  onClick={() => handleTextToSpeech(currentQ.question)}
                  className={`px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    speaking ? "text-amber-500 animate-pulse" : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{speaking ? "Speaking..." : "Listen Audio"}</span>
                </button>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">{currentQ.question}</h2>

              {hint && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                  💡 <strong>Interviewer Hint:</strong> {hint}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setHint(currentQ.hint || "Focus on describing core mechanics, trade-offs, and STAR methodology.")}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Request Hint
                </button>

                <button
                  type="button"
                  onClick={handleSkipOrDontKnow}
                  className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1 underline transition-all"
                >
                  <XCircle className="w-3.5 h-3.5" /> Skip / "I Don't Know"
                </button>
              </div>
            </div>

            {/* Response Input Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span>Your Technical Response</span>
                  {isListening && <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                </label>
                
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isListening ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>{isListening ? "Listening Voice..." : "Voice Dictation"}</span>
                </button>
              </div>

              {speechError && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between gap-2">
                  <span>⚠️ {speechError}</span>
                  <button onClick={() => setSpeechError(null)} className="font-bold underline text-[10px]">
                    Dismiss
                  </button>
                </div>
              )}

              <textarea
                rows={6}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer clearly, or use 'Voice Dictation'. If you don't know the answer, click 'Skip / I Don't Know' to see the model response..."
                className="w-full p-4 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 leading-relaxed text-slate-900 dark:text-white"
              />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => submitAnswer()}
                  disabled={evaluating || !userAnswer.trim()}
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Evaluate Answer</span>
                </button>

                {evaluation && (
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>{currentQuestionIdx < questions.length - 1 ? "Next Question →" : "View Final Report →"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI Evaluation Panel - Right Column */}
          <div className="space-y-6">
            {evaluation ? (
              <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Evaluation Score</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    evaluation.score >= 80 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                    evaluation.score >= 50 ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                    "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  }`}>
                    {evaluation.hiringRecommendation}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <div className={`text-5xl font-black ${
                    evaluation.score >= 80 ? "text-emerald-400" :
                    evaluation.score >= 50 ? "text-amber-400" :
                    "text-rose-400"
                  }`}>{evaluation.score}%</div>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-800 pt-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Communication</span>
                    <span className="font-bold">{evaluation.communicationScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Technical Accuracy</span>
                    <span className="font-bold">{evaluation.technicalAccuracyScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Problem Solving</span>
                    <span className="font-bold">{evaluation.problemSolvingScore}%</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 leading-relaxed">
                  <strong className="text-amber-400 block mb-1">Interviewer Feedback:</strong>
                  {evaluation.feedback}
                </div>

                {evaluation.missingKeyPoints && evaluation.missingKeyPoints.length > 0 && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                    <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Key Points Missed
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                      {evaluation.missingKeyPoints.map((kp: string, idx: number) => (
                        <li key={idx}>{kp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">Ideal Model Answer</div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-xl italic">
                    "{evaluation.modelAnswer}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs space-y-3">
                <Award className="w-10 h-10 text-amber-500 mx-auto" />
                <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">Awaiting Your Response</div>
                <p className="leading-relaxed">
                  Provide your answer and click "Evaluate Answer". The AI interviewer will analyze technical accuracy, STAR methodology, and communication clarity.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Comprehensive Final Interview Report View */
        <div className="space-y-8">
          {reportLoading ? (
            <div className="p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Generating Comprehensive Interview Report...</h2>
              <p className="text-xs text-slate-400">Synthesizing performance across all questions, communication structure, and skill gaps.</p>
            </div>
          ) : reportData ? (
            <div className="space-y-8">
              {/* Printable PDF Canvas Area */}
              <div id="interview-report-print-area" className="space-y-8 p-4 sm:p-6 bg-slate-900 rounded-3xl text-white">
                {/* Report Hero Summary */}
                <div className="p-6 md:p-8 rounded-3xl bg-slate-800 text-white border border-slate-700 space-y-6 shadow-xl">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
                        <BarChart3 className="w-3.5 h-3.5" /> Official Interview Evaluation Report
                      </div>
                      <h2 className="text-2xl md:text-3xl font-extrabold">{role} Mock Interview</h2>
                      <p className="text-xs text-slate-400 mt-1">
                        {completedResponses.filter(r => r.userAnswer && r.userAnswer !== "Unanswered" && !r.userAnswer.toLowerCase().includes("don't know")).length} of {questions.length} Questions Answered • Total Time: {formatTimer(secondsElapsed)}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-bold">Hiring Recommendation</div>
                      <span className={`px-4 py-2 rounded-2xl text-sm font-extrabold border ${
                        reportData.hiringVerdict === "Strong Hire" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" :
                        reportData.hiringVerdict === "Hire" ? "bg-blue-500/20 text-blue-300 border-blue-500/40" :
                        reportData.hiringVerdict === "Weak Hire" ? "bg-amber-500/20 text-amber-300 border-amber-500/40" :
                        "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      }`}>
                        {reportData.hiringVerdict}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
                      <div className="text-3xl font-black text-amber-400">{reportData.overallScore}%</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-bold">Overall Score</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
                      <div className="text-3xl font-black text-emerald-400">{reportData.technicalScore}%</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-bold">Technical Depth</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
                      <div className="text-3xl font-black text-blue-400">{reportData.communicationScore}%</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-bold">Communication</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
                      <div className="text-3xl font-black text-purple-400">{reportData.problemSolvingScore}%</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-bold">Problem Solving</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 col-span-2 md:col-span-1">
                      <div className="text-3xl font-black text-cyan-400">{reportData.starMethodScore}%</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-bold">STAR Method</div>
                    </div>
                  </div>

                  {reportData.executiveSummary && (
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-amber-400 font-bold block mb-1">Recruiter Executive Summary:</strong>
                      {reportData.executiveSummary}
                    </div>
                  )}
                </div>

                {/* Identified Skill Gaps Section */}
                {reportData.skillGaps && reportData.skillGaps.length > 0 && (
                  <div className="p-6 md:p-8 rounded-3xl bg-slate-800 border border-slate-700 space-y-6 shadow-sm">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                      <h3 className="text-lg font-bold text-white">Identified Technical & Skill Gaps</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportData.skillGaps.map((gap: any, idx: number) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-white text-xs">{gap.skill}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              gap.severity === "High" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}>
                              {gap.severity} Priority
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{gap.description}</p>
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                            🎯 <strong>How to Fix:</strong> {gap.howToFix}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Communication & Delivery Feedback */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Communication Strengths
                    </h3>
                    <ul className="text-xs text-slate-300 space-y-2 pl-4 list-disc">
                      {(reportData.communicationFeedback?.strengths || ["Articulated core concepts clearly", "Maintained good tone and structure"]).map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-400" /> Areas for Delivery Improvement
                    </h3>
                    <ul className="text-xs text-slate-300 space-y-2 pl-4 list-disc">
                      {(reportData.communicationFeedback?.areasToImprove || ["Incorporate quantifiable metrics in STAR examples", "Explain trade-offs explicitly"]).map((a: string, idx: number) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* What to Improve - Action Steps */}
                {reportData.whatToImprove && reportData.whatToImprove.length > 0 && (
                  <div className="p-6 md:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 space-y-4">
                    <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <Brain className="w-4 h-4" /> Action Plan ("What To Improve")
                    </h3>
                    <div className="space-y-2">
                      {reportData.whatToImprove.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-amber-500/20 text-xs text-slate-200">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <p className="leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question-by-Question Breakdown */}
                <div className="p-6 md:p-8 rounded-3xl bg-slate-800 border border-slate-700 space-y-6 shadow-sm">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" /> Question-by-Question Breakdown
                  </h3>

                  <div className="space-y-4">
                    {(reportData.questionSummaries || []).map((qs: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400">
                            Question {qs.questionNumber || idx + 1}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            qs.score >= 80 ? "bg-emerald-500/20 text-emerald-400" :
                            qs.score >= 50 ? "bg-amber-500/20 text-amber-400" :
                            "bg-rose-500/20 text-rose-400"
                          }`}>
                            {qs.score}% ({qs.verdict})
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{qs.question}</h4>
                        <p className="text-xs text-slate-400 italic">"Answer snippet: {qs.candidateAnswerSnippet}"</p>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                          💡 <strong>Takeaway:</strong> {qs.keyTakeaway}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
                  <button
                    onClick={downloadPdfReport}
                    disabled={exportingPdf}
                    className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 transition-all w-full sm:w-auto justify-center shadow-lg shadow-amber-600/20 disabled:opacity-50"
                  >
                    {exportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>Download Report (PDF)</span>
                  </button>

                  <button
                    onClick={downloadTextReport}
                    className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
                  >
                    <FileText className="w-4 h-4" /> Download .TXT
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
                  >
                    <FileText className="w-4 h-4 text-amber-400" /> Print
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSessionStarted(false);
                    setSessionFinished(false);
                    setReportData(null);
                  }}
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-all w-full sm:w-auto justify-center border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" /> Start New Session
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
