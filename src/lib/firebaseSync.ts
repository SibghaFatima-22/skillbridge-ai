import { db, doc, setDoc, getDoc, onSnapshot } from "./firebase";
import { UserProfile, AssessmentData, RoadmapData, ResumeData } from "../types";

// ─── Sync Individual Collections to Firestore ──────────────────────────────
export const syncUserWithFirestore = async (userId: string, data: Partial<UserProfile>) => {
  if (!userId) return;
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn("Firestore sync user skipped:", error);
  }
};

export const syncResumeWithFirestore = async (userId: string, resume: ResumeData) => {
  if (!userId) return;
  try {
    const resumeRef = doc(db, "resumes", userId);
    await setDoc(resumeRef, { ...resume, userId, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn("Firestore sync resume skipped:", error);
  }
};

export const syncAssessmentWithFirestore = async (userId: string, assessment: AssessmentData) => {
  if (!userId) return;
  try {
    const asmRef = doc(db, "assessments", userId);
    await setDoc(asmRef, { ...assessment, userId, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn("Firestore sync assessment skipped:", error);
  }
};

export const syncRoadmapWithFirestore = async (userId: string, roadmap: RoadmapData) => {
  if (!userId) return;
  try {
    const rdmRef = doc(db, "roadmaps", userId);
    await setDoc(rdmRef, { ...roadmap, userId, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn("Firestore sync roadmap skipped:", error);
  }
};

export const saveInterviewToFirestore = async (userId: string, session: any) => {
  if (!userId) return;
  try {
    const interviewRef = doc(db, "interviews", `${userId}_${Date.now()}`);
    await setDoc(interviewRef, { ...session, userId, createdAt: new Date().toISOString() });
  } catch (error) {
    console.warn("Firestore save interview skipped:", error);
  }
};

// ─── Fetch All Candidate Documents From Firestore ───────────────────────────
export const fetchUserDataFromFirestore = async (userId: string) => {
  if (!userId) return null;
  try {
    const [userSnap, asmSnap, rdmSnap, resSnap] = await Promise.all([
      getDoc(doc(db, "users", userId)),
      getDoc(doc(db, "assessments", userId)),
      getDoc(doc(db, "roadmaps", userId)),
      getDoc(doc(db, "resumes", userId)),
    ]);

    return {
      user: userSnap.exists() ? (userSnap.data() as UserProfile) : null,
      assessment: asmSnap.exists() ? (asmSnap.data() as AssessmentData) : null,
      roadmap: rdmSnap.exists() ? (rdmSnap.data() as RoadmapData) : null,
      resume: resSnap.exists() ? (resSnap.data() as ResumeData) : null,
    };
  } catch (error) {
    console.warn("Firestore load user data error:", error);
    return null;
  }
};

// ─── Dynamic Career Readiness Score Calculator & Firestore Sync ──────────────
export const calculateAndSaveCareerReadiness = async (
  userId: string,
  user: UserProfile,
  assessment?: AssessmentData,
  roadmap?: RoadmapData,
  resume?: ResumeData
): Promise<number> => {
  if (!userId) return 0;

  // 1. Assessment readiness (weighted 50%)
  const assessmentBase = assessment?.careerReadiness || assessment?.overallScore || 0;

  // 2. Roadmap milestone completion (weighted 30%)
  let roadmapProgress = 0;
  if (roadmap?.milestones && roadmap.milestones.length > 0) {
    let totalTasks = 0;
    let completedTasks = 0;
    roadmap.milestones.forEach((m) => {
      (m.weeklyTasks || []).forEach((t) => {
        totalTasks++;
        if (t.completed) completedTasks++;
      });
    });
    roadmapProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }

  // 3. Resume completeness (weighted 20%)
  let resumeScore = 0;
  if (resume) {
    if (resume.summary?.trim()) resumeScore += 25;
    if (resume.experience && resume.experience.length > 0) resumeScore += 25;
    if (resume.education && resume.education.length > 0) resumeScore += 25;
    if (
      (resume.skills?.languages?.length || 0) +
      (resume.skills?.frameworks?.length || 0) +
      (resume.skills?.tools?.length || 0) > 0
    ) {
      resumeScore += 25;
    }
  }

  const finalReadiness = Math.min(
    100,
    Math.round(assessmentBase * 0.50 + roadmapProgress * 0.30 + resumeScore * 0.20)
  );

  // Sync to Firestore & return score
  await syncUserWithFirestore(userId, {
    careerReadiness: finalReadiness,
    roadmapProgress,
    resumeScore,
  });

  return finalReadiness;
};
