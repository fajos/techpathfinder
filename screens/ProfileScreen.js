// screens/ProfileScreen.js - With Gradients
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useUserProfileStore } from '../store/userProfileStore';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { trackScreen } from '../services/analytics';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { getCurrentProfile, updateProfile, profiles, initProfile, ensureCurrentUser } = useUserProfileStore();
  const { colors, isDark } = useThemeStyles();
  
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    displayName: '',
    experience: 'beginner',
    weeklyHours: 5,
    targetCareer: ''
  });
  
  // Initialize profile for this user if not already set
  useEffect(() => {
    if (user) {
      initProfile(user.uid, user.email);
      ensureCurrentUser(user.uid);
    }
  }, [user]);

  useEffect(() => {
  trackScreen('ProfileScreen');
}, []);
  
  // Load profile data
  const loadProfile = useCallback(() => {
    if (user) {
      setLoading(true);
      const userProfile = getCurrentProfile();
      
      if (userProfile) {
        setProfile(userProfile);
        setFormData({
          displayName: userProfile.displayName || '',
          experience: userProfile.experience || 'beginner',
          weeklyHours: userProfile.weeklyHours || 5,
          targetCareer: userProfile.targetCareer || ''
        });
      } else {
        setProfile({
          displayName: '',
          experience: 'beginner',
          weeklyHours: 5,
          targetCareer: '',
          savedCareers: [],
          quizHistory: [],
          completedRoadmaps: [],
          streak: 0,
          studySessions: []
        });
      }
      setLoading(false);
    }
  }, [user, getCurrentProfile]);
  
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };
  
  const handleSave = () => {
    updateProfile(user.uid, formData);
    setProfile(prev => ({ ...prev, ...formData }));
    setEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };
  
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Please log in to view profile</Text>
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  const safeProfile = profile || {};
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.primary, colors.primary + 'DD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          {editing ? (
            <TextInput
              style={[styles.nameInput, { color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }]}
              value={formData.displayName}
              onChangeText={(text) => setFormData({...formData, displayName: text})}
              placeholder="Enter your name"
              placeholderTextColor="rgba(255,255,255,0.7)"
            />
          ) : (
            <Text style={styles.name}>
              {safeProfile.displayName || 'Learner'}
            </Text>
          )}
          
          <Text style={styles.email}>
            {user.email}
          </Text>
        </View>
      </LinearGradient>
      
      {/* Stats Cards with Gradients */}
      <View style={styles.statsGrid}>
        <LinearGradient
          colors={isDark ? ['#1f2937', '#111827'] : ['#ffffff', '#f9fafb']}
          style={styles.statCard}
        >
          <View style={[styles.statIconBg, { backgroundColor: '#FF6B6B20' }]}>
            <Ionicons name="flame" size={28} color="#FF6B6B" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {safeProfile.streak || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Day Streak
          </Text>
        </LinearGradient>
        
        <LinearGradient
          colors={isDark ? ['#1f2937', '#111827'] : ['#ffffff', '#f9fafb']}
          style={styles.statCard}
        >
          <View style={[styles.statIconBg, { backgroundColor: '#4f46e520' }]}>
            <Ionicons name="book" size={28} color="#4f46e5" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {safeProfile.completedRoadmaps?.length || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Roadmaps
          </Text>
        </LinearGradient>
        
        <LinearGradient
          colors={isDark ? ['#1f2937', '#111827'] : ['#ffffff', '#f9fafb']}
          style={styles.statCard}
        >
          <View style={[styles.statIconBg, { backgroundColor: '#10B98120' }]}>
            <Ionicons name="time" size={28} color="#10B981" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {safeProfile.studySessions?.length || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Study Sessions
          </Text>
        </LinearGradient>
      </View>
      
      {/* Saved Careers */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Saved Careers
        </Text>
        {safeProfile.savedCareers?.length > 0 ? (
          safeProfile.savedCareers.map((career, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.careerItem, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate('ResultTab', { career })}
            >
              <Text style={{ color: colors.text }}>{career}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: colors.textSecondary }}>
            No saved careers yet. Take the quiz to get started!
          </Text>
        )}
      </View>
      
      {/* Quiz History */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Quiz Results
        </Text>
        {safeProfile.quizHistory?.length > 0 ? (
          safeProfile.quizHistory.slice(-3).reverse().map((quiz, index) => (
            <View key={index} style={[styles.historyItem, { backgroundColor: colors.card }]}>
              <Text style={{ color: colors.text, fontWeight: 'bold' }}>
                {new Date(quiz.date).toLocaleDateString()}
              </Text>
              <Text style={{ color: colors.textSecondary }} numberOfLines={1}>
                {quiz.results?.slice(0, 3).join(' • ') || 'No results'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: colors.textSecondary }}>
            No quiz history yet. Take the career quiz to see results!
          </Text>
        )}
      </View>
      
      {/* Edit Profile Button */}
      <TouchableOpacity
        style={[styles.settingsButton, { backgroundColor: colors.card }]}
        onPress={() => setEditing(!editing)}
      >
        <Ionicons name="settings-outline" size={20} color={colors.text} />
        <Text style={{ color: colors.text, marginLeft: 10 }}>
          {editing ? 'Cancel' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
      
      {editing && (
        <LinearGradient
          colors={[colors.primary, colors.primary + 'CC']}
          style={styles.saveButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity onPress={handleSave} style={styles.saveButtonInner}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
      
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.card }]}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={{ color: '#EF4444', marginLeft: 10 }}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    width: '80%',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  careerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyItem: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  saveButton: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonInner: {
    padding: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    margin: 16,
    borderRadius: 12,
  },
  loginButton: {
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});