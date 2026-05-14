// App.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppState, View, Text, ActivityIndicator } from "react-native";

// Providers
import { ThemeProvider } from "./utils/ThemeContext";
import { AuthProvider, useAuth } from './context/AuthContext';
import { PremiumProvider } from './context/PremiumContext';
import { useUserProfileStore } from './store/userProfileStore';
import { initAnalytics, identifyUser, resetAnalytics } from './services/analytics';
import syncService from './services/syncService';
import { usePremium } from './context/PremiumContext';
import { setPremiumSyncStatus } from './store/userProfileStore';

// Screens
import HomeScreen from "./screens/HomeScreen";
import QuestionnaireScreen from "./screens/QuestionnaireScreen";
import ResultScreen from "./screens/ResultScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ResultTabScreen from "./screens/ResultTabScreen";
import DashboardLockScreen from "./screens/DashboardLockScreen";
import SplashScreen from "./screens/SplashScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AboutScreen from "./screens/AboutScreen";
import ChangePasscodeScreen from "./screens/ChangePasscodeScreen";
import CareerExplorerScreen from "./screens/CareerExplorerScreen";
import PremiumScreen from "./screens/PremiumScreen";
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from "./screens/ProfileScreen";
import LearningPlanScreen from "./screens/LearningPlanScreen";
import SkillGapScreen from "./screens/SkillGapScreen";
import ResumeBuilderScreen from "./screens/ResumeBuilderScreen";
import SavedResumesScreen from "./screens/SavedResumesScreen";
import ProjectIdeasScreen from "./screens/ProjectIdeasScreen";
import MockInterviewScreen from "./screens/MockInterviewScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ============================================
// RootNavigator - Has access to useAuth
// ============================================
const RootNavigator = () => {
  const { user, initialized } = useAuth();
  const { colors, isDark } = useThemeStyles(); // Add this
  const { updateLastActive } = useUserProfileStore();
  const { isPremium } = usePremium();

  // Theme-aware header options
  const headerOptions = {
    headerStyle: {
      backgroundColor: colors.card,
      shadowColor: isDark ? '#000' : '#e5e7eb',
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTitleStyle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '600',
    },
    headerTintColor: colors.primary,
    headerBackTitleStyle: {
      color: colors.textSecondary,
    },
    headerShadowVisible: false,
  };

  // Track app state for streak updates
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && user) {
        updateLastActive(user.uid);
      }
    });
    return () => subscription.remove();
  }, [user, updateLastActive]);

  // Analytics - Identify user
  useEffect(() => {
    if (user) {
      identifyUser(user.uid, { email: user.email });
    } else {
      resetAnalytics();
    }
  }, [user]);

      useEffect(() => {
    if (user) {
      setPremiumSyncStatus(isPremium, user.uid);
      
      // Load cloud data when user becomes premium
      if (isPremium) {
        const loadData = async () => {
          const hasCloudData = await syncService.loadFromCloudToLocal(user.uid, true);
          if (!hasCloudData) {
            // First time premium user - upload local data
            await syncService.fullSyncToCloud(user.uid, true);
          }
        };
        loadData();
      }
    } else {
      setPremiumSyncStatus(false, null);
    }
  }, [user, isPremium]);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={headerOptions}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Your Results' }} />
          <Stack.Screen name="DashboardLock" component={DashboardLockScreen} options={{ title: 'Dashboard Lock' }} />
          <Stack.Screen name="DashboardReal" component={DashboardScreen} options={{ title: 'Dashboard' }} />
          <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
          <Stack.Screen name="ChangePasscode" component={ChangePasscodeScreen} options={{ title: 'Change Passcode' }} />
          <Stack.Screen name="CareerExplorer" component={CareerExplorerScreen} options={{ title: 'Career Explorer' }} />
          <Stack.Screen name="ProjectIdeas" component={ProjectIdeasScreen} options={{ title: 'Project Ideas' }} />
          <Stack.Screen name="MockInterview" component={MockInterviewScreen} options={{ title: 'Mock Interview' }} />
          <Stack.Screen name="SavedResumes" component={SavedResumesScreen} options={{ title: 'Saved Resumes' }} />
          <Stack.Screen name="Premium" component={PremiumScreen} options={{ title: 'Premium' }} />
          <Stack.Screen name="ResumeBuilder" component={ResumeBuilderScreen} options={{ title: 'Resume Builder' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="SkillGap" component={SkillGapScreen} options={{ title: 'Skill Gap' }} />
          <Stack.Screen name="LearningPlan" component={LearningPlanScreen} options={{ title: 'Learning Plan' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

// ============================================
// MainTabs Component
// ============================================
const DashboardPlaceholder = () => null;

function MainTabs() {
  const { colors, isDark } = useThemeStyles();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderTopColor: isDark ? '#374151' : '#e5e7eb',
          borderTopWidth: 1,
        },
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Questionnaire":
              iconName = focused ? "help-circle" : "help-circle-outline";
              break;
            case "Dashboard":
              iconName = focused ? "grid" : "grid-outline";
              break;
            case "Last Results":
              iconName = focused ? "trophy" : "trophy-outline";
              break;
            case "Settings":
              iconName = focused ? "settings" : "settings-outline";
              break;
            default:
              iconName = "help-outline";
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Questionnaire" component={QuestionnaireScreen} />
      <Tab.Screen
        name="Dashboard"
        component={DashboardPlaceholder}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("DashboardLock");
          },
        })}
      />
      <Tab.Screen name="Last Results" component={ResultTabScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// ============================================
// AppWrapper - Contains Providers
// ============================================
const AppWrapper = () => {
  // Initialize analytics on app start
  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
  initAnalytics();
}, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PremiumProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </PremiumProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default AppWrapper;

// Import useThemeStyles at the bottom to avoid circular dependency
import { useThemeStyles } from './hooks/useThemeStyles';