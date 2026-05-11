// store/userProfileStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useUserProfileStore = create()(
  persist(
    (set, get) => ({
      // State
      profiles: {},
      currentUserId: null,
      loading: false,

      // Initialize profile for new user
      initProfile: (userId, userEmail) => set((state) => {
        if (!state.profiles[userId]) {
          state.profiles[userId] = {
            userId,
            email: userEmail,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),

            // Profile info
            displayName: '',
            experience: 'beginner', // beginner, intermediate, advanced
            weeklyHours: 5, // hours available per week
            targetCareer: null,
            skills: [], // Array of skills the user already has
            skillHistory: [], // Track when skills were added

            // Career preferences
            savedCareers: [], // array of career titles
            quizHistory: [], // past quiz results

            // Progress tracking
            completedRoadmaps: [], // career titles completed
            roadmapProgress: {}, // careerId -> { stepsCompleted: [], lastActive: date }
            resourceProgress: {}, // resourceId -> { completed: bool, date: date }

            // Learning plan
            learningPlans: {}, // careerId -> personalized plan
            studySessions: [], // tracked study time

            // Achievements
            achievements: [],
            streak: 0,
            lastStudyDate: null,

            // Settings
            notifications: true,
            weeklyGoal: 3 // hours per week
          };
        }
        return {
          profiles: { ...state.profiles },
          currentUserId: userId
        };
      }),

      // Update last active timestamp
      updateLastActive: (userId) => set((state) => {
        const profile = state.profiles[userId];
        if (profile) {
          profile.lastActive = new Date().toISOString();

          // Update streak
          const lastDate = profile.lastStudyDate ? new Date(profile.lastStudyDate) : null;
          const today = new Date();

          if (lastDate) {
            const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              profile.streak += 1;
            } else if (diffDays > 1) {
              profile.streak = 1;
            }
          } else {
            profile.streak = 1;
          }

          profile.lastStudyDate = today.toISOString().split('T')[0];
        }
        return { profiles: { ...state.profiles } };
      }),

      // Save career to user's list
      saveCareer: (userId, career) => set((state) => {
        const profile = state.profiles[userId];
        if (profile && !profile.savedCareers.includes(career)) {
          profile.savedCareers.push(career);
        }
        return { profiles: { ...state.profiles } };
      }),

      // Remove saved career
      unsaveCareer: (userId, career) => set((state) => {
        const profile = state.profiles[userId];
        if (profile) {
          profile.savedCareers = profile.savedCareers.filter(c => c !== career);
        }
        return { profiles: { ...state.profiles } };
      }),


      addSkill: (userId, skill) => set((state) => {
        // Make sure profile exists
        if (!state.profiles[userId]) {
          console.warn('Profile not found for user:', userId);
          return { profiles: { ...state.profiles } };
        }

        const profile = state.profiles[userId];

        // Ensure skills array exists
        if (!profile.skills) {
          profile.skills = [];
        }

        // Ensure skillHistory array exists
        if (!profile.skillHistory) {
          profile.skillHistory = [];
        }

        // Only add if not already present (case-insensitive)
        const skillExists = profile.skills.some(
          s => s?.toLowerCase() === skill?.toLowerCase()
        );

        if (!skillExists && skill) {
          profile.skills.push(skill);
          profile.skillHistory.push({
            skill,
            date: new Date().toISOString()
          });
          console.log('✅ Skill added:', skill);
        } else {
          console.log('⚠️ Skill already exists or invalid:', skill);
        }

        return { profiles: { ...state.profiles } };
      }),


      removeSkill: (userId, skill) => set((state) => {
        if (!state.profiles[userId]) return { profiles: { ...state.profiles } };

        const profile = state.profiles[userId];

        // Ensure skills array exists
        if (!profile.skills) {
          profile.skills = [];
        }

        // Remove the skill (case-insensitive)
        profile.skills = profile.skills.filter(s =>
          s.toLowerCase() !== skill.toLowerCase()
        );

        return { profiles: { ...state.profiles } };
      }),

      // Track roadmap progress
      updateRoadmapProgress: (userId, careerId, stepIndex) => set((state) => {
        const profile = state.profiles[userId];
        if (!profile.roadmapProgress[careerId]) {
          profile.roadmapProgress[careerId] = {
            stepsCompleted: [],
            startedAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
        }

        if (!profile.roadmapProgress[careerId].stepsCompleted.includes(stepIndex)) {
          profile.roadmapProgress[careerId].stepsCompleted.push(stepIndex);
          profile.roadmapProgress[careerId].lastActive = new Date().toISOString();
        }

        // Check if roadmap is complete
        const careerData = getCareerData(careerId); // You'll need to import this
        if (careerData &&
          profile.roadmapProgress[careerId].stepsCompleted.length === careerData.roadmap.length) {
          if (!profile.completedRoadmaps.includes(careerId)) {
            profile.completedRoadmaps.push(careerId);
          }
        }

        get().updateLastActive(userId);
        return { profiles: { ...state.profiles } };
      }),

      // Track resource completion (videos, articles, courses)
      markResourceComplete: (userId, resourceId, careerId) => set((state) => {
        const profile = state.profiles[userId];
        profile.resourceProgress[resourceId] = {
          completed: true,
          date: new Date().toISOString(),
          careerId
        };

        get().updateLastActive(userId);
        return { profiles: { ...state.profiles } };
      }),


      addQuizResult: (userId, result) => set((state) => {
        const profile = state.profiles[userId];
        if (!profile) return { profiles: { ...state.profiles } };

        // Check if this result already exists (optional)
        const lastResult = profile.quizHistory[profile.quizHistory.length - 1];
        if (lastResult && JSON.stringify(lastResult) === JSON.stringify(result)) {
          return { profiles: { ...state.profiles } };
        }

        profile.quizHistory.push({
          ...result,
          date: new Date().toISOString(),
          id: Date.now().toString()
        });

        // Keep only last 10
        if (profile.quizHistory.length > 10) {
          profile.quizHistory.shift();
        }

        return { profiles: { ...state.profiles } };
      }),

      // Update user profile settings
      updateProfile: (userId, updates) => set((state) => {
        // Create profile if it doesn't exist
        if (!state.profiles[userId]) {
          console.log('Creating new profile for user:', userId);
          state.profiles[userId] = {
            userId,
            email: '',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            displayName: '',
            experience: 'beginner',
            weeklyHours: 5,
            targetCareer: null,
            savedCareers: [],
            quizHistory: [],
            completedRoadmaps: [],
            roadmapProgress: {},
            resourceProgress: {},
            learningPlans: {},
            studySessions: [],
            achievements: [],
            streak: 0,
            lastStudyDate: null,
            notifications: true,
            weeklyGoal: 3
          };
        }

        // Safely merge updates
        const profile = state.profiles[userId];

        // Handle learningPlans specially (it's an object that needs merging)
        if (updates.learningPlans) {
          profile.learningPlans = {
            ...(profile.learningPlans || {}),
            ...updates.learningPlans
          };
          // Remove from updates so we don't overwrite
          delete updates.learningPlans;
        }

        // Merge remaining updates
        Object.assign(profile, updates);

        return { profiles: { ...state.profiles } };
      }),

      // Track study session
      addStudySession: (userId, duration, careerId) => set((state) => {
        const profile = state.profiles[userId];
        profile.studySessions.push({
          date: new Date().toISOString(),
          duration,
          careerId
        });

        // Update weekly progress
        get().updateLastActive(userId);
        return { profiles: { ...state.profiles } };
      }),

      // Get current user profile
      getCurrentProfile: () => {
        const { profiles, currentUserId } = get();
        return currentUserId ? profiles[currentUserId] : null;
      },

      // Get progress for specific career
      getCareerProgress: (careerId) => {
        const profile = get().getCurrentProfile();
        return profile?.roadmapProgress[careerId] || { stepsCompleted: [] };
      },

      // Calculate completion percentage
      getCompletionPercentage: (careerId) => {
        const profile = get().getCurrentProfile();
        const careerData = getCareerData(careerId);
        if (!profile || !careerData) return 0;

        const progress = profile.roadmapProgress[careerId];
        if (!progress) return 0;

        return (progress.stepsCompleted.length / careerData.roadmap.length) * 100;
      },

      // Clear user data on logout
      clearUser: () => set({ currentUserId: null })
    }),
    {
      name: 'user-profiles-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profiles: state.profiles,
        currentUserId: state.currentUserId
      })
    }
  )
);