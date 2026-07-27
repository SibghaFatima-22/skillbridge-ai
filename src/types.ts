// SkillBridge AI - Global TypeScript Types (Clean MVP)

export type TargetCareerRole =
  | "Frontend Developer"
  | "Backend Developer"
  | "Full Stack Developer"
  | "AI Engineer"
  | "ML Engineer"
  | "Data Scientist"
  | "Cloud Engineer"
  | "DevOps Engineer"
  | "Cyber Security Engineer"
  | "Mobile Developer"
  | "UI/UX Designer";

export type ExperienceLevel = "Beginner (0-1 yrs)" | "Intermediate (1-3 yrs)" | "Advanced (3+ yrs)";

export type LearningStyle = "Video Tutorials" | "Books & Reading" | "Hands-on Projects" | "Interactive Coding" | "Documentation";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  photoURL: string;
  university: string;
  degree: string;
  semester: string;
  graduationYear: string;
  targetCareer: TargetCareerRole;
  experienceLevel: ExperienceLevel;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  careerReadiness: number; // 0-100
  roadmapProgress: number; // 0-100
  resumeScore: number; // 0-100
  interviewScore: number; // 0-100
  plan: "Free" | "Pro" | "Career+";
  theme: "light" | "dark" | "system";
  createdAt: string;
}

export interface SkillRating {
  name: string;
  category: string;
  rating: number; // 1-5
}

export interface AssessmentData {
  id: string;
  userId: string;
  personalInfo: {
    university: string;
    semester: string;
    degree: string;
    graduationYear: string;
  };
  programmingSkills: SkillRating[];
  frameworks: SkillRating[];
  databases: SkillRating[];
  tools: SkillRating[];
  softSkills: SkillRating[];
  careerGoals: {
    targetCareer: TargetCareerRole;
    preferredCompanyType: string;
    targetSalary: string;
  };
  learningStyle: LearningStyle;
  dailyHours: number;
  overallScore: number;
  careerReadiness: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  careerRecommendation: string;
  estimatedLearningTime: string;
  recommendedTechnologies: string[];
  summary: string;
  createdAt: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  type: "Learning" | "Practice" | "Project" | "Quiz";
  estimatedMinutes: number;
  completed: boolean;
  resourceUrl?: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  month: number;
  week: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  keyTopics: string[];
  completed: boolean;
  weeklyTasks: RoadmapTask[];
  miniProject?: {
    title: string;
    description: string;
    techStack: string[];
  };
}

export interface RoadmapData {
  id: string;
  userId: string;
  career: TargetCareerRole;
  estimatedMonths: number;
  estimatedWeeks: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  summary: string;
  progress: number;
  capstoneProject?: {
    title: string;
    description: string;
    deliverables: string[];
  };
  milestones: RoadmapMilestone[];
  createdAt: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  technology: string;
  provider: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  url: string;
  rating: number;
  free: boolean;
  aiRecommended?: boolean;
  bookmarked?: boolean;
}

export interface ResumeData {
  id: string;
  userId: string;
  template: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
    bullets?: string[];
  }[];
  experience: {
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }[];
  projects: {
    id: string;
    title: string;
    role: string;
    technologies: string[];
    link: string;
    bullets: string[];
  }[];
  skills: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
  };
  certifications: { id: string; name: string; issuer: string; date: string }[];
  achievements: { id: string; title: string; description: string }[];
  updatedAt: string;
}

export interface ResumeAnalysisResult {
  id: string;
  atsScore: number;
  grammarScore: number;
  keywordScore: number;
  formattingScore: number;
  overallReadiness: number;
  summary: string;
  strongSections: string[];
  weakSections: string[];
  missingKeywords: string[];
  improvements: string[];
  improvedSummary: string;
  suggestedSkills: string[];
  createdAt: string;
}

export interface MentorMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  suggestedFollowUps?: string[];
  timestamp: string;
}

export interface GitHubAnalysisResult {
  username: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  publicReposCount?: number;
  followersCount?: number;
  followingCount?: number;
  overview?: string;
  profileRating: number;
  portfolioScore: number;
  atsScore: number;
  codeQualityScore: number;
  detectedLanguages?: { name: string; percentage: number }[];
  projectRatings?: {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    score: number;
    htmlUrl?: string;
    strengths: string[];
    improvements: string[];
    resumeBulletSuggestion: string;
  }[];
  skillGaps?: {
    skill: string;
    importance: "High" | "Medium";
    reason: string;
    recommendation: string;
  }[];
  improvements?: string[];
  topStrengths?: string[];
  recommendedNextProjects?: {
    title: string;
    description: string;
    techStack: string[];
    whyNeeded: string;
  }[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  interviewType: string;
  difficulty: string;
  overallScore?: number;
  completed: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "achievement";
  read: boolean;
  createdAt: string;
}
