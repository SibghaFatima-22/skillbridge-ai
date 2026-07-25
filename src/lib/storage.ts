import {
  UserProfile,
  AssessmentData,
  RoadmapData,
  ResourceItem,
  ResumeData,
  ResumeAnalysisResult,
  InterviewSession,
  JobMatch,
  MentorMessage,
  GithubAnalysis,
  NotificationItem,
  AchievementItem,
  DashboardInsights,
} from "../types";

const STORAGE_KEYS = {
  USER: "skillbridge_user",
  ASSESSMENT: "skillbridge_assessment",
  ROADMAP: "skillbridge_roadmap",
  RESOURCES: "skillbridge_resources",
  RESUME: "skillbridge_resume",
  RESUME_ANALYSIS: "skillbridge_resume_analysis",
  INTERVIEWS: "skillbridge_interviews",
  JOBS: "skillbridge_jobs",
  MENTOR_CHAT: "skillbridge_mentor_chat",
  GITHUB_ANALYSIS: "skillbridge_github_analysis",
  NOTIFICATIONS: "skillbridge_notifications",
  ACHIEVEMENTS: "skillbridge_achievements",
  INSIGHTS: "skillbridge_insights",
  THEME: "skillbridge_theme",
};

// Initial User Profile
const INITIAL_USER: UserProfile = {
  id: "u_cs_2026",
  fullName: "Ali Ahmed",
  email: "ali.ahmed@cs.university.edu",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  university: "National University of Computer & Emerging Sciences",
  degree: "BS Computer Science",
  semester: "6th Semester",
  graduationYear: "2026",
  targetCareer: "Backend Developer",
  experienceLevel: "Intermediate (1-3 yrs)",
  bio: "Passionate CS Junior focused on high-concurrency backend services, Node.js, distributed systems, and Cloud architecture.",
  githubUrl: "https://github.com/aliahmed-cs",
  linkedinUrl: "https://linkedin.com/in/aliahmed-dev",
  portfolioUrl: "https://aliahmed.dev",
  careerReadiness: 76,
  roadmapProgress: 64,
  resumeScore: 82,
  interviewScore: 78,
  jobMatchScore: 85,
  xp: 2450,
  level: 5,
  currentStreak: 12,
  plan: "Pro",
  theme: "dark",
  createdAt: new Date().toISOString(),
};

// Initial Assessment
const INITIAL_ASSESSMENT: AssessmentData = {
  id: "asm_101",
  userId: "u_cs_2026",
  personalInfo: {
    university: "National University of Computer & Emerging Sciences",
    semester: "6th Semester",
    degree: "BS Computer Science",
    graduationYear: "2026",
  },
  programmingSkills: [
    { name: "JavaScript", category: "Language", rating: 4 },
    { name: "TypeScript", category: "Language", rating: 4 },
    { name: "Python", category: "Language", rating: 3 },
    { name: "C++", category: "Language", rating: 4 },
    { name: "SQL", category: "Language", rating: 4 },
  ],
  frameworks: [
    { name: "Express.js", category: "Backend", rating: 4 },
    { name: "Node.js", category: "Backend", rating: 4 },
    { name: "React", category: "Frontend", rating: 3 },
    { name: "Next.js", category: "Fullstack", rating: 3 },
  ],
  databases: [
    { name: "PostgreSQL", category: "Relational", rating: 4 },
    { name: "MongoDB", category: "NoSQL", rating: 3 },
    { name: "Redis", category: "Cache", rating: 2 },
  ],
  tools: [
    { name: "Git & GitHub", category: "DevOps", rating: 4 },
    { name: "Docker", category: "Containerization", rating: 2 },
    { name: "Postman API", category: "Testing", rating: 4 },
    { name: "Linux CLI", category: "OS", rating: 3 },
  ],
  softSkills: [
    { name: "Problem Solving (DSA)", category: "Analytical", rating: 4 },
    { name: "System Design Concepts", category: "Architecture", rating: 3 },
    { name: "Technical Communication", category: "Soft Skill", rating: 4 },
  ],
  careerGoals: {
    targetCareer: "Backend Developer",
    preferredCompanyType: "Mid-to-Large Tech SaaS",
    targetSalary: "$80,000 - $110,000",
  },
  learningStyle: "Hands-on Projects",
  dailyHours: 3,
  overallScore: 78,
  careerReadiness: 76,
  strengths: [
    "Solid understanding of Relational Databases & SQL queries",
    "Strong Node.js & TypeScript asynchronous programming skills",
    "Good Object-Oriented Design & Data Structures foundation",
  ],
  weaknesses: [
    "Limited hands-on experience with Docker containerization & K8s",
    "System Design scaling strategies (Load balancing, Caching, Message Queues)",
    "CI/CD deployment pipelines automation",
  ],
  missingSkills: ["Docker", "Redis Caching", "System Design Patterns", "Kafka/RabbitMQ"],
  careerRecommendation:
    "You have a strong technical foundation for Backend Software Engineering. Focus on Docker, Redis caching, microservices architecture, and system design to be 100% job-ready for top product teams.",
  estimatedLearningTime: "3 Months",
  recommendedTechnologies: ["Docker", "Redis", "System Design", "PostgreSQL Optimization", "gRPC"],
  summary:
    "Ali demonstrates a high potential for Backend Developer roles. His core language and database skills are above average for a 6th-semester student.",
  createdAt: new Date().toISOString(),
};

