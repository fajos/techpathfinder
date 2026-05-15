// store/authStore.js
import { create } from 'zustand';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      initialized: false,

      setUser: (user) => set({ user }),

      initialize: () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          set({ 
            user, 
            isLoading: false,
            initialized: true 
          });
          console.log('Auth state changed:', user?.uid || 'No user');
        });
        return unsubscribe;
      },

      signIn: async (email, password) => {
        try {
          set({ isLoading: true });
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          set({ 
            user: userCredential.user,
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.message 
          };
        }
      },

      signUp: async (email, password) => {
        try {
          set({ isLoading: true });
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          set({ 
            user: userCredential.user,
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.message 
          };
        }
      },

      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);