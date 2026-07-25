import { db, doc, setDoc, getDoc, onSnapshot } from "./firebase";
import { UserProfile, AssessmentData, RoadmapData, ResumeData, InterviewSession } from "../types";

export const syncUserWithFirestore = async (userId: string, data: Partial<UserProfile>) => {
  if (!userId) return;
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error("Firestore sync user error:", error);
  }
};

export const syncResumeWithFirestore = async (userId: string, resume: ResumeData) => {
  if (!userId) return;
  try {
    const resumeRef = doc(db, "resumes", userId);
    await setDoc(resumeRef, { ...resume, userId, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error("Firestore sync resume error:", error);
  }
};

export const syncAssessmentWithFirestore = async (userId: string, assessment: AssessmentData) => {
  if (!userId) return;
  try {
    const asmRef = doc(db, "assessments", userId);
    await setDoc(asmRef, { ...assessment, userId, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error("Firestore sync assessment error:", error);
  }
};

export const syncRoadmapWithFirestore = async (userId: string, roadmap: RoadmapData) => {
  if (!userId) return;
  try {
    const rdmRef = doc(db, "roadmaps", userId);
    await setDoc(rdmRef, { ...roadmap, userId, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error("Firestore sync roadmap error:", error);
  }
};

export const saveInterviewToFirestore = async (userId: string, session: any) => {
  if (!userId) return;
  try {
    const interviewRef = doc(db, "interviews", `${userId}_${Date.now()}`);
    await setDoc(interviewRef, { ...session, userId, createdAt: new Date().toISOString() });
  } catch (error) {
    console.error("Firestore save interview error:", error);
  }
};

export const listenToUserData = (userId: string, onUpdate: (data: any) => void) => {
  if (!userId) return () => {};
  const userRef = doc(db, "users", userId);
  return onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data());
    }
  });
};