// Initial Roadmap
const INITIAL_ROADMAP: RoadmapData = {
  id: "rdm_202",
  userId: "u_cs_2026",
  career: "Backend Developer",
  estimatedMonths: 3,
  estimatedWeeks: 12,
  difficulty: "Intermediate",
  summary: "Tailored 12-Week Production Backend Mastery Roadmap covering Advanced Node.js, PostgreSQL, Caching, Docker, and Microservices.",
  progress: 64,
  createdAt: new Date().toISOString(),
  capstoneProject: {
    title: "High-Throughput Order Management Microservice System",
    description: "Build an event-driven order processing API with Node.js, Express, Redis Pub/Sub, PostgreSQL, and Docker container orchestration.",
    deliverables: ["Swagger API docs", "Docker Compose setup", "JMeter Load Test report (>2000 RPS)", "GitHub Repository with CI/CD action"],
  },
  milestones: [
    {
      id: "m1",
      title: "Milestone 1: Advanced TypeScript & Asynchronous Node.js Internals",
      description: "Master event loop, worker threads, custom streams, memory leaks debugging, and strict TypeScript patterns.",
      month: 1,
      week: 1,
      difficulty: "Intermediate",
      estimatedHours: 18,
      keyTopics: ["Node Event Loop", "Buffers & Streams", "TypeScript Generics & Utility Types", "Async Hooks"],
      completed: true,
      weeklyTasks: [
        { id: "t11", title: "Master Node.js Event Loop phases and libuv", description: "Read deep dives on microtask vs macrotask queues.", type: "Learning", estimatedMinutes: 120, completed: true },
        { id: "t12", title: "Build custom Transform Streams for big data processing", description: "Create a stream parser that handles 100MB CSV files in chunks.", type: "Project", estimatedMinutes: 180, completed: true },
      ],
      miniProject: {
        title: "Real-time Log Stream Ingestion CLI",
        description: "Parse and aggregate server logs on the fly using Node streams without loading full files into memory.",
        techStack: ["Node.js", "TypeScript", "Streams API"],
      },
    },
    {
      id: "m2",
      title: "Milestone 2: Database Mastery & Query Optimization",
      description: "Deep dive into PostgreSQL query execution plans, indexing (B-Tree, GIN), ACID transactions, and ORM vs Query Builder.",
      month: 1,
      week: 3,
      difficulty: "Intermediate",
      estimatedHours: 20,
      keyTopics: ["PostgreSQL EXPLAIN ANALYZE", "Database Indexing", "Connection Pooling (PgBouncer)", "Transactions & Isolation Levels"],
      completed: true,
      weeklyTasks: [
        { id: "t21", title: "Optimize slow SQL queries using EXPLAIN ANALYZE", description: "Identify table scans vs index scans and add indexes.", type: "Practice", estimatedMinutes: 150, completed: true },
        { id: "t22", title: "Implement ACID multi-table checkout transactions", description: "Write raw SQL queries using isolation levels and locks.", type: "Project", estimatedMinutes: 200, completed: true },
      ],
      miniProject: {
        title: "E-Commerce Transaction Ledger API",
        description: "Transactional banking & wallet transfer REST endpoints with strict database constraints.",
        techStack: ["PostgreSQL", "Node.js", "Express", "Drizzle ORM"],
      },
    },
    {
      id: "m3",
      title: "Milestone 3: Redis Caching & Rate Limiting",
      description: "Implement distributed caching strategies (Cache-Aside, Write-Through), rate limiters, and session storage.",
      month: 2,
      week: 5,
      difficulty: "Intermediate",
      estimatedHours: 16,
      keyTopics: ["Redis Data Structures", "Distributed Locking", "Sliding Window Rate Limiter", "Pub/Sub Messaging"],
      completed: false,
      weeklyTasks: [
        { id: "t31", title: "Build sliding-window rate limiting middleware in Express", description: "Prevent brute force attacks using Redis atomic counters.", type: "Project", estimatedMinutes: 180, completed: true },
        { id: "t32", title: "Setup Cache-Aside layer for hot database queries", description: "Measure API response latency reduction from 120ms to 8ms.", type: "Learning", estimatedMinutes: 120, completed: false },
      ],
      miniProject: {
        title: "High-Traffic URL Shortener with Redis Cache",
        description: "URL shortener capable of serving 5000 requests/sec backed by Redis and Postgres persistence.",
        techStack: ["Node.js", "Redis", "PostgreSQL", "Docker"],
      },
    },
    {
      id: "m4",
      title: "Milestone 4: Docker Containerization & Microservices Infrastructure",
      description: "Package applications into multi-stage Docker builds, write Docker Compose configs, and design system resilience.",
      month: 3,
      week: 9,
      difficulty: "Advanced",
      estimatedHours: 24,
      keyTopics: ["Multi-stage Dockerfiles", "Docker Compose Networking", "Healthchecks & Restart Policies", "System Design Scaling"],
      completed: false,
      weeklyTasks: [
        { id: "t41", title: "Create optimized production Dockerfile (<100MB)", description: "Use Alpine Linux base images and non-root security user.", type: "Practice", estimatedMinutes: 150, completed: false },
        { id: "t42", title: "Orchestrate API server, Redis, and Postgres in Docker Compose", description: "Setup persistent volumes and environment secret injection.", type: "Project", estimatedMinutes: 240, completed: false },
      ],
      miniProject: {
        title: "Dockerized Microservices Boilerplate",
        description: "Complete containerized backend stack ready for Cloud deployment.",
        techStack: ["Docker", "Docker Compose", "Node.js", "PostgreSQL", "Redis"],
      },
    },
  ],
};

