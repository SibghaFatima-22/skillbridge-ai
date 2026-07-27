import {
  UserProfile,
  AssessmentData,
  RoadmapData,
  ResourceItem,
  ResumeData,
  ResumeAnalysisResult,
  MentorMessage,
  NotificationItem,
} from "../types";

const STORAGE_PREFIX = "skillbridge_v3_";

export function getScopedKey(userId: string, key: string): string {
  return `${STORAGE_PREFIX}${userId}_${key}`;
}

export const PRESET_USERS: UserProfile[] = [
  {
    id: "u_candidate_1",
    fullName: "Candidate User",
    email: "candidate@university.edu",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    university: "",
    degree: "BS Computer Science",
    semester: "",
    graduationYear: "2026",
    targetCareer: "Backend Developer",
    experienceLevel: "Intermediate (1-3 yrs)",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    careerReadiness: 0,
    roadmapProgress: 0,
    resumeScore: 0,
    interviewScore: 0,
    plan: "Pro",
    theme: "dark",
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_USER: UserProfile = PRESET_USERS[0];

export const INITIAL_ASSESSMENT: AssessmentData = {
  id: "asm_new",
  userId: "u_candidate_1",
  personalInfo: {
    university: "",
    semester: "",
    degree: "BS Computer Science",
    graduationYear: "2026",
  },
  programmingSkills: [],
  frameworks: [],
  databases: [],
  tools: [],
  softSkills: [],
  careerGoals: {
    targetCareer: "Backend Developer",
    preferredCompanyType: "Tech SaaS",
    targetSalary: "$80,000",
  },
  learningStyle: "Hands-on Projects",
  dailyHours: 3,
  overallScore: 0,
  careerReadiness: 0,
  strengths: [],
  weaknesses: [],
  missingSkills: [],
  careerRecommendation: "",
  estimatedLearningTime: "3 Months",
  recommendedTechnologies: [],
  summary: "No diagnostic assessment completed yet.",
  createdAt: new Date().toISOString(),
};

export const INITIAL_ROADMAP: RoadmapData = {
  id: "rdm_new",
  userId: "u_candidate_1",
  career: "Backend Developer",
  estimatedMonths: 3,
  estimatedWeeks: 12,
  difficulty: "Intermediate",
  summary: "Complete your diagnostic Assessment to generate your custom AI Learning Roadmap.",
  progress: 0,
  milestones: [],
  createdAt: new Date().toISOString(),
};

export const INITIAL_RESUME: ResumeData = {
  id: "res_new",
  userId: "u_candidate_1",
  template: "ATS Professional",
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    website: "",
  },
  summary: "",
  education: [],
  experience: [],
  projects: [],
  skills: {
    languages: [],
    frameworks: [],
    databases: [],
    tools: [],
  },
  certifications: [],
  achievements: [],
  updatedAt: new Date().toISOString(),
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_welcome",
    title: "Welcome to SkillBridge AI",
    message: "Start by completing your Career Assessment to generate your custom AI Roadmap.",
    type: "info",
    read: false,
    createdAt: new Date().toISOString(),
  },
];

export const storage = {
  getCurrentUserId(): string {
    try {
      return localStorage.getItem(`${STORAGE_PREFIX}current_user_id`) || "u_candidate_1";
    } catch {
      return "u_candidate_1";
    }
  },

  setCurrentUserId(id: string) {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}current_user_id`, id);
    } catch (e) {}
  },

  getPresetUsers(): UserProfile[] {
    return PRESET_USERS;
  },

  getUserProfile(userId: string = "u_candidate_1"): UserProfile {
    try {
      const data = localStorage.getItem(getScopedKey(userId, "user"));
      if (data) return JSON.parse(data);
      return { ...INITIAL_USER, id: userId };
    } catch {
      return { ...INITIAL_USER, id: userId };
    }
  },

  setUserProfile(user: UserProfile) {
    try {
      localStorage.setItem(getScopedKey(user.id, "user"), JSON.stringify(user));
    } catch (e) {}
  },

  getUserAssessment(userId: string = "u_candidate_1"): AssessmentData {
    try {
      const data = localStorage.getItem(getScopedKey(userId, "assessment"));
      if (data) return JSON.parse(data);
      return { ...INITIAL_ASSESSMENT, userId };
    } catch {
      return { ...INITIAL_ASSESSMENT, userId };
    }
  },

  setUserAssessment(userId: string, assessment: AssessmentData) {
    try {
      localStorage.setItem(getScopedKey(userId, "assessment"), JSON.stringify(assessment));
    } catch (e) {}
  },

  getUserRoadmap(userId: string = "u_candidate_1"): RoadmapData {
    try {
      const data = localStorage.getItem(getScopedKey(userId, "roadmap"));
      if (data) return JSON.parse(data);
      return { ...INITIAL_ROADMAP, userId };
    } catch {
      return { ...INITIAL_ROADMAP, userId };
    }
  },

  setUserRoadmap(userId: string, roadmap: RoadmapData) {
    try {
      localStorage.setItem(getScopedKey(userId, "roadmap"), JSON.stringify(roadmap));
    } catch (e) {}
  },

  getUserResume(userId: string = "u_candidate_1"): ResumeData {
    try {
      const data = localStorage.getItem(getScopedKey(userId, "resume"));
      if (data) return JSON.parse(data);
      return { ...INITIAL_RESUME, userId };
    } catch {
      return { ...INITIAL_RESUME, userId };
    }
  },

  setUserResume(userId: string, resume: ResumeData) {
    try {
      localStorage.setItem(getScopedKey(userId, "resume"), JSON.stringify(resume));
    } catch (e) {}
  },

  getNotifications(userId: string = "u_candidate_1"): NotificationItem[] {
    try {
      const data = localStorage.getItem(getScopedKey(userId, "notifications"));
      if (data) return JSON.parse(data);
      return INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  setNotifications(notifications: NotificationItem[], userId: string = "u_candidate_1") {
    try {
      localStorage.setItem(getScopedKey(userId, "notifications"), JSON.stringify(notifications));
    } catch (e) {}
  },
};

export const initialUserProfile = INITIAL_USER;
export const initialAssessmentData = INITIAL_ASSESSMENT;
export const initialRoadmapData = INITIAL_ROADMAP;
export const initialResumeData = INITIAL_RESUME;
export const initialNotifications = INITIAL_NOTIFICATIONS;
