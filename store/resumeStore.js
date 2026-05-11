// store/resumeStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { resumeTemplates } from '../data/resumeTemplates';

export const useResumeStore = create()(
  persist(
    (set, get) => ({
      resumes: [],
      currentResumeId: null,
      templates: resumeTemplates,
      
      // Create new resume
      createResume: (userId, career, template = 'modern') => set((state) => {
        const newResume = {
          id: `resume_${Date.now()}`,
          userId,
          career,
          template,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          data: {
            personal: {
              name: '',
              email: '',
              phone: '',
              location: '',
              linkedin: '',
              portfolio: '',
              github: ''
            },
            summary: '',
            skills: [],
            experience: [],
            education: [],
            projects: [],
            certifications: [],
            languages: [],
            achievements: []
          }
        };
        
        return {
          resumes: [...state.resumes, newResume],
          currentResumeId: newResume.id
        };
      }),
      
      // Update resume
      updateResume: (resumeId, updates) => set((state) => ({
        resumes: state.resumes.map(resume =>
          resume.id === resumeId
            ? { ...resume, ...updates, updatedAt: new Date().toISOString() }
            : resume
        )
      })),
      
      // Update specific section
      updateSection: (resumeId, section, data) => set((state) => ({
        resumes: state.resumes.map(resume =>
          resume.id === resumeId
            ? {
                ...resume,
                data: { ...resume.data, [section]: data },
                updatedAt: new Date().toISOString()
              }
            : resume
        )
      })),
      
      // Delete resume
      deleteResume: (resumeId) => set((state) => ({
        resumes: state.resumes.filter(r => r.id !== resumeId),
        currentResumeId: state.currentResumeId === resumeId ? null : state.currentResumeId
      })),
      
      // Set current resume
      setCurrentResume: (resumeId) => set({ currentResumeId: resumeId }),
      
      // Get current resume
      getCurrentResume: () => {
        const { resumes, currentResumeId } = get();
        return resumes.find(r => r.id === currentResumeId) || null;
      },
      
      // Import from user profile
      importFromProfile: (resumeId, profile) => set((state) => {
        const resume = state.resumes.find(r => r.id === resumeId);
        if (!resume) return state;
        
        // Map profile data to resume
        resume.data.personal.name = profile.displayName || '';
        resume.data.skills = profile.skills || [];
        
        return {
          resumes: state.resumes.map(r =>
            r.id === resumeId ? resume : r
          )
        };
      })
    }),
    {
      name: 'resume-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);