// Initial Resources
const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: "res_1",
    title: "Node.js Event Loop & Asynchronous Architecture Masterclass",
    description: "Deep technical guide explaining libuv threadpool, event queues, and performance pitfalls.",
    category: "Backend",
    technology: "Node.js",
    provider: "Official Node Docs & Deep Dives",
    difficulty: "Intermediate",
    duration: "2.5 Hours",
    url: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/",
    rating: 4.9,
    free: true,
    aiRecommended: true,
    bookmarked: true,
  },
  {
    id: "res_2",
    title: "PostgreSQL Indexing & Performance Tuning Guide",
    description: "Learn how B-Tree, Hash, and GIN indexes work under the hood in PostgreSQL databases.",
    category: "Databases",
    technology: "PostgreSQL",
    provider: "Use The Index, Luke!",
    difficulty: "Advanced",
    duration: "4 Hours",
    url: "https://use-the-index-luke.com/",
    rating: 4.8,
    free: true,
    aiRecommended: true,
    bookmarked: true,
  },
  {
    id: "res_3",
    title: "System Design Interview Primer",
    description: "Comprehensive open-source repository covering Scalability, Caching, Load Balancing, and Sharding.",
    category: "System Design",
    technology: "Architecture",
    provider: "GitHub / Donne Martin",
    difficulty: "Intermediate",
    duration: "10 Hours",
    url: "https://github.com/donnemartin/system-design-primer",
    rating: 4.9,
    free: true,
    aiRecommended: true,
    bookmarked: false,
  },
  {
    id: "res_4",
    title: "Docker for Software Engineers: Zero to Hero",
    description: "Interactive tutorial building multi-stage containers and orchestration setups.",
    category: "DevOps",
    technology: "Docker",
    provider: "Docker Labs",
    difficulty: "Beginner",
    duration: "3.5 Hours",
    url: "https://docs.docker.com/get-started/",
    rating: 4.7,
    free: true,
    aiRecommended: true,
    bookmarked: false,
  },
  {
    id: "res_5",
    title: "Data Structures & Algorithms in TypeScript",
    description: "Clean TypeScript implementations of LinkedLists, Binary Search Trees, Graphs, and Dynamic Programming.",
    category: "DSA",
    technology: "TypeScript",
    provider: "Frontend Masters / Primeagen",
    difficulty: "Intermediate",
    duration: "8 Hours",
    url: "https://github.com/trekhleb/javascript-algorithms",
    rating: 4.9,
    free: true,
    aiRecommended: false,
    bookmarked: false,
  },
  {
    id: "res_6",
    title: "Designing Data-Intensive Applications Core Summary",
    description: "Chapter breakdowns of Martin Kleppmann's legendary database and backend engineering textbook.",
    category: "System Design",
    technology: "Distributed Systems",
    provider: "O'Reilly Media",
    difficulty: "Advanced",
    duration: "15 Hours",
    url: "https://dataintensive.net/",
    rating: 5.0,
    free: false,
    aiRecommended: true,
    bookmarked: true,
  },
];

