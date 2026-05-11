import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nextProvider } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, ActivityIndicator } from "react-native";
import i18n, { initializeI18n } from "./i18n";

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
import { ThemeProvider } from "./utils/ThemeContext";
import { LanguageProvider } from "./utils/LanguageContext";
import CareerExplorerScreen from "./screens/CareerExplorerScreen";
import { PremiumProvider } from './context/PremiumContext';
import PremiumScreen from "./screens/PremiumScreen";
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from "./screens/ProfileScreen";
import LearningPlanScreen from "./screens/LearningPlanScreen";
import SkillGapScreen from "./screens/SkillGapScreen";
import ResumeBuilderScreen from "./screens/ResumeBuilderScreen";
import SavedResumesScreen from "./screens/SavedResumesScreen";
import ProjectIdeasScreen from "./screens/ProjectIdeasScreen";
import MockInterviewScreen from "./screens/MockInterviewScreen";
import { useThemeStyles } from './hooks/useThemeStyles';
import { ThemeContext } from './utils/ThemeContext';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppWrapper = () => {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

    useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeI18n();
        const lang = await AsyncStorage.getItem("appLanguage");
        if (lang) {
          await i18n.changeLanguage(lang);
        }
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setIsI18nInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!isI18nInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <ThemeProvider>
             <AuthProvider>
            <PremiumProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
            </PremiumProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
};

export default AppWrapper;

const RootNavigator = () => {
  const { user, initialized } = useAuth();
  const { colors, isDark } = useThemeStyles();

  const screenOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: colors.card,
    shadowColor: isDark ? '#000' : '#e5e7eb',
    elevation: 0,
  },
  headerTitleStyle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  headerTintColor: colors.primary, // This controls the back button color
  headerBackTitleStyle: {
    color: colors.textSecondary,
  },
  headerShadowVisible: false,
};
  
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }
  
return (
  <Stack.Navigator screenOptions={screenOptions}>
    {!user ? (
      <Stack.Screen name="Login" component={LoginScreen} />
    ) : (
      <>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Result' }} />
        <Stack.Screen name="DashboardLock" component={DashboardLockScreen} options={{ title: 'Dashboard Lock' }} />
        <Stack.Screen name="DashboardReal" component={DashboardScreen} options={{ title: 'Dashboard' }} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="ChangePasscode" component={ChangePasscodeScreen} />
        <Stack.Screen name="CareerExplorer" component={CareerExplorerScreen} options={{ title: 'Career Explorer' }} />
        <Stack.Screen name="ProjectIdeas" component={ProjectIdeasScreen} options={{ title: 'Projects' }} />
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

const DashboardPlaceholder = () => {
  useEffect(() => {
  }, []);
  
  return null;
};

function MainTabs() {
  const { colors, isDark } = useThemeStyles();
  
  // Define tab bar styles based on theme
  const tabBarStyle = {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderTopColor: isDark ? '#374151' : '#e5e7eb',
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: isDark ? '#000000' : '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    marginBottom: 8,
  };

  const activeTintColor = colors.primary; // #4f46e5
  const inactiveTintColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: tabBarStyle,
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Questionnaire":
              iconName = "help-circle-outline";
              break;
            case "Dashboard":
              iconName = "grid-outline";
              break;
            case "Last Results":
              iconName = "trophy-outline";
              break;
            case "Settings":
              iconName = "settings-outline";
              break;
            default:
              iconName = "help-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
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