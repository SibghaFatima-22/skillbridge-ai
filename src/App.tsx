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
import { GithubAnalyzerView } from "./components/github/GithubAnalyzerView";
import { AIMentorView } from "./components/mentor/AIMentorView";
import { ProfileView } from "./components/profile/ProfileView";
import { AuthModal } from "./components/auth/AuthModal";

import { NotificationItem, UserProfile } from "./types";
import {
  storage,
  PRESET_USERS,
} from "./lib/storage";
import { auth, onAuthStateChanged, getUserProfileFromFirestore, logoutUser } from "./lib/firebase";
import {
  syncUserWithFirestore,
  syncAssessmentWithFirestore,
  syncRoadmapWithFirestore,
  syncResumeWithFirestore,
  fetchUserDataFromFirestore,
  calculateAndSaveCareerReadiness,
} from "./lib/firebaseSync";

export function App() {
  // Default to landing page on site start
  const [activeTab, setActiveTab] = useState<string>("landing");

  // Multi-User Candidate State Management initialized from current active ID
  const [user, setUser] = useState<UserProfile>(() => {
    const currentId = storage.getCurrentUserId();
    return storage.getUserProfile(currentId);
  });
  const [assessment, setAssessment] = useState(() => storage.getUserAssessment(user.id));
  const [roadmap, setRoadmap] = useState(() => storage.getUserRoadmap(user.id));
  const [resume, setResume] = useState(() => storage.getUserResume(user.id));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storage.getNotifications(user.id));

  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Logout: sign out of Firebase and reset app state
  const handleLogout = useCallback(async () => {
    await logoutUser();
    storage.setCurrentUserId("");
    const defaultUser = storage.getUserProfile("");
    setUser(defaultUser);
    setAssessment(storage.getUserAssessment(""));
    setRoadmap(storage.getUserRoadmap(""));
    setResume(storage.getUserResume(""));
    setNotifications([]);
    setActiveTab("landing");
  }, []);

  // Switch candidate user handler with full Firestore load
  const handleSwitchUser = useCallback(async (newUser: UserProfile) => {
    setUser(newUser);
    storage.setUserProfile(newUser);
    storage.setCurrentUserId(newUser.id);
    await syncUserWithFirestore(newUser.id, newUser);

    // 1. Load local candidate storage
    const loadedAssessment = storage.getUserAssessment(newUser.id);
    const loadedRoadmap = storage.getUserRoadmap(newUser.id);
    const loadedResume = storage.getUserResume(newUser.id);
    const loadedNotifs = storage.getNotifications(newUser.id);

    setAssessment(loadedAssessment);
    setRoadmap(loadedRoadmap);
    setResume(loadedResume);
    setNotifications(loadedNotifs);

    // 2. Fetch remote candidate data from Firestore if available
    const remoteData = await fetchUserDataFromFirestore(newUser.id);
    if (remoteData) {
      if (remoteData.user) {
        setUser(remoteData.user);
        storage.setUserProfile(remoteData.user);
      }
      if (remoteData.assessment) {
        setAssessment(remoteData.assessment);
        storage.setUserAssessment(newUser.id, remoteData.assessment);
      }
      if (remoteData.roadmap) {
        setRoadmap(remoteData.roadmap);
        storage.setUserRoadmap(newUser.id, remoteData.roadmap);
      }
      if (remoteData.resume) {
        setResume(remoteData.resume);
        storage.setUserResume(newUser.id, remoteData.resume);
      }
    }

    // Switch view to dashboard on successful login / profile switch
    setActiveTab("dashboard");
  }, []);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const localProfile = storage.getUserProfile(fbUser.uid);
        if (localProfile && localProfile.email === fbUser.email) {
          handleSwitchUser(localProfile);
        } else {
          // Fetch from Firestore
          const remoteProfile = await getUserProfileFromFirestore(fbUser.uid);
          if (remoteProfile) {
            handleSwitchUser(remoteProfile as UserProfile);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [handleSwitchUser]);

  const handleSetNotifications = useCallback((newNotifs: NotificationItem[]) => {
    setNotifications(newNotifs);
    storage.setNotifications(newNotifs, user.id);
  }, [user.id]);

  const addNotification = useCallback(
    (title: string, message: string, type: "info" | "success" | "warning" | "achievement" = "info") => {
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
        storage.setNotifications(updated, user.id);
        return updated;
      });
    },
    [user.id]
  );

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleSetUser = useCallback((updatedUser: UserProfile) => {
    setUser(updatedUser);
    storage.setUserProfile(updatedUser);
    storage.setCurrentUserId(updatedUser.id);
    syncUserWithFirestore(updatedUser.id, updatedUser);
  }, []);

  const handleSetAssessment = useCallback(
    async (newAsm: typeof assessment) => {
      setAssessment(newAsm);
      storage.setUserAssessment(user.id, newAsm);
      await syncAssessmentWithFirestore(user.id, newAsm);

      // Recalculate Career Readiness Score & sync to Firestore
      const newReadiness = await calculateAndSaveCareerReadiness(
        user.id,
        user,
        newAsm,
        roadmap,
        resume
      );

      setUser((u) => {
        const updated = { ...u, careerReadiness: newReadiness };
        storage.setUserProfile(updated);
        return updated;
      });
    },
    [user, roadmap, resume]
  );

  const handleSetRoadmap = useCallback(
    async (newRdm: typeof roadmap) => {
      setRoadmap(newRdm);
      storage.setUserRoadmap(user.id, newRdm);
      await syncRoadmapWithFirestore(user.id, newRdm);

      // Recalculate Career Readiness Score & sync to Firestore
      const newReadiness = await calculateAndSaveCareerReadiness(
        user.id,
        user,
        assessment,
        newRdm,
        resume
      );

      setUser((u) => {
        const updated = { ...u, careerReadiness: newReadiness };
        storage.setUserProfile(updated);
        return updated;
      });
    },
    [user, assessment, resume]
  );

  const handleSetResume = useCallback(
    async (newResume: typeof resume) => {
      setResume(newResume);
      storage.setUserResume(user.id, newResume);
      await syncResumeWithFirestore(user.id, newResume);

      // Recalculate Career Readiness Score & sync to Firestore
      const newReadiness = await calculateAndSaveCareerReadiness(
        user.id,
        user,
        assessment,
        roadmap,
        newResume
      );

      setUser((u) => {
        const updated = { ...u, careerReadiness: newReadiness };
        storage.setUserProfile(updated);
        return updated;
      });
    },
    [user, assessment, roadmap]
  );

  // Public Landing Page
  if (activeTab === "landing") {
    return (
      <LandingPage
        isLoggedIn={Boolean(user && user.fullName)}
        onGetStarted={() => setActiveTab("dashboard")}
      />
    );
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
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
          />

          {/* Dynamic View Container */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {activeTab === "dashboard" && (
              <DashboardView
                user={user}
                assessment={assessment}
                roadmap={roadmap}
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
                user={user}
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
              <ResourcesView user={user} />
            )}

            {activeTab === "resume-builder" && (
              <ResumeBuilderView
                resume={resume}
                setResume={handleSetResume}
                user={user}
              />
            )}

            {activeTab === "resume-analyzer" && (
              <ResumeAnalyzerView addNotification={addNotification} />
            )}

            {activeTab === "interview" && (
              <InterviewCoachView addNotification={addNotification} user={user} />
            )}

            {activeTab === "github" && (
              <GithubAnalyzerView user={user} setActiveTab={setActiveTab} addNotification={addNotification} />
            )}

            {activeTab === "mentor" && (
              <AIMentorView user={user} />
            )}

            {activeTab === "profile" && (
              <ProfileView user={user} setUser={handleSetUser} />
            )}
          </main>
        </div>
      </div>

      {/* Auth & Multi-User Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectUser={handleSwitchUser}
        currentUser={user}
        presetUsers={PRESET_USERS}
      />
    </div>
  );
}

export default App;
