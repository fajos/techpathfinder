// screens/ResultScreen.js
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
import ThreeDButton from "../components/ThreeDButton";
import { usePremium } from '../context/PremiumContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useUserProfileStore } from '../store/userProfileStore';
import { trackScreen } from "../services/analytics";

const ResultScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { answers } = route.params || {};
  const { isDark } = useContext(ThemeContext);
  const isConnected = useNetworkStatus();
  const { colors } = useThemeStyles();
  const [_, forceUpdate] = useState({}); // For forcing re-render on theme change

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

  // Force re-render when theme changes
  useEffect(() => {
    forceUpdate({});
  }, [isDark]);

  useEffect(() => {
  trackScreen('ResultScreen');
}, []);

  useEffect(() => {
    if (user && fullResults.length > 0 && !hasSavedRef.current) {
      hasSavedRef.current = true;
      
      addQuizResult(user.uid, {
        answers,
        results: fullResults.map(c => c.title),
        date: new Date().toISOString()
      });
      
      if (fullResults[0]) {
        saveCareer(user.uid, fullResults[0].title);
      }

      updateLastActive(user.uid);
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
      const title = top?.title || "Tech Career";
      const emoji = careerEmojis[title] || "💻";
      await Share.share({
        message: `Check out my career match: ${emoji} ${title}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!answers) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>No answers found</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Questionnaire")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Take Quiz</Text>
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
          🎯 Your Top Career Matches
        </Text>

        {showConfetti && (
          <Text style={{ fontSize: 26, textAlign: "center", marginBottom: 12, color: colors.text }}>
            🎉 Congratulations!
          </Text>
        )}

        {fullResults.map((career, idx) => {
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
                    opacity: 0.3,
                    borderRadius: 35,
                    top: 0,
                    right: 10,
                    zIndex: -1,
                  }}
                />

                <Animated.View style={{ opacity: fadeAnim }}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                    <View style={[
                      styles.titleBadge,
                      { backgroundColor: isDark ? "#4f46e520" : "#e0e7ff" }
                    ]}>
                      <Text style={styles.emoji}>{careerEmojis[career.title] || "💼"}</Text>
                      <Text style={[
                        styles.badgeText,
                        { color: isDark ? "#c7d2fe" : "#1e3a8a" }
                      ]}>
                        {career.title}
                      </Text>
                    </View>
                  </View>
                </Animated.View>

                {/* Career Intro */}
                {career.intro && (
                  <Text style={[styles.intro, { color: colors.textSecondary }]}>
                    {career.intro}
                  </Text>
                )}

                {/* Roles */}
                {career.roles?.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Roles:</Text>
                    <View style={styles.skillContainer}>
                      {career.roles.slice(0, 3).map((role, i) => (
                        <Text key={i} style={[
                          styles.skillTag,
                          { backgroundColor: isDark ? "#4f46e520" : "#e0e7ff", color: isDark ? "#c7d2fe" : "#1e3a8a" }
                        ]}>{role}</Text>
                      ))}
                    </View>
                  </>
                )}

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Skills:</Text>
                <View style={styles.skillContainer}>
                  {career.skills?.slice(0, 8).map((skill, i) => (
                    <Text key={i} style={[
                      styles.skillTag,
                      { backgroundColor: isDark ? "#374151" : "#e0e7ff", color: isDark ? "#c7d2fe" : "#1e3a8a" }
                    ]}>{skill}</Text>
                  ))}
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Roadmap Preview:</Text>
                {career.roadmap?.slice(0, 5).map((step, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Text style={[styles.smallText, { color: colors.text }]}>
                      • {typeof step === 'object' ? step.text : step}
                    </Text>
                    {typeof step === 'object' && step.difficulty && (
                      <Text style={[
                        styles.difficultyBadge,
                        { backgroundColor: colors.primary + '20', color: colors.primary }
                      ]}>
                        {step.difficulty}
                      </Text>
                    )}
                  </View>
                ))}

                {career.resources?.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={[styles.sectionTitle, { color: colors.text }]}>Resources:</Text>
                      {!isPremium && (
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Premium')}
                          style={[styles.premiumBadge, { backgroundColor: colors.primary }]}
                        >
                          <Ionicons name="diamond" size={14} color="#FFD700" />
                          <Text style={styles.premiumText}>PREMIUM</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {isPremium ? (
                      career.resources.slice(0, 3).map((link) => (
                        <Text
                          key={career.title + "_link_" + link}
                          style={[styles.link, { color: colors.primary }]}
                          onPress={() => Linking.openURL(link)}
                        >
                          🔗 {link}
                        </Text>
                      ))
                    ) : (
                      <>
                        <Text style={[styles.previewText, { color: colors.textSecondary }]}>
                          {career.resources.slice(0, 1).map((link) => (
                            <Text key={link} style={[styles.link, { color: colors.primary }]}>🔗 {link.substring(0, 40)}...\n</Text>
                          ))}
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Premium')}
                          style={[styles.unlockButton, { backgroundColor: colors.primary }]}
                        >
                          <Ionicons name="lock-open" size={20} color="white" />
                          <Text style={styles.unlockButtonText}> Unlock All Resources</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                )}

                {/* Premium Feature Buttons */}
                <View style={styles.premiumButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.premiumButton, { backgroundColor: '#0d9488' }]}
                    onPress={() => navigation.navigate('LearningPlan', { career: career.title })}
                  >
                    <Ionicons name="calendar-outline" size={18} color="white" />
                    <Text style={styles.premiumButtonText}>Learning Plan</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.premiumButton, { backgroundColor: '#10B981' }]}
                    onPress={() => navigation.navigate('SkillGap', { career: career.title })}
                  >
                    <Ionicons name="analytics" size={18} color="white" />
                    <Text style={styles.premiumButtonText}>Skill Gap</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.premiumButton, { backgroundColor: '#8B5CF6' }]}
                    onPress={() => navigation.navigate('ProjectIdeas', { career: career.title })}
                  >
                    <Ionicons name="bulb-outline" size={18} color="white" />
                    <Text style={styles.premiumButtonText}>Projects</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.premiumButton, { backgroundColor: '#EC489A' }]}
                    onPress={() => navigation.navigate('MockInterview', { career: career.title })}
                  >
                    <Ionicons name="chatbubbles-outline" size={18} color="white" />
                    <Text style={styles.premiumButtonText}>Interview</Text>
                  </TouchableOpacity>

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
                    styles.saveButton,
                    { backgroundColor: isSaved ? (isDark ? "#4b5563" : "#9ca3af") : colors.primary },
                  ]}
                >
                  <Text style={styles.saveButtonText}>
                    {isSaved ? `✔ Saved` : `Save to Dashboard`}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.buttonGroup}>
          <ThreeDButton title="Share Results" onPress={handleShare} gradient />
          <ThreeDButton title="Retake Quiz" onPress={() => navigation.navigate("Main", { screen: "Questionnaire" })} gradient />
          <ThreeDButton title="Go to Dashboard" onPress={() => navigation.navigate("DashboardLock")} gradient />
          <ThreeDButton title="Home" onPress={() => navigation.navigate("Main", { screen: "Home" })} gradient />
        </View>
      </ScrollView>

      <CareerModal visible={modalVisible} onClose={closeModal} career={selectedCareer} />
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  titleBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 18,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  intro: {
    marginBottom: 8,
    fontStyle: "italic",
    lineHeight: 20,
  },
  sectionTitle: {
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 6,
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  skillTag: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  smallText: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 18,
  },
  difficultyBadge: {
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  link: {
    fontSize: 13,
    marginTop: 4,
    textDecorationLine: "underline",
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
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
  premiumButtonsContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
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
    borderRadius: 10,
    marginTop: 2,
    gap: 8,
  },
  resumeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});