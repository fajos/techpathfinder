// store/userProfileStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useUserProfileStore = create()(
  persist(
    (set, get) => ({
      profiles: {},
      currentUserId: null,
      loading: false,
      
      initProfile: (userId, userEmail) => set((state) => {
        if (!state.profiles[userId]) {
          state.profiles[userId] = {
            userId,
            email: userEmail,
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
        return { 
          profiles: { ...state.profiles },
          currentUserId: userId 
        };
      }),
      
      updateLastActive: (userId) => set((state) => {
        const profile = state.profiles[userId];
        if (profile) {
          profile.lastActive = new Date().toISOString();
          
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
      
      saveCareer: (userId, career) => set((state) => {
        const profile = state.profiles[userId];
        if (profile && !profile.savedCareers.includes(career)) {
          profile.savedCareers.push(career);
        }
        return { profiles: { ...state.profiles } };
      }),

      ensureCurrentUser: (userId) => set((state) => {
        if (!state.currentUserId && userId && state.profiles[userId]) {
          return { currentUserId: userId };
        }
        return state;
      }),

      unsaveCareer: (userId, career) => set((state) => {
        const profile = state.profiles[userId];
        if (profile) {
          profile.savedCareers = profile.savedCareers.filter(c => c !== career);
        }
        return { profiles: { ...state.profiles } };
      }),
      
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
        
        return { profiles: { ...state.profiles } };
      }),
      
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
        profile.quizHistory.push({
          ...result,
          date: new Date().toISOString(),
          id: Date.now().toString()
        });
        
        if (profile.quizHistory.length > 10) {
          profile.quizHistory.shift();
        }
        
        return { profiles: { ...state.profiles } };
      }),
      
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

        // Get the current profile
        const currentProfile = state.profiles[userId];
        
        // Handle learningPlans specially if present
        let learningPlansUpdate = {};
        if (updates.learningPlans) {
          learningPlansUpdate = {
            learningPlans: {
              ...(currentProfile.learningPlans || {}),
              ...updates.learningPlans
            }
          };
          delete updates.learningPlans;
        }
        
        // Merge all updates safely
        state.profiles[userId] = {
          ...currentProfile,
          ...updates,
          ...learningPlansUpdate
        };

        console.log('Profile updated:', state.profiles[userId]);
        return { profiles: { ...state.profiles } };
      }),
      
      addStudySession: (userId, duration, careerId) => set((state) => {
        const profile = state.profiles[userId];
        profile.studySessions.push({
          date: new Date().toISOString(),
          duration,
          careerId
        });
        
        get().updateLastActive(userId);
        return { profiles: { ...state.profiles } };
      }),
      
      getCurrentProfile: () => {
        const { profiles, currentUserId } = get();
        return currentUserId ? profiles[currentUserId] : null;
      },
      
      getCareerProgress: (careerId) => {
        const profile = get().getCurrentProfile();
        return profile?.roadmapProgress[careerId] || { stepsCompleted: [] };
      },
      
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