// Initial Resume Draft
const INITIAL_RESUME: ResumeData = {
  id: "res_303",
  userId: "u_cs_2026",
  template: "ATS Executive",
  personalInfo: {
    fullName: "Ali Ahmed",
    email: "ali.ahmed@cs.university.edu",
    phone: "+1 (555) 019-2834",
    location: "Lahore, Pakistan / Remote",
    github: "github.com/aliahmed-cs",
    linkedin: "linkedin.com/in/aliahmed-dev",
    website: "aliahmed.dev",
  },
  summary:
    "Computer Science Junior specializing in High-Performance Node.js & TypeScript Backend Development. Hands-on experience architecting RESTful APIs, relational schema design with PostgreSQL, Redis caching layers, and Docker containerized deployments. Passionate about scalable distributed systems and code optimization.",
  education: [
    {
      id: "edu_1",
      institution: "National University of Computer & Emerging Sciences",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2022",
      endDate: "Expected 2026",
      gpa: "3.72 / 4.0",
    },
  ],
  experience: [
    {
      id: "exp_1",
      company: "InnovateX Tech Labs",
      role: "Backend Software Engineering Intern",
      location: "Remote",
      startDate: "Jun 2024",
      endDate: "Aug 2024",
      current: false,
      bullets: [
        "Architected and deployed 12 RESTful API microservices in Express.js & TypeScript serving over 45,000 active monthly requests.",
        "Optimized database queries in PostgreSQL using B-Tree indexing and query restructuring, reducing average P95 latency by 38%.",
        "Configured Redis cache-aside caching mechanism for user session tokens, decreasing database load during peak traffic by 40%.",
        "Integrated Automated Jest integration tests achieving 88% unit code coverage across critical payment workflows.",
      ],
    },
  ],
  projects: [
    {
      id: "proj_1",
      title: "Real-time Distributed Chat & Notification Engine",
      role: "Lead Backend Architect",
      technologies: ["Node.js", "Express", "TypeScript", "Redis Pub/Sub", "Socket.IO", "PostgreSQL", "Docker"],
      link: "https://github.com/aliahmed-cs/realtime-chat-engine",
      bullets: [
        "Built a multi-channel WebSocket gateway with Redis Pub/Sub capable of broadcasting 1,200 messages/sec across horizontal node instances.",
        "Implemented JWT-based authentication with sliding refresh token mechanics and atomic Redis rate limiting middleware.",
        "Containerized full application stack with Docker Compose and deployed to Cloud Run container instances.",
      ],
    },
    {
      id: "proj_2",
      title: "High-Throughput URL Shortener & Analytics Gateway",
      role: "Creator",
      technologies: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Tailwind CSS"],
      link: "https://github.com/aliahmed-cs/url-analytics-service",
      bullets: [
        "Engineered a Base62 encoding URL shortener processing redirection queries with sub-10ms response times backed by Redis cache.",
        "Designed analytics dashboard logging referrer headers, IP geo-location, and click counts into PostgreSQL asynchronously.",
      ],
    },
  ],
  skills: {
    languages: ["TypeScript", "JavaScript (ES6+)", "Python", "SQL", "C++"],
    frameworks: ["Node.js", "Express.js", "React", "Next.js", "Jest"],
    databases: ["PostgreSQL", "MongoDB", "Redis", "SQLite"],
    tools: ["Git & GitHub", "Docker", "Postman", "Linux", "PgBouncer", "Vercel"],
  },
  certifications: [
    { id: "cert_1", name: "Meta Back-End Developer Professional Certificate", issuer: "Coursera / Meta", date: "2024" },
    { id: "cert_2", name: "PostgreSQL Essential Training", issuer: "LinkedIn Learning", date: "2023" },
  ],
  achievements: [
    { id: "ach_1", title: "Dean's Honor List", description: "Awarded top 5% academic performance across 4 consecutive semesters." },
    { id: "ach_2", title: "1st Place Hackathon Winner", description: "Built AI Resume Parsing service in 24 hours at SpeedCode 2024." },
  ],
  updatedAt: new Date().toISOString(),
};

