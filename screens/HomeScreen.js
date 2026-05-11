// screens/HomeScreen.js
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { LoadingOverlay } from '../components/LoadingOverlay';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useThemeStyles();
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const handleNavigation = (screen, params = {}) => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate(screen, params);
      setLoading(false);
    }, 100);
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Theme-based gradient colors
  const gradientColors = isDark
    ? ['#0f172a', '#1e1b4b']  // Dark mode: deep slate to deep purple
    : ['#e0f2fe', '#f0f9ff']; // Light mode: light blue to very light blue

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Image
          source={require("../assets/splash/splash.png")}
          style={styles.logo}
        />

        <Text style={[styles.title, { color: isDark ? '#e2e8f0' : '#1e3a8a' }]}>
          Tech Career Pathfinder
        </Text>
        
        <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#374151' }]}>
          Find your perfect tech career and build your future
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("Questionnaire")}
        >
          <Text style={styles.buttonText}>🚀 Start Career Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#9333ea' }]}
          onPress={() => handleNavigation('CareerExplorer')}
        >
          <Text style={styles.buttonText}>🔎 Explore Careers</Text>
        </TouchableOpacity>
      </Animated.View>
      <LoadingOverlay visible={loading} message="Loading careers..." />
        
      <View style={styles.bottomInfo}>
        <Text style={[styles.versionText, { color: isDark ? '#94a3b8' : '#374151' }]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.poweredText, { color: isDark ? '#94a3b8' : '#374151' }]}>
          Built by FajosTech
        </Text>
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  container: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
  logo: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    borderRadius: 55,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    minWidth: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomInfo: {
    alignItems: "center",
    paddingBottom: 10,
  },
  versionText: {
    fontSize: 12,
    marginBottom: 2,
  },
  poweredText: {
    fontSize: 12,
  },
});