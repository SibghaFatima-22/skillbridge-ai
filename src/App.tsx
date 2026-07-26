import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import { LandingPage } from "./components/landing/LandingPage";
import { DashboardView } from "./components/dashboard/DashboardView";
import { AssessmentWizard } from "./components/assessment/AssessmentWizard";
import { RoadmapView } from "./components/roadmap/RoadmapView";
import { ResourcesView } from "./components/resources/ResourcesView";
import { ResumeBuilderView } from "./components/resume/ResumeBuilderView";
import { ResumeAnalyzerView } from "./components/resume/ResumeAnalyzerView";
import { InterviewCoachView } from "./components/interview/InterviewCoachView";
import { JobMatcherView } from "./components/jobmatcher/JobMatcherView";
import { GithubAnalyzerView } from "./components/github/GithubAnalyzerView";
import { AIMentorView } from "./components/mentor/AIMentorView";
import { AnalyticsView } from "./components/analytics/AnalyticsView";
import { AchievementsView } from "./components/achievements/AchievementsView";
import { ProfileView } from "./components/profile/ProfileView";
import { SettingsView } from "./components/settings/SettingsView";
import { AdminDashboardView } from "./components/admin/AdminDashboardView";

import { NotificationItem } from "./types";
import {
  storage,
  initialUserProfile,
  initialAssessmentData,
  initialRoadmapData,
  initialResourceItems,
  initialResumeData,
  initialJobMatches,
  initialNotifications,
  initialBadges,
} from "./lib/storage";
import { auth, onSnapshot, doc, db } from "./lib/firebase";
import {
  syncUserWithFirestore,
  syncRoadmapWithFirestore,
  syncAssessmentWithFirestore,
  syncResumeWithFirestore,
} from "./lib/firebaseSync";

export function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [user, setUser] = useState(initialUserProfile);
  const [assessment, setAssessment] = useState(initialAssessmentData);
  const [roadmap, setRoadmap] = useState(initialRoadmapData);
  const [resources, setResources] = useState(initialResourceItems);
  const [resume, setResume] = useState(initialResumeData);
  const [jobs, setJobs] = useState(initialJobMatches);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storage.getNotifications());
  const [badges, setBadges] = useState(initialBadges);

  const handleSetNotifications = useCallback((newNotifs: NotificationItem[]) => {
    setNotifications(newNotifs);
    storage.setNotifications(newNotifs);
  }, []);

  const addNotification = useCallback((title: string, message: string, type: "info" | "success" | "warning" | "achievement" = "info") => {
    const newNotif: NotificationItem = {
      id: "notif_" + Date.now(),
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      storage.setNotifications(updated);
      return updated;
    });
  }, []);

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync state with Firestore on initial load & Auth changes
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser((prev) => ({
          ...prev,
          id: firebaseUser.uid,
          fullName: firebaseUser.displayName || prev.fullName,
          email: firebaseUser.email || prev.email,
          photoURL: firebaseUser.photoURL || prev.photoURL,
        }));
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Listen to live Firestore changes for user profile.
  // NOTE: this listener can fire independently of any user interaction
  // (e.g. any write to this doc from another tab/session, or the initial
  // sync-on-create branch below). Every fire calls setUser, which
  // re-renders the whole App tree. Without memoized children (fixed below
  // via useCallback + React.memo on the heavy views), that re-render was
  // cascading into a full re-execution of whichever tab was mounted
  // (e.g. the 8-step AssessmentWizard), which is what caused the
  // "noticeable delay before it highlights" when a star click happened
  // to land while one of these unrelated re-renders was in flight.
  useEffect(() => {
    if (!user.id) return;
    const userRef = doc(db, "users", user.id);
    const unsubscribeDoc = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const firestoreData = snapshot.data();
        setUser((prev) => ({ ...prev, ...firestoreData }));
      } else {
        // First time initialization in Firestore
        syncUserWithFirestore(user.id, user);
      }
    });
    return () => unsubscribeDoc();
  }, [user.id]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Stabilized callback props. Previously these were inline arrow
  // functions re-created on every App render, which defeats any child
  // memoization and forces prop-identity-based effects/renders downstream
  // to fire more often than necessary.
  const handleSetAssessment = useCallback((newAsm: typeof assessment) => {
    setAssessment(newAsm);
    setUser((u) => {
      const updated = { ...u, careerReadiness: newAsm.careerReadiness };
      syncUserWithFirestore(u.id, updated);
      return updated;
    });
    syncAssessmentWithFirestore(user.id, newAsm);
  }, [user.id]);

  const handleSetRoadmap = useCallback((newRdm: typeof roadmap) => {
    setRoadmap(newRdm);
    syncRoadmapWithFirestore(user.id, newRdm);
  }, [user.id]);

  const handleSetResume = useCallback((newResume: typeof resume) => {
    setResume(newResume);
    syncResumeWithFirestore(user.id, newResume);
  }, [user.id]);

  // If activeTab is landing, show full public landing page
  if (activeTab === "landing") {
    return <LandingPage onGetStarted={() => setActiveTab("dashboard")} />;
  }

  return (
    <div className={`min-h-screen font-sans ${theme === "dark" ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <Navbar
            user={user}
            notifications={notifications}
            setNotifications={handleSetNotifications}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
            setTheme={setTheme}
            setIsMobileOpen={setIsMobileOpen}
          />

          {/* Dynamic View Container */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {activeTab === "dashboard" && (
              <DashboardView
                user={user}
                assessment={assessment}
                roadmap={roadmap}
                jobs={jobs}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "assessment" && (
              <AssessmentWizard
                assessment={assessment}
                setAssessment={handleSetAssessment}
                roadmap={roadmap}
                setRoadmap={handleSetRoadmap}
                setActiveTab={setActiveTab}
                addNotification={addNotification}
              />
            )}

            {activeTab === "roadmap" && (
              <RoadmapView
                roadmap={roadmap}
                setRoadmap={handleSetRoadmap}
                setActiveTab={setActiveTab}
                assessment={assessment}
              />
            )}

            {activeTab === "resources" && (
              <ResourcesView resources={resources} setResources={setResources} />
            )}

            {activeTab === "resume-builder" && (
              <ResumeBuilderView
                resume={resume}
                setResume={handleSetResume}
              />
            )}

            {activeTab === "resume-analyzer" && <ResumeAnalyzerView addNotification={addNotification} />}

            {activeTab === "interview" && <InterviewCoachView addNotification={addNotification} />}

            {activeTab === "job-matcher" && (
              <JobMatcherView jobs={jobs} setJobs={setJobs} />
            )}

            {activeTab === "github" && <GithubAnalyzerView user={user} setActiveTab={setActiveTab} addNotification={addNotification} />}

            {activeTab === "mentor" && <AIMentorView />}

            {activeTab === "analytics" && <AnalyticsView user={user} />}

            {activeTab === "achievements" && (
              <AchievementsView user={user} badges={badges} />
            )}

            {activeTab === "profile" && (
              <ProfileView user={user} setUser={setUser} />
            )}

            {activeTab === "settings" && (
              <SettingsView theme={theme} setTheme={setTheme} />
            )}

            {activeTab === "admin" && <AdminDashboardView />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
