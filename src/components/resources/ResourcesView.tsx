import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Bookmark,
  Sparkles,
  ExternalLink,
  Star,
  Check,
  Tag,
  Filter,
} from "lucide-react";
import { ResourceItem, UserProfile } from "../../types";

interface ResourcesViewProps {
  resources?: ResourceItem[];
  setResources?: (res: ResourceItem[]) => void;
  user?: UserProfile;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ user }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const userRole = user?.targetCareer || "Software Engineer";

  // Generate real, high-value learning resources dynamically tailored to user's target career
  const roleResources: ResourceItem[] = useMemo(() => {
    const roleLower = userRole.toLowerCase();

    if (roleLower.includes("frontend") || roleLower.includes("ui") || roleLower.includes("web")) {
      return [
        {
          id: "r_fe_1",
          title: "React Official Documentation & Core Concepts",
          description: "Master React Hooks, State Management, Server Components, and Concurrent Rendering.",
          category: "Frontend",
          technology: "React",
          provider: "React Dev Team",
          difficulty: "Intermediate",
          duration: "5 Hours",
          url: "https://react.dev/learn",
          rating: 4.9,
          free: true,
          aiRecommended: true,
        },
        {
          id: "r_fe_2",
          title: "Next.js Full-Stack App Router Handbook",
          description: "Build production SSR/SSG web applications with API routes, Server Actions, and Vercel deploys.",
          category: "Frontend",
          technology: "Next.js",
          provider: "Vercel Academy",
          difficulty: "Intermediate",
          duration: "4 Hours",
          url: "https://nextjs.org/learn",
          rating: 4.95,
          free: true,
          aiRecommended: true,
        },
        {
          id: "r_fe_3",
          title: "TypeScript Deep Dive for Frontend Engineers",
          description: "Generics, Utility types, Type narrowing, and strict TypeScript patterns in React codebases.",
          category: "Languages",
          technology: "TypeScript",
          provider: "TypeScript Docs",
          difficulty: "Intermediate",
          duration: "6 Hours",
          url: "https://www.typescriptlang.org/docs/handbook/intro.html",
          rating: 4.85,
          free: true,
          aiRecommended: true,
        },
        {
          id: "r_fe_4",
          title: "Web Vitals & Performance Optimization",
          description: "Audit and optimize LCP, CLS, and INP metrics using Chrome DevTools Lighthouse.",
          category: "Performance",
          technology: "Web Performance",
          provider: "web.dev",
          difficulty: "Advanced",
          duration: "3 Hours",
          url: "https://web.dev/learn/performance/",
          rating: 4.9,
          free: true,
        },
      ];
    }

    if (roleLower.includes("ai") || roleLower.includes("ml") || roleLower.includes("data science") || roleLower.includes("machine learning")) {
      return [
        {
          id: "r_ai_1",
          title: "DeepLearning.AI - Prompt Engineering for Developers",
          description: "Learn prompt structure, structured JSON parsing, and LLM API integration with Gemini & OpenAI.",
          category: "AI / ML",
          technology: "Generative AI",
          provider: "DeepLearning.AI",
          difficulty: "Beginner",
          duration: "2 Hours",
          url: "https://www.deeplearning.ai/short-courses/",
          rating: 4.95,
          free: true,
          aiRecommended: true,
        },
        {
          id: "r_ai_2",
          title: "PyTorch Official Tutorials & Model Architectures",
          description: "Build neural networks, fine-tune models, and deploy AI models with PyTorch.",
          category: "AI / ML",
          technology: "PyTorch",
          provider: "PyTorch Org",
          difficulty: "Intermediate",
          duration: "8 Hours",
          url: "https://pytorch.org/tutorials/",
          rating: 4.9,
          free: true,
          aiRecommended: true,
        },
        {
          id: "r_ai_3",
          title: "RAG Systems & Vector Database Engineering",
          description: "Implement document parsing, embedding generation, and vector search with Pgvector & Pinecone.",
          category: "System Design",
          technology: "Vector DBs",
          provider: "Pinecone Learning",
          difficulty: "Advanced",
          duration: "5 Hours",
          url: "https://www.pinecone.io/learn/",
          rating: 4.88,
          free: true,
          aiRecommended: true,
        },
      ];
    }

    if (roleLower.includes("devops") || roleLower.includes("cloud") || roleLower.includes("infrastructure")) {
      return [
        {
          id: "r_do_1",
          title: "Docker Containerization Essentials & Multi-Stage Builds",
          description: "Package applications into slim Docker images, write Docker Compose networking, and handle secrets.",
          category: "DevOps",
          technology: "Docker",
          provider: "Docker Docs",
          difficulty: "Intermediate",
          duration: "4 Hours",
          url: "https://docs.docker.com/get-started/",
          rating: 4.9,
          free: true,
          aiRecommended: true,
        },
        {
          id: "r_do_2",
          title: "Kubernetes Basics & Pod Autoscaling Handbook",
          description: "Deploy microservices, configure Ingress controllers, and manage Horizontal Pod Autoscalers.",
          category: "Cloud",
          technology: "Kubernetes",
          provider: "CNCF / K8s Docs",
          difficulty: "Advanced",
          duration: "6 Hours",
          url: "https://kubernetes.io/docs/tutorials/",
          rating: 4.95,
          free: true,
          aiRecommended: true,
        },
      ];
    }

    // Default Backend / Fullstack / General CS Catalog
    return [
      {
        id: "r_be_1",
        title: "Node.js Event Loop & Asynchronous Architecture Masterclass",
        description: "Deep technical guide explaining libuv threadpool, event queues, and non-blocking I/O.",
        category: "Backend",
        technology: "Node.js",
        provider: "Official Node.js Docs",
        difficulty: "Intermediate",
        duration: "3 Hours",
        url: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/",
        rating: 4.9,
        free: true,
        aiRecommended: true,
      },
      {
        id: "r_be_2",
        title: "PostgreSQL Query Optimization & Indexing Guide",
        description: "Diagnose slow queries using EXPLAIN ANALYZE and design optimal B-Tree and GIN indexes.",
        category: "Databases",
        technology: "PostgreSQL",
        provider: "Use The Index, Luke",
        difficulty: "Intermediate",
        duration: "4 Hours",
        url: "https://use-the-index-luke.com/",
        rating: 4.95,
        free: true,
        aiRecommended: true,
      },
      {
        id: "r_be_3",
        title: "Designing Data-Intensive Applications Core Architecture",
        description: "Database partitioning, transactions, replication, and distributed systems trade-offs.",
        category: "System Design",
        technology: "Distributed Systems",
        provider: "O'Reilly Media",
        difficulty: "Advanced",
        duration: "10 Hours",
        url: "https://dataintensive.net/",
        rating: 5.0,
        free: false,
        aiRecommended: true,
      },
      {
        id: "r_be_4",
        title: "System Design Primer & Scalability Patterns",
        description: "Load balancing, rate limiting, Redis caching, and microservice architecture diagrams.",
        category: "System Design",
        technology: "System Architecture",
        provider: "GitHub Open Source",
        difficulty: "Intermediate",
        duration: "6 Hours",
        url: "https://github.com/donnemartin/system-design-primer",
        rating: 4.95,
        free: true,
        aiRecommended: true,
      },
    ];
  }, [userRole]);

  const categories = useMemo(() => {
    const set = new Set(["All"]);
    roleResources.forEach((r) => set.add(r.category));
    return Array.from(set);
  }, [roleResources]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredResources = roleResources.filter((r) => {
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.technology.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Dynamic Learning Vault
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Learning Resources for {userRole}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Handpicked documentation, courses, and guides dynamically curated for your active career target role.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${userRole} resources...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((item) => {
          const isBookmarked = !!bookmarkedIds[item.id];
          return (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {item.technology}
                  </span>
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className="text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
                  </button>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{item.provider}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
