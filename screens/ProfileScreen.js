// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useUserProfileStore } from '../store/userProfileStore';
import { useThemeStyles } from '../hooks/useThemeStyles';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { getCurrentProfile, updateProfile } = useUserProfileStore();
  const { colors } = useThemeStyles();
  
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    if (user) {
      const userProfile = getCurrentProfile();
      setProfile(userProfile);
      setFormData({
        displayName: userProfile?.displayName || '',
        experience: userProfile?.experience || 'beginner',
        weeklyHours: userProfile?.weeklyHours || 5,
        targetCareer: userProfile?.targetCareer || ''
      });
    }
  }, [user]);
  
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Please log in to view profile</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const handleSave = () => {
    updateProfile(user.uid, formData);
    setEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {profile?.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        {editing ? (
          <TextInput
            style={[styles.nameInput, { color: colors.text, borderColor: colors.border }]}
            value={formData.displayName}
            onChangeText={(text) => setFormData({...formData, displayName: text})}
            placeholder="Your name"
            placeholderTextColor={colors.textSecondary}
          />
        ) : (
          <Text style={[styles.name, { color: colors.text }]}>
            {profile?.displayName || 'Learner'}
          </Text>
        )}
        
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {user.email}
        </Text>
      </View>
      
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="flame" size={24} color="#FF6B6B" />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {profile?.streak || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Day Streak
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="book" size={24} color="#4f46e5" />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {profile?.completedRoadmaps?.length || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Roadmaps
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="time" size={24} color="#10B981" />
          <Text style={[styles.statNumber, { color: colors.text }]}>
            {profile?.studySessions?.length || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Study Sessions
          </Text>
        </View>
      </View>
      
      {/* Saved Careers */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Saved Careers
        </Text>
        {profile?.savedCareers?.length > 0 ? (
          profile.savedCareers.map((career, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.careerItem, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate('CareerExplorer', { career })}
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
        {profile?.quizHistory?.slice(-3).reverse().map((quiz, index) => (
          <View key={index} style={[styles.historyItem, { backgroundColor: colors.card }]}>
            <Text style={{ color: colors.text, fontWeight: 'bold' }}>
              {new Date(quiz.date).toLocaleDateString()}
            </Text>
            <Text style={{ color: colors.textSecondary }} numberOfLines={1}>
              {quiz.results.slice(0, 3).join(' • ')}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Settings Button */}
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
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  nameInput: {
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    width: '80%',
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  statCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    width: '30%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    padding: 16,
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
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  saveButton: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  loginButton: {
    backgroundColor: '#4f46e5',
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