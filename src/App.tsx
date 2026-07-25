import React, { useState, useEffect } from "react";
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

import {
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
  const [notifications, setNotifications] = useState(initialNotifications);
  const [badges, setBadges] = useState(initialBadges);

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

  // Listen to live Firestore changes for user profile
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
            setNotifications={setNotifications}
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
                setAssessment={(newAsm) => {
                  setAssessment(newAsm);
                  setUser((u) => {
                    const updated = { ...u, careerReadiness: newAsm.careerReadiness };
                    syncUserWithFirestore(u.id, updated);
                    return updated;
                  });
                  syncAssessmentWithFirestore(user.id, newAsm);
                }}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "roadmap" && (
              <RoadmapView
                roadmap={roadmap}
                setRoadmap={(newRdm) => {
                  setRoadmap(newRdm);
                  syncRoadmapWithFirestore(user.id, newRdm);
                }}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "resources" && (
              <ResourcesView resources={resources} setResources={setResources} />
            )}

            {activeTab === "resume-builder" && (
              <ResumeBuilderView
                resume={resume}
                setResume={(newResume) => {
                  setResume(newResume);
                  syncResumeWithFirestore(user.id, newResume);
                }}
              />
            )}

            {activeTab === "resume-analyzer" && <ResumeAnalyzerView />}

            {activeTab === "interview" && <InterviewCoachView />}

            {activeTab === "job-matcher" && (
              <JobMatcherView jobs={jobs} setJobs={setJobs} />
            )}

            {activeTab === "github" && <GithubAnalyzerView user={user} setActiveTab={setActiveTab} />}

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