// Initial Resume Analysis
const INITIAL_RESUME_ANALYSIS: ResumeAnalysisResult = {
  id: "ra_404",
  atsScore: 84,
  grammarScore: 92,
  keywordScore: 80,
  formattingScore: 88,
  overallReadiness: 82,
  summary: "Strong candidate resume for Junior Backend Engineer positions. Clear quantified metrics in internship experience and solid tech stack alignment.",
  strongSections: [
    "Work Experience contains high-impact action verbs (Architected, Optimized, Configured, Integrated)",
    "Projects showcase modern production backend stack (Redis Pub/Sub, Docker, PostgreSQL)",
    "Clean education section with high GPA (3.72/4.0)",
  ],
  weakSections: [
    "Missing explicit mention of System Design keywords (Load Balancing, Circuit Breaker)",
    "Could add metrics to the URL Shortener project bullets",
  ],
  missingKeywords: ["Docker Compose", "CI/CD Actions", "System Design", "Microservices", "Prometheus"],
  improvements: [
    "Include explicit CI/CD GitHub Actions pipeline setup under your Chat Engine project.",
    "Mention specific P95 response times for the URL Shortener API (e.g. 'sub-8ms latency').",
    "Add Docker Compose to your Skills section under Developer Tools.",
  ],
  improvedSummary:
    "High-performing Computer Science Junior with proven backend software engineering experience building production RESTful APIs, distributed caching layers, and containerized microservices. Proficient in Node.js, TypeScript, PostgreSQL, and Redis with a strong background in data structures and performance optimization.",
  suggestedSkills: ["Docker", "Kubernetes", "gRPC", "GitHub Actions", "Unit Testing"],
  createdAt: new Date().toISOString(),
};

