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
  const { colors, isDark, wp, hp, normalize, isTablet } = useThemeStyles();
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
      contentContainerStyle={[
        styles.scrollContent,
        { padding: wp(4), paddingBottom: hp(5) },
        isTablet ? { alignSelf: 'center', width: wp(85) } : null
      ]}
      showsVerticalScrollIndicator={false}
    >
      <NetworkBanner isConnected={isConnected} />
      {!isConnected && <OfflineBanner />}

      <Text style={[styles.screenTitle, { color: colors.text, fontSize: normalize(24), marginTop: hp(2.5), marginBottom: hp(2.5) }]}>
        🎯 My Saved Career Results
      </Text>

      {results.map((career) => {
        const isSaved = savedTitles.includes(career.title);
        const logoSize = normalize(70);
        return (
          <TouchableOpacity
            key={career.title}
            onPress={() => openModal(career)}
            activeOpacity={0.9}
          >
            <View style={[styles.card, { backgroundColor: colors.card, padding: normalize(16) }]}>
              {/* Watermark */}
              <Image
                source={require("../assets/splash/splash.png")}
                style={{
                  position: "absolute",
                  width: logoSize,
                  height: logoSize,
                  opacity: 0.3,
                  borderRadius: logoSize / 2,
                  top: 0,
                  right: 10,
                  zIndex: -1,
                }}
              />

              {/* Title Badge */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: normalize(12) }}>
                <View style={[
                  styles.titleBadge,
                  {
                    backgroundColor: isDark ? "#4f46e520" : "#e0e7ff",
                    paddingVertical: normalize(6),
                    paddingHorizontal: normalize(12)
                  }
                ]}>
                  <Text style={[styles.emoji, { fontSize: normalize(18) }]}>{careerEmojis[career.title] || "💼"}</Text>
                  <Text style={[
                    styles.badgeText,
                    { color: isDark ? "#c7d2fe" : "#1e3a8a", fontSize: normalize(16) }
                  ]}>
                    {career.title}
                  </Text>
                </View>
              </View>

              {/* Intro */}
              {career.intro && (
                <Text style={[styles.intro, { color: colors.textSecondary, fontSize: normalize(14), lineHeight: normalize(20) }]}>
                  {career.intro}
                </Text>
              )}

              {/* Roles */}
              {career.roles?.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(15) }]}>Roles:</Text>
                  <View style={styles.skillContainer}>
                    {career.roles.slice(0, 3).map((role, i) => (
                      <Text key={i} style={[
                        styles.skillTag,
                        {
                          backgroundColor: isDark ? "#374151" : "#e0e7ff",
                          color: isDark ? "#c7d2fe" : "#1e3a8a",
                          fontSize: normalize(12),
                          paddingHorizontal: normalize(10),
                          paddingVertical: normalize(4)
                        }
                      ]}>{role}</Text>
                    ))}
                  </View>
                </>
              )}

              {/* Skills */}
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(15) }]}>Skills:</Text>
              <View style={styles.skillContainer}>
                {career.skills?.map((skill, index) => (
                  <Text key={index} style={[
                    styles.skillTag,
                    {
                      backgroundColor: isDark ? "#374151" : "#e0e7ff",
                      color: isDark ? "#c7d2fe" : "#1e3a8a",
                      fontSize: normalize(12),
                      paddingHorizontal: normalize(10),
                      paddingVertical: normalize(4)
                    }
                  ]}>
                    {skill}
                  </Text>
                ))}
              </View>

              {/* Roadmap */}
              <Text style={[styles.sectionTitle2, { color: colors.text, fontSize: normalize(15), marginTop: normalize(22) }]}>Roadmap:</Text>
              {career.roadmap?.map((step, index) => {
                const stepText = typeof step === 'object' ? step.text : step;
                const stepDifficulty = typeof step === 'object' ? step.difficulty : null;
                return (
                  <View key={index} style={styles.stepContainer}>
                    <Text style={[styles.stepText, { color: colors.text, fontSize: normalize(14), lineHeight: normalize(20) }]}>
                      • {stepText}
                    </Text>
                    {stepDifficulty && (
                      <Text style={[
                        styles.difficultyBadge,
                        {
                          backgroundColor: colors.primary + '20',
                          color: colors.primary,
                          fontSize: normalize(10),
                          paddingHorizontal: normalize(6),
                          paddingVertical: normalize(2)
                        }
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
                    <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(15) }]}>Resources:</Text>
                    {!isPremium && (
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Premium')}
                        style={[styles.premiumBadge, { backgroundColor: colors.primary }]}
                      >
                        <Ionicons name="diamond" size={normalize(14)} color="#FFD700" />
                        <Text style={[styles.premiumText, { fontSize: normalize(10) }]}>PREMIUM</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {isPremium ? (
                    career.resources.slice(0, 5).map((link) => (
                      <Text
                        key={career.title + "_link_" + link}
                        style={[styles.link, { color: colors.primary, fontSize: normalize(13) }]}
                        onPress={() => Linking.openURL(link)}
                      >
                        🔗 {link}
                      </Text>
                    ))
                  ) : (
                    <>
                      <Text style={[styles.previewText, { color: colors.textSecondary }]}>
                        {career.resources.slice(0, 1).map((link) => (
                          <Text key={link} style={[styles.link, { color: colors.primary, fontSize: normalize(13) }]}>
                            🔗 {link.substring(0, 40)}...\n
                          </Text>
                        ))}
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Premium')}
                        style={[styles.unlockButton, { backgroundColor: colors.primary, padding: normalize(10) }]}
                      >
                        <Ionicons name="lock-open" size={normalize(20)} color="white" />
                        <Text style={[styles.unlockButtonText, { fontSize: normalize(14) }]}> Unlock All Resources</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}

              {/* Premium Feature Buttons */}
              <View style={styles.premiumButtonsContainer}>
                <TouchableOpacity
                  style={[styles.premiumButton, { backgroundColor: '#0d9488', paddingVertical: normalize(12) }]}
                  onPress={() => navigation.navigate('LearningPlan', { career: career.title })}
                >
                  <Ionicons name="calendar-outline" size={normalize(18)} color="white" />
                  <Text style={[styles.premiumButtonText, { fontSize: normalize(14) }]}>Learning Plan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.premiumButton, { backgroundColor: '#10B981', paddingVertical: normalize(12) }]}
                  onPress={() => navigation.navigate('SkillGap', { career: career.title })}
                >
                  <Ionicons name="analytics" size={normalize(18)} color="white" />
                  <Text style={[styles.premiumButtonText, { fontSize: normalize(14) }]}>Skill Gap</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.premiumButton, { backgroundColor: '#8B5CF6', paddingVertical: normalize(12) }]}
                  onPress={() => navigation.navigate('ProjectIdeas', { career: career.title })}
                >
                  <Ionicons name="bulb-outline" size={normalize(18)} color="white" />
                  <Text style={[styles.premiumButtonText, { fontSize: normalize(14) }]}>Projects</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.premiumButton, { backgroundColor: '#EC489A', paddingVertical: normalize(12) }]}
                  onPress={() => navigation.navigate('MockInterview', { career: career.title })}
                >
                  <Ionicons name="chatbubbles-outline" size={normalize(18)} color="white" />
                  <Text style={[styles.premiumButtonText, { fontSize: normalize(14) }]}>Interview</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.resumeButton, { backgroundColor: '#F59E0B', paddingVertical: normalize(12) }]}
                  onPress={() => navigation.navigate('ResumeBuilder', { career: career.title })}
                >
                  <Ionicons name="document-text" size={normalize(18)} color="white" />
                  <Text style={[styles.resumeButtonText, { fontSize: normalize(14) }]}>Build Resume</Text>
                </TouchableOpacity>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={() => handleSaveSingle(career.title)}
                disabled={isSaved}
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: isSaved ? (isDark ? "#4b5563" : "#9ca3af") : colors.primary,
                    paddingVertical: normalize(12),
                    marginTop: normalize(8)
                  },
                ]}
              >
                <Text style={[styles.saveButtonText, { fontSize: normalize(14) }]}>
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
  },
  screenTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  titleBadge: {
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
  },
  badgeText: {
    fontWeight: "bold",
    marginLeft: 8,
  },
  intro: {
    marginBottom: 8,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle2: {
    fontWeight: "600",
    marginBottom: 8,
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  skillTag: {
    borderRadius: 999,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  stepText: {
    flex: 1,
  },
  difficultyBadge: {
    fontWeight: '500',
    marginLeft: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  link: {
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
    borderRadius: 12,
    gap: 4,
  },
  premiumText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  previewText: {
    marginTop: 4,
    opacity: 0.7,
  },
  unlockButton: {
    flexDirection: 'row',
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
    borderRadius: 10,
    marginBottom: 8,
    gap: 8,
  },
  premiumButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 2,
    gap: 8,
  },
  resumeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ResultTabScreen;