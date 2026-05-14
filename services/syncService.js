// services/syncService.js
import { db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Silence deprecation warnings (optional)
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

class SyncService {
  constructor() {
    this.syncInProgress = false;
  }

  async canSync(userId, isPremium) {
    if (!isPremium) {
      console.log('⏭️ Skipping sync - not a premium user');
      return false;
    }
    if (!userId) {
      console.log('⏭️ Skipping sync - no user ID');
      return false;
    }
    return true;
  }

  async syncProfileToCloud(userId, profile, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      const userRef = doc(db, 'premium_sync', userId);
      await setDoc(userRef, {
        profile,
        updatedAt: new Date().toISOString(),
        premium: true,
      }, { merge: true });
      
      console.log('✅ Profile synced to cloud');
      return true;
    } catch (error) {
      console.error('Sync error:', error);
      return false;
    }
  }

  async loadProfileFromCloud(userId, isPremium) {
    if (!await this.canSync(userId, isPremium)) return null;

    try {
      const userRef = doc(db, 'premium_sync', userId);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('✅ Profile loaded from cloud');
        return data.profile;
      }
      return null;
    } catch (error) {
      console.error('Load error:', error);
      return null;
    }
  }

  async syncSavedCareers(userId, careers, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      const userRef = doc(db, 'premium_sync', userId);
      await setDoc(userRef, {
        savedCareers: careers,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Sync careers error:', error);
      return false;
    }
  }

  async syncQuizHistory(userId, quizHistory, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      const userRef = doc(db, 'premium_sync', userId);
      await setDoc(userRef, {
        quizHistory,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Sync quiz error:', error);
      return false;
    }
  }

  async syncLearningProgress(userId, progress, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      const userRef = doc(db, 'premium_sync', userId);
      await setDoc(userRef, {
        learningProgress: progress,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Sync progress error:', error);
      return false;
    }
  }

  async syncResumeData(userId, resumes, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      const userRef = doc(db, 'premium_sync', userId);
      await setDoc(userRef, {
        resumes,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Sync resume error:', error);
      return false;
    }
  }

  async fullSyncToCloud(userId, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;
    if (this.syncInProgress) return false;
    
    this.syncInProgress = true;

    try {
      // Get all local data
      const [profileStorage, savedCareers, quizHistory, resumeStorage] = await Promise.all([
        AsyncStorage.getItem('user-profiles-storage'),
        AsyncStorage.getItem('savedCareers'),
        AsyncStorage.getItem('@quiz_history'),
        AsyncStorage.getItem('resume-storage'),
      ]);

      const profile = profileStorage ? JSON.parse(profileStorage) : null;
      
      // Upload to cloud
      const userRef = doc(db, 'premium_sync', userId);
      await setDoc(userRef, {
        profile: profile?.profiles?.[userId] || null,
        savedCareers: savedCareers ? JSON.parse(savedCareers) : [],
        quizHistory: quizHistory ? JSON.parse(quizHistory) : [],
        resumes: resumeStorage ? JSON.parse(resumeStorage) : [],
        lastSync: new Date().toISOString(),
        premium: true,
      }, { merge: true });

      console.log('✅ Full sync completed for premium user');
      return true;
    } catch (error) {
      console.error('Full sync error:', error);
      return false;
    } finally {
      this.syncInProgress = false;
    }
  }

  async loadFromCloudToLocal(userId, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      const userRef = doc(db, 'premium_sync', userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Save to local storage
        if (data.profile) {
          const existingProfile = await AsyncStorage.getItem('user-profiles-storage');
          const profileData = existingProfile ? JSON.parse(existingProfile) : { profiles: {} };
          profileData.profiles[userId] = data.profile;
          profileData.currentUserId = userId;
          await AsyncStorage.setItem('user-profiles-storage', JSON.stringify(profileData));
        }
        
        if (data.savedCareers) {
          await AsyncStorage.setItem('savedCareers', JSON.stringify(data.savedCareers));
        }
        
        if (data.quizHistory) {
          await AsyncStorage.setItem('@quiz_history', JSON.stringify(data.quizHistory));
        }
        
        if (data.resumes) {
          await AsyncStorage.setItem('resume-storage', JSON.stringify(data.resumes));
        }
        
        console.log('✅ Cloud data loaded to local for premium user');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Load from cloud error:', error);
      return false;
    }
  }

  async hasNewerData(userId, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      const userRef = doc(db, 'premium_sync', userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const cloudTime = docSnap.data().lastSync ? new Date(docSnap.data().lastSync) : new Date(0);
        const localTime = await this.getLastLocalSync();
        return cloudTime > localTime;
      }
      return false;
    } catch (error) {
      console.error('Check error:', error);
      return false;
    }
  }

  async getLastLocalSync() {
    try {
      const lastSync = await AsyncStorage.getItem('@last_sync');
      return lastSync ? new Date(lastSync) : new Date(0);
    } catch {
      return new Date(0);
    }
  }

  async setLastLocalSync() {
    await AsyncStorage.setItem('@last_sync', new Date().toISOString());
  }
}

export default new SyncService();