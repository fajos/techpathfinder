// store/userProfileStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import syncService from '../services/syncService';

let currentIsPremium = false;
let currentUserId = null;

export const setPremiumSyncStatus = (isPremium, userId) => {
  currentIsPremium = isPremium;
  currentUserId = userId;
};

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
            weeklyGoal: 3,
            skills: [],
            skillHistory: []
          };
        }
        return { 
          profiles: { ...state.profiles },
          currentUserId: userId 
        };
      }),
      
      // ✅ ADD THIS FUNCTION
      ensureCurrentUser: (userId) => set((state) => {
        if (!state.currentUserId && userId && state.profiles[userId]) {

          return { currentUserId: userId };
        }
        return state;
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
          
          if (currentIsPremium && currentUserId === userId) {
            syncService.syncSavedCareers(userId, profile.savedCareers, true).catch(console.error);
          }
        }
        return { profiles: { ...state.profiles } };
      }),
      
      unsaveCareer: (userId, career) => set((state) => {
        const profile = state.profiles[userId];
        if (profile) {
          profile.savedCareers = profile.savedCareers.filter(c => c !== career);
          
          if (currentIsPremium && currentUserId === userId) {
            syncService.syncSavedCareers(userId, profile.savedCareers, true).catch(console.error);
          }
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
          
          if (currentIsPremium && currentUserId === userId) {
            syncService.syncLearningProgress(userId, profile.roadmapProgress, true).catch(console.error);
          }
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
        
        if (currentIsPremium && currentUserId === userId) {
          syncService.syncLearningProgress(userId, profile.roadmapProgress, true).catch(console.error);
        }
        
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
        
        if (currentIsPremium && currentUserId === userId) {
          syncService.syncQuizHistory(userId, profile.quizHistory, true).catch(console.error);
        }
        
        return { profiles: { ...state.profiles } };
      }),
      
      addSkill: (userId, skill) => set((state) => {
        const profile = state.profiles[userId];
        if (!profile.skills) profile.skills = [];
        if (!profile.skills.includes(skill)) {
          profile.skills.push(skill);
          
          if (currentIsPremium && currentUserId === userId) {
            syncService.syncProfileToCloud(userId, profile, true).catch(console.error);
          }
        }
        return { profiles: { ...state.profiles } };
      }),
      
      removeSkill: (userId, skill) => set((state) => {
        const profile = state.profiles[userId];
        if (profile && profile.skills) {
          profile.skills = profile.skills.filter(s => s !== skill);
          
          if (currentIsPremium && currentUserId === userId) {
            syncService.syncProfileToCloud(userId, profile, true).catch(console.error);
          }
        }
        return { profiles: { ...state.profiles } };
      }),
      
      updateProfile: (userId, updates) => set((state) => {
        if (!state.profiles[userId]) {
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
            weeklyGoal: 3,
            skills: [],
            skillHistory: []
          };
        }

        const currentProfile = state.profiles[userId];
        
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
        
        state.profiles[userId] = {
          ...currentProfile,
          ...updates,
          ...learningPlansUpdate
        };

        if (currentIsPremium && currentUserId === userId) {
          syncService.syncProfileToCloud(userId, state.profiles[userId], true).catch(console.error);
        }

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
        
        if (currentIsPremium && currentUserId === userId) {
          syncService.syncProfileToCloud(userId, profile, true).catch(console.error);
        }
        
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
      
      getCompletionPercentage: (careerId) => {
        const profile = get().getCurrentProfile();
        const careerData = require('../data/careerRoadmapsFull').default?.[careerId];
        if (!profile || !careerData) return 0;
        
        const progress = profile.roadmapProgress[careerId];
        if (!progress) return 0;
        
        return (progress.stepsCompleted.length / careerData.roadmap.length) * 100;
      },
      
      clearUser: () => set({ currentUserId: null }),
      
      syncToCloud: async (userId) => {
        if (currentIsPremium && currentUserId === userId) {
          const profile = get().getCurrentProfile();
          await syncService.fullSyncToCloud(userId, true);
          return true;
        }
        return false;
      },
      
      loadFromCloud: async (userId) => {
        if (currentIsPremium && currentUserId === userId) {
          const success = await syncService.loadFromCloudToLocal(userId, true);
          if (success) {
            const freshProfile = get().getCurrentProfile();
            return freshProfile;
          }
        }
        return null;
      }
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