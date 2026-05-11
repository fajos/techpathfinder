import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  ToastAndroid,
  ScrollView,
  StyleSheet,
  Linking,
  Animated,
  Share,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mapAnswersToCareers from "../utils/mapAnswersToCareers";
import careerRoadmapsFull from "../data/careerRoadmapsFull";
import careerEmojis from "../data/careerEmojis";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { ThemeContext } from "../utils/ThemeContext";
import Confetti from 'react-native-confetti';
import useNetworkStatus from "../hooks/useNetworkStatus";
import OfflineBanner from "../components/OfflineBanner";
import NetworkBanner from "../components/NetworkBanner";
import CareerModal from "../components/CareerModal";
import { useTranslation } from "react-i18next";
import ThreeDButton from "../components/ThreeDButton";
import { usePremium } from '../context/PremiumContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useUserProfileStore } from '../store/userProfileStore';

const ResultScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { answers } = route.params || {};
  const { isDark } = useContext(ThemeContext);
  const isConnected = useNetworkStatus();
  const { colors } = useThemeStyles();
  const { t } = useTranslation();

  const careerTitles = mapAnswersToCareers(answers);
  const fullResults = careerTitles
    .map((title) => careerRoadmapsFull[title] && { title, ...careerRoadmapsFull[title] })
    .filter(Boolean);

  const { user } = useAuth();
  const { addQuizResult, saveCareer } = useUserProfileStore()

  const hasSavedRef = useRef(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [saved, setSaved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [savedTitles, setSavedTitles] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { isPremium } = usePremium();

  const openModal = (career) => {
    setSelectedCareer(career);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedCareer(null);
    setModalVisible(false);
  };

  useEffect(() => {
  // Only save once when results are loaded and user exists
  if (user && fullResults.length > 0 && !hasSavedRef.current) {
    hasSavedRef.current = true;
    
    // Save quiz results to history
    addQuizResult(user.uid, {
      answers,
      results: fullResults.map(c => c.title),
      date: new Date().toISOString()
    });
    
    // Auto-save top career
    if (fullResults[0]) {
      saveCareer(user.uid, fullResults[0].title);
    }
  }
}, [user, fullResults, answers, addQuizResult, saveCareer]);

  useEffect(() => {
    const fetchSaved = async () => {
      const existing = JSON.parse(await AsyncStorage.getItem("savedCareers") || "[]");
      setSavedTitles(existing);
    };
    fetchSaved();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const storeLatestResult = async () => {
      if (fullResults.length > 0) {
        await AsyncStorage.setItem("lastCareerResult", JSON.stringify(fullResults));
      }
    };
    storeLatestResult();
  }, [fullResults]);

  const handleSaveSingle = async (title) => {
    const updated = [...new Set([...savedTitles, title])];
    await AsyncStorage.setItem("savedCareers", JSON.stringify(updated));
    setSavedTitles(updated);
  };

  const handleShare = async () => {
    try {
      const top = fullResults[0];
      const title = top?.title || t("result.defaultCareer");
      const emoji = careerEmojis[title] || "💻";
      await Share.share({
        message: t("result.shareMessage", { emoji, title }),
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!answers) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>{t("result.noAnswers")}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Questionnaire")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{t("result.takeQuiz")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {showConfetti && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 999 }} pointerEvents="none">
          <Confetti
            count={150}
            origin={{ x: 200, y: -10 }}
            autoStart
            fadeOut
            fallSpeed={3000}
          />
        </View>
      )}

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <NetworkBanner isConnected={isConnected} />
        {!isConnected && <OfflineBanner />}

        <Text style={[styles.title, { color: colors.text }]}>
          🎯 {t("result.title")}
        </Text>

        {showConfetti && (
          <Text style={{ fontSize: 26, textAlign: "center", marginBottom: 12 }}>
            {t("result.congrats")}
          </Text>
        )}

        {fullResults.map((career) => {
          const isSaved = savedTitles.includes(career.title);
          return (
            <TouchableOpacity
              key={career.title}
              onPress={() => openModal(career)}
              activeOpacity={0.9}
            >
              <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Image
                  source={require("../assets/splash/splash.png")}
                  style={{
                    position: "absolute",
                    width: 70,
                    height: 70,
                    opacity: 0.25,
                    borderRadius: 35,
                    top: 0,
                    right: 10,
                    zIndex: -1,
                  }}
                />

                <Animated.View style={{ opacity: fadeAnim }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <View style={{
                      backgroundColor: "#e0e7ff",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      flexDirection: "row",
                      alignItems: "center",
                    }}>
                      <Text style={{ fontSize: 18 }}>{careerEmojis[career.title] || "💼"}</Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 8, color: "#1e3a8a" }}>
                        {career.title}
                      </Text>
                    </View>
                  </View>
                </Animated.View>
                {/* Career Intro */}
                {career.intro && (
                  <Text style={{ marginBottom: 8, fontStyle: "italic", color: colors.text }}>
                    {career.intro}
                  </Text>
                )}

                {/* Roles */}
                {career.roles?.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Roles:</Text>
                    <View style={styles.skillContainer}>
                      {career.roles.slice(0, 3).map((role, i) => (
                        <Text key={i} style={styles.skillTag}>{role}</Text>
                      ))}
                    </View>
                  </>
                )}

                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("dashboard.skills")}:</Text>
                <View style={styles.skillContainer}>
                  {career.skills?.map((skill, i) => (
                    <Text key={i} style={styles.skillTag}>{skill}</Text>
                  ))}
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("dashboard.roadmap")}:</Text>
                {career.roadmap?.slice(0, 5).map((step, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Text style={[styles.smallText, { color: colors.text }]}>
                      • {typeof step === 'object' ? step.text : step}
                    </Text>
                    {typeof step === 'object' && step.difficulty && (
                      <Text style={[styles.difficultyBadge, { backgroundColor: colors.primary + '20', color: colors.primary }]}>
                        {step.difficulty}
                      </Text>
                    )}
                  </View>
                ))}

                {career.resources?.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t("dashboard.resources")}:
                      </Text>
                      {!isPremium && (
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Premium')}
                          style={styles.premiumBadge}
                        >
                          <Ionicons name="diamond" size={16} color="#FFD700" />
                          <Text style={styles.premiumText}>PREMIUM</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {isPremium ? (
                      // Show all resources for premium users
                      career.resources.slice(0, 3).map((link) => (
                        <Text
                          key={career.title + "_link_" + link}
                          style={styles.link}
                          onPress={() => Linking.openURL(link)}
                        >
                          🔗 {link}
                        </Text>
                      ))
                    ) : (
                      // Show limited preview for free users
                      <>
                        <Text style={[styles.previewText, { color: colors.text }]}>
                          {career.resources.slice(0, 1).map((link) => (
                            <Text key={link} style={styles.link}>🔗 {link.substring(0, 30)}...\n</Text>
                          ))}
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Premium')}
                          style={styles.unlockButton}
                        >
                          <Ionicons name="lock-open" size={20} color="white" />
                          <Text style={styles.unlockButtonText}> Unlock All Resources</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                )}

                {/* Premium Feature Buttons - Full Width */}
<View style={styles.premiumButtonsContainer}>
  {/* Learning Plan Button */}
  <TouchableOpacity
    style={[styles.premiumButton, { backgroundColor: '#05787c' }]}
    onPress={() => navigation.navigate('LearningPlan', { career: career.title })}
  >
    <Ionicons name="calendar-outline" size={18} color="white" />
    <Text style={styles.premiumButtonText}>View Learning Plan</Text>
  </TouchableOpacity>

  {/* Skill Gap Button */}
  <TouchableOpacity
    style={[styles.premiumButton, { backgroundColor: '#10B981' }]}
    onPress={() => navigation.navigate('SkillGap', { career: career.title })}
  >
    <Ionicons name="analytics" size={18} color="white" />
    <Text style={styles.premiumButtonText}>Analyze Skill Gap</Text>
  </TouchableOpacity>

  {/* Project Ideas Button */}
  <TouchableOpacity
    style={[styles.premiumButton, { backgroundColor: '#8B5CF6' }]}
    onPress={() => navigation.navigate('ProjectIdeas', { career: career.title })}
  >
    <Ionicons name="bulb-outline" size={18} color="white" />
    <Text style={styles.premiumButtonText}>Projects Ideas</Text>
  </TouchableOpacity>

  {/* Mock Interview Button */}
  <TouchableOpacity
    style={[styles.premiumButton, { backgroundColor: '#EC489A' }]}
    onPress={() => navigation.navigate('MockInterview', { career: career.title })}
  >
    <Ionicons name="chatbubbles-outline" size={18} color="white" />
    <Text style={styles.premiumButtonText}>Mock Interview</Text>
  </TouchableOpacity>

  {/* Resume Builder Button */}
  <TouchableOpacity
    style={[styles.resumeButton, { backgroundColor: '#F59E0B' }]}
    onPress={() => navigation.navigate('ResumeBuilder', { career: career.title })}
  >
    <Ionicons name="document-text" size={18} color="white" />
    <Text style={styles.resumeButtonText}>Build Resume</Text>
  </TouchableOpacity>
</View>

                <TouchableOpacity
                  onPress={() => handleSaveSingle(career.title)}
                  disabled={isSaved}
                  style={[
                    styles.button,
                    { backgroundColor: isSaved ? "#9ca3af" : "#4f46e5" },
                  ]}
                >
                  <Text style={styles.buttonText}>
                    {isSaved ? `✔ ${t("dashboard.saved")}` : t("dashboard.saveToDashboard")}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.buttonGroup}>
          <ThreeDButton
            title={t("result.share")}
            onPress={handleShare}
            gradient
          />

          <ThreeDButton
            title={t("result.retake")}
            onPress={() => navigation.navigate("Main", { screen: "Questionnaire" })}
            gradient
          />

          <ThreeDButton
            title={t("result.gotoDashboard")}
            onPress={() => navigation.navigate("DashboardLock")}
            gradient
          />

          <ThreeDButton
            title={t("backHome")}
            onPress={() => navigation.navigate("Main", { screen: "Home" })}
            gradient
          />
        </View>
      </ScrollView>

      <CareerModal visible={modalVisible} onClose={closeModal} career={selectedCareer} />
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
    marginBottom: 10,
  },
  skillTag: {
    backgroundColor: "#e0e7ff",
    color: "#1e3a8a",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    fontWeight: "600",
    marginTop: 8,
  },
  smallText: {
    fontSize: 14,
    marginTop: 4,
  },
  link: {
    fontSize: 14,
    marginTop: 4,
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonGroup: {
    marginTop: 24,
    marginBottom: 40,
    alignItems: "center",
    gap: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
    sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  previewText: {
    marginTop: 4,
    opacity: 0.7,
  },
  unlockButton: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  unlockButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  difficultyBadge: {
  fontSize: 10,
  fontWeight: '500',
  marginLeft: 8,
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 10,
  overflow: 'hidden',
},
premiumButtonsContainer: {
  marginTop: 12,
  marginBottom: 8,
},
premiumButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  marginBottom: 10,
  gap: 8,
},
premiumButtonText: {
  color: 'white',
  fontSize: 14,
  fontWeight: '600',
},
resumeButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  borderRadius: 8,
  marginTop: 2,
  gap: 8,
},
resumeButtonText: {
  color: 'white',
  fontSize: 14,
  fontWeight: '600',
},
});