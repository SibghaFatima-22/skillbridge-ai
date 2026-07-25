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

interface ChatMessage {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

export const AIMentorView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "mentor",
      text: "Hello Ali! I am your 24/7 SkillBridge AI Career Coach. How can I help you today with your CS learning, interview prep, or job search?",
      timestamp: "10:00 AM",
      suggestedFollowUps: [
        "How do I optimize my PostgreSQL queries for scale?",
        "What projects should I build for a Backend Engineer role?",
        "How do I answer 'Tell me about yourself' in an interview?",
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    const history = messages.map((m) => ({ role: m.sender === "user" ? "user" : "model", content: m.text }));

    const res = await sendMentorMessageAPI({
      query,
      conversationHistory: history,
      userContext: {
        targetCareer: "Backend Developer",
        careerReadiness: 78,
      },
    });

    const mentorMsg: ChatMessage = {
      id: "m_" + Date.now(),
      sender: "mentor",
      text: res.replyMarkdown || "Focusing on building production projects with Docker and Redis is key.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedFollowUps: res.suggestedFollowUps || [],
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
            <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini API • Context Aware</p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Online Live
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm scrollbar-none">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-3xl ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-emerald-400 border border-slate-800"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-2">
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-700/60"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>

              {/* Suggested Follow-ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedFollowUps.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 font-medium transition-all text-left"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-slate-400 px-1">{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span>AI Mentor is crafting a tailored response...</span>
          </div>
        )}
      </div>

      {/* Input Form Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-lg flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your career mentor anything about CS, code, or interviews..."
          className="flex-1 px-4 py-2.5 text-xs bg-transparent text-slate-900 dark:text-white outline-none"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
