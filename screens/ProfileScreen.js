// screens/ProfileScreen.js - Updated version
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
  const { getCurrentProfile, updateProfile, initProfile, ensureCurrentUser } = useUserProfileStore();
  const { colors, isDark, wp, hp, normalize, isTablet } = useThemeStyles();
  
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

  // Track screen view
  useEffect(() => {
    trackScreen('ProfileScreen');
  }, []);
  
  // Load profile data - make this a standalone function
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
  
  // ✅ Use useFocusEffect to reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadProfile();
      }
    }, [user, loadProfile])
  );
  
  // Also reload when user changes
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);
  
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
      contentContainerStyle={[
        isTablet ? { alignSelf: 'center', width: wp(85) } : null
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.primary, colors.primary + 'DD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: hp(6), paddingBottom: hp(4) }]}
      >
        <View style={styles.headerContent}>
          {editing ? (
            <TextInput
              style={[styles.nameInput, { color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontSize: normalize(24), padding: normalize(12) }]}
              value={formData.displayName}
              onChangeText={(text) => setFormData({...formData, displayName: text})}
              placeholder="Enter your name"
              placeholderTextColor="rgba(255,255,255,0.7)"
            />
          ) : (
            <Text style={[styles.name, { fontSize: normalize(28) }]}>
              {safeProfile.displayName || 'Learner'}
            </Text>
          )}
          
          <Text style={[styles.email, { fontSize: normalize(14) }]}>
            {user.email}
          </Text>
        </View>
      </LinearGradient>
      
      {/* Stats Grid */}
      <View style={[styles.statsGrid, { paddingHorizontal: wp(4), marginTop: -hp(2.5), marginBottom: hp(2) }]}>
        <LinearGradient
          colors={isDark ? ['#1f2937', '#111827'] : ['#ffffff', '#f9fafb']}
          style={[styles.statCard, { paddingVertical: hp(1.5) }]}
        >
          <View style={[styles.statIconBg, { backgroundColor: '#FF6B6B20', width: normalize(44), height: normalize(44), borderRadius: normalize(22) }]}>
            <Ionicons name="flame" size={normalize(28)} color="#FF6B6B" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text, fontSize: normalize(22) }]}>
            {safeProfile.streak || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: normalize(11) }]}>
            Day Streak
          </Text>
        </LinearGradient>
        
        <LinearGradient
          colors={isDark ? ['#1f2937', '#111827'] : ['#ffffff', '#f9fafb']}
          style={[styles.statCard, { paddingVertical: hp(1.5) }]}
        >
          <View style={[styles.statIconBg, { backgroundColor: '#4f46e520', width: normalize(44), height: normalize(44), borderRadius: normalize(22) }]}>
            <Ionicons name="book" size={normalize(28)} color="#4f46e5" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text, fontSize: normalize(22) }]}>
            {safeProfile.completedRoadmaps?.length || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: normalize(11) }]}>
            Roadmaps
          </Text>
        </LinearGradient>
        
        <LinearGradient
          colors={isDark ? ['#1f2937', '#111827'] : ['#ffffff', '#f9fafb']}
          style={[styles.statCard, { paddingVertical: hp(1.5) }]}
        >
          <View style={[styles.statIconBg, { backgroundColor: '#10B98120', width: normalize(44), height: normalize(44), borderRadius: normalize(22) }]}>
            <Ionicons name="time" size={normalize(28)} color="#10B981" />
          </View>
          <Text style={[styles.statNumber, { color: colors.text, fontSize: normalize(22) }]}>
            {safeProfile.studySessions?.length || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: normalize(11) }]}>
            Study Sessions
          </Text>
        </LinearGradient>
      </View>
      
      {/* Saved Careers */}
      <View style={[styles.section, { paddingHorizontal: wp(4) }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(18) }]}>
            Saved Careers
          </Text>
          <Text style={[styles.sectionCount, { color: colors.primary, fontSize: normalize(18) }]}>
            {safeProfile.savedCareers?.length || 0}
          </Text>
        </View>
        {safeProfile.savedCareers?.length > 0 ? (
          safeProfile.savedCareers.map((career, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.careerItem, { backgroundColor: colors.card, padding: normalize(14) }]}
              onPress={() => navigation.navigate('ResultTab', { career })}
            >
              <Text style={{ color: colors.text, fontSize: normalize(14) }}>{career}</Text>
              <Ionicons name="chevron-forward" size={normalize(20)} color={colors.textSecondary} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: colors.textSecondary, fontSize: normalize(14) }}>
            No saved careers yet. Take the quiz to get started!
          </Text>
        )}
      </View>
      
      {/* Quiz History */}
      <View style={[styles.section, { paddingHorizontal: wp(4) }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(18) }]}>
          Recent Quiz Results
        </Text>
        {safeProfile.quizHistory?.length > 0 ? (
          safeProfile.quizHistory.slice(-3).reverse().map((quiz, index) => (
            <View key={index} style={[styles.historyItem, { backgroundColor: colors.card, padding: normalize(14) }]}>
              <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: normalize(14) }}>
                {new Date(quiz.date).toLocaleDateString()}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: normalize(14) }} numberOfLines={1}>
                {quiz.results?.slice(0, 3).join(' • ') || 'No results'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: colors.textSecondary, fontSize: normalize(14) }}>
            No quiz history yet. Take the career quiz to see results!
          </Text>
        )}
      </View>
      
      {/* Edit Profile Button */}
      <TouchableOpacity
        style={[styles.settingsButton, { backgroundColor: colors.card, padding: normalize(14), marginHorizontal: wp(4) }]}
        onPress={() => setEditing(!editing)}
      >
        <Ionicons name="settings-outline" size={normalize(20)} color={colors.text} />
        <Text style={{ color: colors.text, marginLeft: normalize(10), fontSize: normalize(14) }}>
          {editing ? 'Cancel' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
      
      {editing && (
        <LinearGradient
          colors={[colors.primary, colors.primary + 'CC']}
          style={[styles.saveButton, { marginHorizontal: wp(4) }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity onPress={handleSave} style={[styles.saveButtonInner, { padding: normalize(14) }]}>
            <Text style={[styles.saveButtonText, { fontSize: normalize(16) }]}>Save Changes</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
      
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.card, padding: normalize(14), margin: wp(4) }]}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={normalize(20)} color="#EF4444" />
        <Text style={{ color: '#EF4444', marginLeft: normalize(10), fontSize: normalize(14) }}>Log Out</Text>
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
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  name: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  nameInput: {
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 12,
    width: '80%',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    color: 'rgba(255,255,255,0.8)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontWeight: 'bold',
  },
  statLabel: {
    marginTop: 4,
  },
  section: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  sectionCount: {
    fontWeight: 'bold',
  },
  careerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 8,
  },
  historyItem: {
    borderRadius: 12,
    marginBottom: 8,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderRadius: 12,
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonInner: {
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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