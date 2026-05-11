// store/authStore.ts
import { create } from 'zustand';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  initialized: boolean;
  
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      initialized: false,

      setUser: (user) => set({ user }),

      initialize: () => {
        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          set({ 
            user, 
            isLoading: false,
            initialized: true 
          });
          console.log('Auth state changed:', user?.uid || 'No user');
        });

        // Return unsubscribe function for cleanup
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
        } catch (error: any) {
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
        } catch (error: any) {
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
      partialize: (state) => ({ user: state.user }), // Only persist user
    }
  )
);