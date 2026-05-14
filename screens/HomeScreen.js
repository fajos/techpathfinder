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
import { trackScreen } from '../services/analytics';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark, wp, hp, normalize, isTablet } = useThemeStyles();
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Responsive values
  const logoSize = isTablet ? normalize(150) : normalize(110);
  const titleSize = isTablet ? normalize(36) : normalize(28);
  const subtitleSize = isTablet ? normalize(20) : normalize(16);

  const handleNavigation = (screen, params = {}) => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate(screen, params);
      setLoading(false);
    }, 100);
  };

  useEffect(() => {
    trackScreen('HomeScreen');
  }, []);

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
    <LinearGradient colors={gradientColors} style={[styles.gradient, { paddingVertical: hp(5), paddingHorizontal: wp(5) }]}>
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Image
          source={require("../assets/splash/splash.png")}
          style={[styles.logo, { width: logoSize, height: logoSize, borderRadius: logoSize / 2 }]}
        />

        <Text style={[styles.title, { color: isDark ? '#e2e8f0' : '#1e3a8a', fontSize: titleSize }]}>
          Tech Career Pathfinder
        </Text>
        
        <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#374151', fontSize: subtitleSize }]}>
          Find your perfect tech career and build your future
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary, width: isTablet ? wp(50) : wp(80) }]}
          onPress={() => navigation.navigate("Questionnaire")}
        >
          <Text style={[styles.buttonText, { fontSize: normalize(16) }]}>🚀 Start Career Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#9333ea', width: isTablet ? wp(50) : wp(80) }]}
          onPress={() => handleNavigation('CareerExplorer')}
        >
          <Text style={[styles.buttonText, { fontSize: normalize(16) }]}>🔎 Explore Careers</Text>
        </TouchableOpacity>
      </Animated.View>
      <LoadingOverlay visible={loading} message="Loading careers..." />
        
      <View style={styles.bottomInfo}>
        <Text style={[styles.versionText, { color: isDark ? '#94a3b8' : '#374151', fontSize: normalize(12) }]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.poweredText, { color: isDark ? '#94a3b8' : '#374151', fontSize: normalize(12) }]}>
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
  },
  container: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
  logo: {
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bottomInfo: {
    alignItems: "center",
    paddingBottom: 10,
  },
  versionText: {
    marginBottom: 2,
  },
  poweredText: {
  },
});