// Initial Job Matches
const INITIAL_JOBS: JobMatch[] = [
  {
    id: "job_101",
    jobTitle: "Junior Backend Developer",
    company: "Vercel",
    location: "Remote (Global)",
    salary: "$85,000 - $110,000",
    matchPercentage: 92,
    requiredSkills: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker"],
    matchingSkills: ["Node.js", "TypeScript", "PostgreSQL", "Redis"],
    missingSkills: ["Docker Multi-stage"],
    applicationTip: "Highlight your experience with TypeScript & Redis Pub/Sub messaging in your cover letter.",
    postedDate: "1 day ago",
    type: "Junior Role",
    saved: true,
    bookmarked: true,
    applyUrl: "https://vercel.com/careers",
  },
  {
    id: "job_102",
    jobTitle: "Software Engineering Intern - Infrastructure",
    company: "Stripe",
    location: "San Francisco, CA / Remote",
    salary: "$55 / hr ($110,000 equiv)",
    matchPercentage: 86,
    requiredSkills: ["TypeScript", "Distributed Systems", "SQL", "Docker", "API Security"],
    matchingSkills: ["TypeScript", "SQL", "API Security"],
    missingSkills: ["Distributed Locking", "Kafka"],
    applicationTip: "Emphasize database query tuning and high reliability in your project descriptions.",
    postedDate: "3 days ago",
    type: "Internship",
    saved: false,
    bookmarked: false,
    applyUrl: "https://stripe.com/jobs",
  },
  {
    id: "job_103",
    jobTitle: "Associate Full Stack / Backend Engineer",
    company: "Linear",
    location: "Remote",
    salary: "$90,000 - $115,000",
    matchPercentage: 88,
    requiredSkills: ["Node.js", "React", "TypeScript", "PostgreSQL", "GraphQL"],
    matchingSkills: ["Node.js", "React", "TypeScript", "PostgreSQL"],
    missingSkills: ["GraphQL"],
    applicationTip: "Linear values clean code architecture and craftsmanship. Share your GitHub repository links.",
    postedDate: "Just now",
    type: "Junior Role",
    saved: true,
    bookmarked: true,
    applyUrl: "https://linear.app/careers",
  },
  {
    id: "job_104",
    jobTitle: "Backend Software Engineering Intern - AI Systems",
    company: "Scale AI",
    location: "New York / Remote",
    salary: "$50 / hr ($100,000 equiv)",
    matchPercentage: 81,
    requiredSkills: ["Python", "TypeScript", "PostgreSQL", "Docker", "FastAPI"],
    matchingSkills: ["TypeScript", "Python", "PostgreSQL"],
    missingSkills: ["FastAPI", "Vector Databases"],
    applicationTip: "Complete the SkillBridge AI Vector DB mini-module to boost match percentage to 95%.",
    postedDate: "4 days ago",
    type: "Internship",
    saved: false,
    bookmarked: false,
    applyUrl: "https://scale.com/careers",
  },
  {
    id: "job_105",
    jobTitle: "Associate Software Engineer - Cloud Platforms",
    company: "Google",
    location: "Mountain View, CA / Remote",
    salary: "$130,000 - $155,000",
    matchPercentage: 79,
    requiredSkills: ["C++", "Java", "Python", "System Design", "Distributed Systems"],
    matchingSkills: ["Python", "Data Structures", "System Design"],
    missingSkills: ["C++ Systems", "Kubernetes Internals"],
    applicationTip: "Use the AI Interview Coach in System Design mode before your Google phone screen.",
    postedDate: "2 days ago",
    type: "Junior Role",
    saved: false,
    bookmarked: false,
    applyUrl: "https://google.com/about/careers",
  },
  // Pakistan Tech Ecosystem Jobs
  {
    id: "job_pk_101",
    jobTitle: "Junior Full-Stack Engineer",
    company: "Systems Limited",
    location: "Lahore / Karachi / Islamabad, Pakistan",
    salary: "PKR 150,000 - 200,000 / mo",
    matchPercentage: 93,
    requiredSkills: ["React", "Node.js", "C# .NET Core", "SQL Server", "TypeScript"],
    matchingSkills: ["React", "Node.js", "TypeScript"],
    missingSkills: ["C# .NET Core"],
    applicationTip: "Systems Limited is Pakistan's premier IT exporter. Emphasize full-stack REST API development & clean architecture.",
    postedDate: "Today",
    type: "Junior Role",
    saved: true,
    bookmarked: true,
    applyUrl: "https://www.systemsltd.com/careers",
  },
  {
    id: "job_pk_102",
    jobTitle: "Software Engineering Intern - Backend Systems",
    company: "Educative.io",
    location: "Lahore, Pakistan / Remote PK",
    salary: "PKR 85,000 - 110,000 / mo",
    matchPercentage: 89,
    requiredSkills: ["Python", "Go", "Docker", "PostgreSQL", "Redis"],
    matchingSkills: ["Python", "PostgreSQL", "Redis"],
    missingSkills: ["Go", "Docker"],
    applicationTip: "Educative focuses on high-concurrency developer platforms. Highlight your Redis caching & performance benchmarks.",
    postedDate: "1 day ago",
    type: "Internship",
    saved: false,
    bookmarked: false,
    applyUrl: "https://www.educative.io/careers",
  },
  {
    id: "job_pk_103",
    jobTitle: "Associate Cloud Infrastructure Engineer",
    company: "Motive (formerly KeepTruckin)",
    location: "Islamabad / Lahore, Pakistan",
    salary: "PKR 250,000 - 350,000 / mo",
    matchPercentage: 85,
    requiredSkills: ["Ruby on Rails", "Node.js", "AWS", "Kubernetes", "Docker"],
    matchingSkills: ["Node.js", "Docker", "REST APIs"],
    missingSkills: ["Kubernetes", "AWS Terraform"],
    applicationTip: "Motive builds IoT and AI telemetry platforms. Mention microservices architecture & CI/CD pipeline automation.",
    postedDate: "2 days ago",
    type: "Junior Role",
    saved: true,
    bookmarked: true,
    applyUrl: "https://gomotive.com/company/careers",
  },
  {
    id: "job_pk_104",
    jobTitle: "Associate MERN Stack Developer",
    company: "DevSinc",
    location: "Lahore / Islamabad, Pakistan",
    salary: "PKR 130,000 - 170,000 / mo",
    matchPercentage: 91,
    requiredSkills: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    matchingSkills: ["React", "Node.js", "Express", "Tailwind CSS"],
    missingSkills: ["MongoDB Aggregations"],
    applicationTip: "DevSinc looks for rapid MVP builders. Showcase your production React + Node full-stack deployed projects.",
    postedDate: "3 days ago",
    type: "Junior Role",
    saved: false,
    bookmarked: false,
    applyUrl: "https://www.devsinc.com/careers",
  },
  {
    id: "job_pk_105",
    jobTitle: "Graduate Software Engineer (Fresh Grad 2026)",
    company: "Arbisoft",
    location: "Lahore / Remote (Pakistan)",
    salary: "PKR 160,000 - 210,000 / mo",
    matchPercentage: 88,
    requiredSkills: ["Python", "Django", "React", "PostgreSQL", "Data Structures"],
    matchingSkills: ["Python", "React", "PostgreSQL", "Data Structures"],
    missingSkills: ["Django ORM"],
    applicationTip: "Arbisoft's assessment tests raw DSA & problem solving. Practice LeetCode Mediums on Trees and Graphs.",
    postedDate: "4 days ago",
    type: "Junior Role",
    saved: false,
    bookmarked: false,
    applyUrl: "https://arbisoft.com/careers",
  },
  {
    id: "job_pk_106",
    jobTitle: "Associate AI & Software Engineer",
    company: "Afiniti",
    location: "Karachi / Islamabad, Pakistan",
    salary: "PKR 200,000 - 280,000 / mo",
    matchPercentage: 82,
    requiredSkills: ["Python", "TensorFlow", "C++", "REST APIs", "SQL"],
    matchingSkills: ["Python", "REST APIs", "SQL"],
    missingSkills: ["TensorFlow", "C++ Multithreading"],
    applicationTip: "Afiniti specializes in AI call routing. Highlight any machine learning model deployment experience.",
    postedDate: "5 days ago",
    type: "Junior Role",
    saved: false,
    bookmarked: false,
    applyUrl: "https://www.afiniti.com/careers",
  },
  {
    id: "job_pk_107",
    jobTitle: "Junior Frontend Engineer - Next.js",
    company: "Dubizzle Group (Bayut / Zameen)",
    location: "Lahore / Karachi, Pakistan",
    salary: "PKR 170,000 - 230,000 / mo",
    matchPercentage: 94,
    requiredSkills: ["React", "Next.js", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
    matchingSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    missingSkills: ["SSR Caching"],
    applicationTip: "Dubizzle powers high-traffic real estate portals. Demonstrate Web Vitals & Lighthouse page speed scores.",
    postedDate: "Just now",
    type: "Junior Role",
    saved: true,
    bookmarked: true,
    applyUrl: "https://www.bayut.com/careers",
  },
];

// Initial Mentor Chat Messages
const INITIAL_MENTOR_MESSAGES: MentorMessage[] = [
  {
    id: "msg_1",
    role: "assistant",
    text: "Hello Ali! 👋 I'm your **SkillBridge AI Career Mentor**. I have reviewed your target goal of becoming a **Backend Developer**.\n\nYou are currently **76% Job Ready**! Your Node.js, TypeScript, and PostgreSQL skills are strong. Today, I recommend focusing on **Redis Caching & Docker Containerization**.\n\nHow can I help you today? You can ask me technical questions, code reviews, resume critique, or interview tips!",
    suggestedFollowUps: [
      "How do I explain my database indexing project in an interview?",
      "What are top 5 Backend System Design questions asked at Vercel & Stripe?",
      "How do I dockerize my Express & Postgres application?",
    ],
    keyTakeaway: "Target Docker and Caching to reach 90%+ readiness.",
    timestamp: new Date().toISOString(),
  },
];

// Initial Notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "AI Career Assessment Completed",
    message: "Your career readiness score was updated to 76%. Recommended next step: Complete Milestone 3 (Redis Caching).",
    type: "success",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "notif_2",
    title: "New Job Match Found!",
    message: "Vercel posted 'Junior Backend Developer' (92% Match for your profile).",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "notif_3",
    title: "Streak Reward Unlocked! 🔥",
    message: "12-day study streak maintained! You earned +150 XP.",
    type: "achievement",
    read: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

// Initial Achievements
const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  { id: "ach_1", title: "Roadmap Pioneer", description: "Generated your first custom AI Career Roadmap", iconName: "Compass", xp: 200, unlocked: true, unlockedAt: "2026-06-15" },
  { id: "ach_2", title: "Assessment Master", description: "Completed full 8-step skill diagnostic assessment", iconName: "Award", xp: 250, unlocked: true, unlockedAt: "2026-06-10" },
  { id: "ach_3", title: "Resume Ninja", description: "Achieved an ATS score above 80%", iconName: "FileCheck", xp: 300, unlocked: true, unlockedAt: "2026-07-02" },
  { id: "ach_4", title: "Interview Ready", description: "Completed a full AI Mock Interview session", iconName: "Video", xp: 300, unlocked: true, unlockedAt: "2026-07-12" },
  { id: "ach_5", title: "GitHub Star", description: "Analyzed your GitHub developer portfolio", iconName: "Github", xp: 200, unlocked: true, unlockedAt: "2026-07-18" },
  { id: "ach_6", title: "30-Day Streak", description: "Maintain a learning streak for 30 consecutive days", iconName: "Flame", xp: 500, unlocked: false },
];

