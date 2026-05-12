// screens/ResultTabScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import careerEmojis from "../data/careerEmojis";
import { useThemeStyles } from "../hooks/useThemeStyles";
import useNetworkStatus from "../hooks/useNetworkStatus";
import OfflineBanner from "../components/OfflineBanner";
import NetworkBanner from "../components/NetworkBanner";
import CareerModal from "../components/CareerModal";
import careerRoadmapsFull from "../data/careerRoadmapsFull";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePremium } from '../context/PremiumContext';
import { trackScreen } from "../services/analytics";

const ResultTabScreen = () => {
  const { colors, isDark } = useThemeStyles();
  const [results, setResults] = useState([]);
  const isConnected = useNetworkStatus();
  const [savedTitles, setSavedTitles] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { isPremium } = usePremium();

  const navigation = useNavigation();

  const openModal = (career) => {
    setSelectedCareer(career);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedCareer(null);
    setModalVisible(false);
  };

  useEffect(() => {
  trackScreen('ResultTabScreen');
}, []);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("lastCareerResult");
      const saved = await AsyncStorage.getItem("savedCareers") || "[]";
      if (stored) {
        const parsed = JSON.parse(stored);
        const enriched = parsed.map((item) => {
          const fullData = careerRoadmapsFull[item.title];
          return fullData ? { title: item.title, ...fullData } : item;
        });
        setResults(enriched);
      }
      
      setSavedTitles(JSON.parse(saved));
    };
    load();
  }, []);

  const handleSaveSingle = async (title) => {
    const updated = [...new Set([...savedTitles, title])];
    await AsyncStorage.setItem("savedCareers", JSON.stringify(updated));
    setSavedTitles(updated);
  };

  if (!results || results.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          📭 No saved results yet. Take the quiz to get started!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <NetworkBanner isConnected={isConnected} />
      {!isConnected && <OfflineBanner />}

      <Text style={[styles.screenTitle, { color: colors.text }]}>
        🎯 My Saved Career Results
      </Text>

      {results.map((career) => {
        const isSaved = savedTitles.includes(career.title);
        return (
          <TouchableOpacity
            key={career.title}
            onPress={() => openModal(career)}
            activeOpacity={0.9}
          >
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              {/* Watermark */}
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

              {/* Title Badge */}
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

              {/* Intro */}
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
                        { backgroundColor: isDark ? "#374151" : "#e0e7ff", color: isDark ? "#c7d2fe" : "#1e3a8a" }
                      ]}>{role}</Text>
                    ))}
                  </View>
                </>
              )}

              {/* Skills */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills:</Text>
              <View style={styles.skillContainer}>
                {career.skills?.map((skill, index) => (
                  <Text key={index} style={[
                    styles.skillTag,
                    { backgroundColor: isDark ? "#374151" : "#e0e7ff", color: isDark ? "#c7d2fe" : "#1e3a8a" }
                  ]}>
                    {skill}
                  </Text>
                ))}
              </View>

              {/* Roadmap */}
              <Text style={[styles.sectionTitle2, { color: colors.text }]}>Roadmap:</Text>
              {career.roadmap?.map((step, index) => {
                const stepText = typeof step === 'object' ? step.text : step;
                const stepDifficulty = typeof step === 'object' ? step.difficulty : null;
                return (
                  <View key={index} style={styles.stepContainer}>
                    <Text style={[styles.stepText, { color: colors.text }]}>
                      • {stepText}
                    </Text>
                    {stepDifficulty && (
                      <Text style={[
                        styles.difficultyBadge,
                        { backgroundColor: colors.primary + '20', color: colors.primary }
                      ]}>
                        {stepDifficulty}
                      </Text>
                    )}
                  </View>
                );
              })}

              {/* Resources */}
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
                    career.resources.slice(0, 5).map((link) => (
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
                          <Text key={link} style={[styles.link, { color: colors.primary }]}>
                            🔗 {link.substring(0, 40)}...\n
                          </Text>
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

              {/* Save Button */}
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

      <CareerModal visible={modalVisible} onClose={closeModal} career={selectedCareer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
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
    marginTop: 12,
    marginBottom: 8,
    fontSize: 15,
  },
  sectionTitle2: {
    fontWeight: "600",
    marginTop: 22,
    marginBottom: 8,
    fontSize: 15,
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  skillTag: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
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
  link: {
    fontSize: 13,
    marginTop: 4,
    textDecorationLine: "underline",
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
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
    marginBottom: 4,
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
  saveButton: {
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ResultTabScreen;