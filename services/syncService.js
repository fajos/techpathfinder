// services/syncService.js
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SyncService {
  constructor() {
    this.syncInProgress = false;
  }

  // Check if user is premium before syncing
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

  // Save user profile to cloud (premium only)
  async syncProfileToCloud(userId, profile, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      await firestore()
        .collection('premium_sync')
        .doc(userId)
        .set({
          profile,
          updatedAt: firestore.FieldValue.serverTimestamp(),
          premium: true,
        }, { merge: true });
      
      console.log('✅ Profile synced to cloud');
      return true;
    } catch (error) {
      console.error('Sync error:', error);
      return false;
    }
  }

  // Load profile from cloud (premium only)
  async loadProfileFromCloud(userId, isPremium) {
    if (!await this.canSync(userId, isPremium)) return null;

    try {
      const doc = await firestore()
        .collection('premium_sync')
        .doc(userId)
        .get();
      
      if (doc.exists) {
        const data = doc.data();
        console.log('✅ Profile loaded from cloud');
        return data.profile;
      }
      return null;
    } catch (error) {
      console.error('Load error:', error);
      return null;
    }
  }

  // Sync saved careers (premium only)
  async syncSavedCareers(userId, careers, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      await firestore()
        .collection('premium_sync')
        .doc(userId)
        .set({
          savedCareers: careers,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Sync careers error:', error);
      return false;
    }
  }

  // Sync quiz history (premium only)
  async syncQuizHistory(userId, quizHistory, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      await firestore()
        .collection('premium_sync')
        .doc(userId)
        .set({
          quizHistory,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Sync quiz error:', error);
      return false;
    }
  }

  // Sync learning progress (premium only)
  async syncLearningProgress(userId, progress, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      await firestore()
        .collection('premium_sync')
        .doc(userId)
        .set({
          learningProgress: progress,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Sync progress error:', error);
      return false;
    }
  }

  // Sync resume data (premium only)
  async syncResumeData(userId, resumes, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      await firestore()
        .collection('premium_sync')
        .doc(userId)
        .set({
          resumes,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Sync resume error:', error);
      return false;
    }
  }

  // Full sync (upload all local data to cloud) - premium only
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
      const currentUserId = profile?.currentUserId || userId;

      // Upload to cloud
      await firestore()
        .collection('premium_sync')
        .doc(userId)
        .set({
          userId: currentUserId,
          profile: profile?.profiles?.[userId] || null,
          savedCareers: savedCareers ? JSON.parse(savedCareers) : [],
          quizHistory: quizHistory ? JSON.parse(quizHistory) : [],
          resumes: resumeStorage ? JSON.parse(resumeStorage) : [],
          lastSync: firestore.FieldValue.serverTimestamp(),
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

  // Load all data from cloud to local (premium only)
  async loadFromCloudToLocal(userId, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      const doc = await firestore()
        .collection('premium_sync')
        .doc(userId)
        .get();

      if (doc.exists) {
        const data = doc.data();
        
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

  // Check if cloud has newer data (premium only)
  async hasNewerData(userId, isPremium) {
    if (!await this.canSync(userId, isPremium)) return false;

    try {
      const doc = await firestore()
        .collection('premium_sync')
        .doc(userId)
        .get();

      if (doc.exists) {
        const cloudTime = doc.data().lastSync?.toDate() || new Date(0);
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