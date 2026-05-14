// screens/SettingsScreen.js
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { usePremium } from '../context/PremiumContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { ThemeContext } from '../utils/ThemeContext';
import { trackScreen } from '../services/analytics';

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { isPremium } = usePremium();
  const { colors, wp, hp, normalize, isTablet } = useThemeStyles();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  
  const [notifications, setNotifications] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState(5);

  useEffect(() => {
  trackScreen('SettingsScreen');
}, []);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            
          }
        }
      ]
    );
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will erase all your saved careers, progress, and preferences. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Success', 'All data has been cleared');
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightElement, destructive }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, {
          backgroundColor: destructive ? '#EF444420' : colors.primary + '20',
          width: normalize(42),
          height: normalize(42),
          borderRadius: normalize(12),
          marginRight: wp(4),
        }]}>
          <Ionicons name={icon} size={normalize(22)} color={destructive ? '#EF4444' : colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: destructive ? '#EF4444' : colors.text, fontSize: normalize(16) }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary, fontSize: normalize(13) }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement || (onPress && <Ionicons name="chevron-forward" size={normalize(20)} color={colors.textSecondary} />)}
    </TouchableOpacity>
  );

  const SwitchItem = ({ icon, title, subtitle, value, onValueChange }) => (
    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, {
          backgroundColor: colors.primary + '20',
          width: normalize(42),
          height: normalize(42),
          borderRadius: normalize(12),
          marginRight: wp(4),
        }]}>
          <Ionicons name={icon} size={normalize(22)} color={colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text, fontSize: normalize(16) }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary, fontSize: normalize(13) }]}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  const StatsItem = ({ icon, title, value, color }) => (
    <View style={[styles.statsItem, { backgroundColor: colors.card, paddingVertical: hp(2), borderRadius: normalize(16) }]}>
      <View style={[styles.statsIcon, {
        backgroundColor: color + '20',
        width: normalize(44),
        height: normalize(44),
        borderRadius: normalize(22),
        marginBottom: hp(1),
      }]}>
        <Ionicons name={icon} size={normalize(24)} color={color} />
      </View>
      <Text style={[styles.statsValue, { color: colors.text, fontSize: normalize(20) }]}>{value}</Text>
      <Text style={[styles.statsLabel, { color: colors.textSecondary, fontSize: normalize(11) }]}>{title}</Text>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={isTablet ? { alignSelf: 'center', width: wp(80) } : null}
    >
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: wp(5), paddingTop: hp(5), paddingBottom: hp(2) }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: normalize(32) }]}>Settings</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontSize: normalize(14) }]}>
          Customize your experience
        </Text>
      </View>

      {/* Preferences Section */}
      <View style={[styles.section, { paddingHorizontal: wp(5), marginBottom: hp(3) }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(16), marginBottom: hp(1.5) }]}>Preferences</Text>
        <SwitchItem
          icon="moon-outline"
          title="Dark Mode"
          subtitle="Switch between light and dark theme"
          value={isDark}
          onValueChange={toggleTheme}
        />
        <SwitchItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Get weekly progress reminders"
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>

      {/* Premium Section */}
      <View style={[styles.section, { paddingHorizontal: wp(5), marginBottom: hp(3) }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(16), marginBottom: hp(1.5) }]}>Premium</Text>
        <SettingItem
          icon="diamond-outline"
          title={isPremium ? "Premium Active" : "Upgrade to Premium"}
          subtitle={isPremium ? "You have full access to all features" : "Unlock learning plans, projects, interviews & more"}
          onPress={() => navigation.navigate('Premium')}
          rightElement={
            isPremium ? (
              <View style={[styles.premiumBadge, { paddingHorizontal: wp(2.5), paddingVertical: hp(0.5), borderRadius: normalize(12) }]}>
                <Text style={[styles.premiumBadgeText, { fontSize: normalize(10) }]}>ACTIVE</Text>
              </View>
            ) : null
          }
        />
      </View>

      {/* Account Section */}
      {user && (
        <View style={[styles.section, { paddingHorizontal: wp(5), marginBottom: hp(3) }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(16), marginBottom: hp(1.5) }]}>Account</Text>
          <SettingItem
            icon="person-outline"
            title="Edit Profile"
            subtitle={user.email}
            onPress={() => navigation.navigate('Profile')}
          />
          <SettingItem
            icon="log-out-outline"
            title="Log Out"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            destructive
          />
        </View>
      )}

      {/* Data Section */}
      <View style={[styles.section, { paddingHorizontal: wp(5), marginBottom: hp(3) }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(16), marginBottom: hp(1.5) }]}>Data</Text>
        <SettingItem
          icon="trash-outline"
          title="Clear All Data"
          subtitle="Erase all saved careers and progress"
          onPress={clearAllData}
          destructive
        />
      </View>

      {/* About Section */}
      <View style={[styles.section, { paddingHorizontal: wp(5), marginBottom: hp(3) }]}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(16), marginBottom: hp(1.5) }]}>About</Text>
        <SettingItem
          icon="information-circle-outline"
          title="About TechPathFinder"
          subtitle="Version 1.0.0"
          onPress={() => navigation.navigate('About')}
        />
        <SettingItem
          icon="star-outline"
          title="Rate Us"
          subtitle="Love the app? Leave a review"
          onPress={() => Alert.alert('Rate Us', 'Feature coming soon!')}
        />
        <SettingItem
          icon="share-social-outline"
          title="Share App"
          subtitle="Share with friends and colleagues"
          onPress={() => Alert.alert('Share', 'Feature coming soon!')}
        />
      </View>

      {/* Copyright */}
      <Text style={[styles.copyright, { color: colors.textSecondary, fontSize: normalize(12), marginVertical: hp(3), marginBottom: hp(5) }]}>
        © 2026 TechPathFinder. All rights reserved.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  statsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  premiumBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 24,
    marginBottom: 40,
  },
});