import React, { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  Bot,
  Loader2,
  Code2,
  HelpCircle,
  Briefcase,
  Copy,
  Check,
} from "lucide-react";
import { sendMentorMessageAPI } from "../../lib/api";
import { UserProfile } from "../../types";

interface ChatMessage {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

interface AIMentorViewProps {
  user?: UserProfile;
}

export const AIMentorView: React.FC<AIMentorViewProps> = ({ user }) => {
  const userName = user?.fullName ? user.fullName.split(" ")[0] : "there";
  const userCareer = user?.targetCareer || "Software Engineer";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "mentor",
      text: `Hello ${userName}! I am your 24/7 SkillBridge AI Career Coach. How can I help you today with your ${userCareer} path, interview prep, or project architecture?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedFollowUps: [
        `What projects should I build for a ${userCareer} role?`,
        "How do I optimize database queries for high throughput?",
        "How do I answer 'Tell me about yourself' in a technical interview?",
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isSimpleGreeting = (str: string) => {
    const s = str.trim().toLowerCase().replace(/[^a-z\s]/g, "");
    return ["hi", "hello", "hey", "heyy", "hey there", "hello there", "good morning", "good evening", "salaam", "assalam o alaikum"].includes(s);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    // 1. Natural greeting handler
    if (isSimpleGreeting(query)) {
      setTimeout(() => {
        const mentorGreeting: ChatMessage = {
          id: "m_" + Date.now(),
          sender: "mentor",
          text: `Hello ${userName}! 👋 Great to connect with you. I'm ready to assist with your **${userCareer}** career roadmap, resume optimization, System Design practice, or technical coding questions. What topic would you like to explore?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedFollowUps: [
            `What skills am I missing for ${userCareer}?`,
            "How do I practice AI mock interviews?",
            "How can I tailor my resume for ATS scanners?",
          ],
        };
        setMessages((prev) => [...prev, mentorGreeting]);
        setLoading(false);
      }, 400);
      return;
    }

    // 2. Technical / Career Query via Gemini API
    const history = messages.map((m) => ({ role: m.sender === "user" ? "user" : "model", content: m.text }));

    const res = await sendMentorMessageAPI({
      query,
      message: query,
      conversationHistory: history,
      userContext: {
        fullName: user?.fullName || "Candidate",
        careerGoal: userCareer,
        targetCareer: userCareer,
        experienceLevel: user?.experienceLevel || "Intermediate",
        careerReadiness: user?.careerReadiness || 78,
      },
    });

    const mentorMsg: ChatMessage = {
      id: "m_" + Date.now(),
      sender: "mentor",
      text: res?.replyMarkdown || `### 💡 Technical Guidance\n\nTo excel as a **${userCareer}**, focus on mastering core system fundamentals, hands-on production project builds, and articulating your architectural choices clearly during interviews.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedFollowUps: res?.suggestedFollowUps || [
        "What projects should I build to demonstrate this?",
        "How do I explain this topic in a technical interview?",
      ],
    };

    setMessages((prev) => [...prev, mentorMsg]);
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">AI Career Mentor 24/7</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini API • Context Aware ({userCareer})</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Coach
          </span>
        </div>
      </div>

      {/* Message Chat Container */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 overflow-y-auto space-y-4 shadow-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-2 max-w-xl">
              <div
                className={`p-4 rounded-3xl text-xs leading-relaxed border relative group ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white border-blue-500 rounded-tr-sm"
                    : "bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700/80 rounded-tl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                <button
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy text"
                >
                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Suggested Follow ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedFollowUps.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-[11px] font-medium px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all text-left"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-400 p-3">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span>AI Mentor is crafting your technical answer...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <input
          type="text"
          placeholder={`Ask AI Mentor anything about ${userCareer}, System Design, DSA, or Resume tips...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2.5 text-xs bg-transparent text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
