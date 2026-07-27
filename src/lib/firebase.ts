import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  AuthError,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, addDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// ─── Email/Password Registration ────────────────────────────────────────────
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  return credential.user;
};

// ─── Email/Password Sign-In ──────────────────────────────────────────────────
export const signInWithEmail = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

// ─── Password Reset Email ───────────────────────────────────────────────────
export const resetPasswordEmail = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

// ─── Sign Out ────────────────────────────────────────────────────────────────
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

// ─── Save Candidate Profile to Firestore (with permission fallback) ──────────
export const saveUserProfileToFirestore = async (userId: string, profileData: object) => {
  try {
    await setDoc(doc(db, "users", userId), { ...profileData, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error: any) {
    console.warn("Firestore profile save skipped:", error?.message || error);
  }
};

// ─── Get Candidate Profile from Firestore ────────────────────────────────────
export const getUserProfileFromFirestore = async (userId: string) => {
  try {
    const snap = await getDoc(doc(db, "users", userId));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.warn("Firestore profile fetch skipped:", error);
    return null;
  }
};

// ─── Friendly Error Messages ─────────────────────────────────────────────────
export const getAuthErrorMessage = (error: AuthError | any): string => {
  const code = error?.code || "";
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please sign in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect password or email. Please check your credentials.";
    case "auth/user-not-found":
      return "No account found with this email. Please register first.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a moment and try again.";
    default:
      return error?.message || "Authentication failed. Please try again.";
  }
};

export { doc, setDoc, getDoc, onSnapshot, collection, addDoc, onAuthStateChanged };