// Local Storage Helper
export const storage = {
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  },

  setUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getAssessment(): AssessmentData {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT);
      return data ? JSON.parse(data) : INITIAL_ASSESSMENT;
    } catch {
      return INITIAL_ASSESSMENT;
    }
  },

  setAssessment(assessment: AssessmentData) {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT, JSON.stringify(assessment));
  },

  getRoadmap(): RoadmapData {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROADMAP);
      return data ? JSON.parse(data) : INITIAL_ROADMAP;
    } catch {
      return INITIAL_ROADMAP;
    }
  },

  setRoadmap(roadmap: RoadmapData) {
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
  },

  getResources(): ResourceItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      return data ? JSON.parse(data) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  },

  setResources(resources: ResourceItem[]) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  },

  getResume(): ResumeData {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUME);
      return data ? JSON.parse(data) : INITIAL_RESUME;
    } catch {
      return INITIAL_RESUME;
    }
  },

  setResume(resume: ResumeData) {
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
  },

  getResumeAnalysis(): ResumeAnalysisResult {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUME_ANALYSIS);
      return data ? JSON.parse(data) : INITIAL_RESUME_ANALYSIS;
    } catch {
      return INITIAL_RESUME_ANALYSIS;
    }
  },

  setResumeAnalysis(analysis: ResumeAnalysisResult) {
    localStorage.setItem(STORAGE_KEYS.RESUME_ANALYSIS, JSON.stringify(analysis));
  },

  getJobs(): JobMatch[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (!data) return INITIAL_JOBS;
      const parsed: JobMatch[] = JSON.parse(data);
      // Merge any missing seed jobs (e.g., newly added Pakistan roles) by ID
      const existingIds = new Set(parsed.map((j) => j.id));
      const missingSeed = INITIAL_JOBS.filter((j) => !existingIds.has(j.id));
      if (missingSeed.length > 0) {
        const combined = [...parsed, ...missingSeed];
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(combined));
        return combined;
      }
      return parsed;
    } catch {
      return INITIAL_JOBS;
    }
  },

  setJobs(jobs: JobMatch[]) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  },

  getMentorMessages(): MentorMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MENTOR_CHAT);
      return data ? JSON.parse(data) : INITIAL_MENTOR_MESSAGES;
    } catch {
      return INITIAL_MENTOR_MESSAGES;
    }
  },

  setMentorMessages(messages: MentorMessage[]) {
    localStorage.setItem(STORAGE_KEYS.MENTOR_CHAT, JSON.stringify(messages));
  },

  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  setNotifications(notifications: NotificationItem[]) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  getAchievements(): AchievementItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  setAchievements(achievements: AchievementItem[]) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },
};

export const initialUserProfile = INITIAL_USER;
export const initialAssessmentData = INITIAL_ASSESSMENT;
export const initialRoadmapData = INITIAL_ROADMAP;
export const initialResourceItems = INITIAL_RESOURCES;
export const initialResumeData = INITIAL_RESUME;
export const initialJobMatches = INITIAL_JOBS;
export const initialNotifications = INITIAL_NOTIFICATIONS;
export const initialBadges = INITIAL_ACHIEVEMENTS;
