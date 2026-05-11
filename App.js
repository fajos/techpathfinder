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
  
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Result" component={ResultScreen} options={{headerShown: true, title: 'Result', headerBackTitle: 'Back'}} />
          <Stack.Screen name="DashboardLock" component={DashboardLockScreen} options={{headerShown: true, title: 'Dashboard Lock', headerBackTitle: 'Back'}} />
          <Stack.Screen name="DashboardReal" component={DashboardScreen} options={{headerShown: true, title: 'Dashboard', headerBackTitle: 'Back'}} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="ChangePasscode" component={ChangePasscodeScreen} />
          <Stack.Screen name="CareerExplorer" component={CareerExplorerScreen} options={{headerShown: true, title: 'Career Explorer', headerBackTitle: 'Back'}} />
          <Stack.Screen name="ProjectIdeas" component={ProjectIdeasScreen} />
          <Stack.Screen name="MockInterview" component={MockInterviewScreen} />
          <Stack.Screen name="SavedResumes" component={SavedResumesScreen} options={{headerShown: true, title: 'Saved Resumes', headerBackTitle: 'Back'}} />
          <Stack.Screen name="Premium" component={PremiumScreen} options={{headerShown: true, title: 'Premium', headerBackTitle: 'Back'}} />
          <Stack.Screen name="ResumeBuilder" component={ResumeBuilderScreen} options={{headerShown: true, title: 'Resume Builder', headerBackTitle: 'Back'}} />
          <Stack.Screen name="SkillGap" component={SkillGapScreen} options={{headerShown: true, title: 'Skill Gap', headerBackTitle: 'Back'}}  />
          <Stack.Screen name="LearningPlan" component={LearningPlanScreen} options={{headerShown: true, title: 'Learning Plan', headerBackTitle: 'Back'}} 
/>
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#4f46e5",
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
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}