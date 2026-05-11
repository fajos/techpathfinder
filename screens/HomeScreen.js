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
import { useTranslation } from "react-i18next";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { LoadingOverlay } from '../components/LoadingOverlay';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useThemeStyles();
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

    const handleNavigation = (screen, params = {}) => {
    setLoading(true);
    // Small delay to show loading (optional, makes it feel smoother)
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

  return (
    <LinearGradient colors={["#e0f2fe", "#f0f9ff"]} style={styles.gradient}>
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

        <Text style={styles.title}>{t("appTitle")}</Text>
        <Text style={styles.subtitle}>{t("appSubtitle")}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Questionnaire")}
        >
          <Text style={styles.buttonText}>{t("startQuiz")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#9333ea" }]}
          onPress={() => handleNavigation('CareerExplorer')}
        >
          <Text style={styles.buttonText}>🔎{t("careerExplore")}</Text>
        </TouchableOpacity>
      </Animated.View>
      <LoadingOverlay visible={loading} message="Loading careers..." />
        
      <View style={styles.bottomInfo}>
        <Text style={styles.versionText}>
          {t("version")} 1.0.0
        </Text>
        <Text style={styles.poweredText}>
          {t("builtWith")} FajosTech 💡
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e3a8a",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 16,
    minWidth: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  bottomInfo: {
    alignItems: "center",
    paddingBottom: 10,
  },
  versionText: {
    color: "#374151",
    fontSize: 13,
    marginBottom: 2,
  },
  poweredText: {
    color: "#374151",
    fontSize: 13,
  },
});