// screens/DashboardScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import careerRoadmapsFull from "../data/careerRoadmapsFull";
import careerEmojis from "../data/careerEmojis";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useNavigation } from "@react-navigation/native";
import { useThemeStyles } from "../hooks/useThemeStyles";
import useNetworkStatus from "../hooks/useNetworkStatus";
import OfflineBanner from "../components/OfflineBanner";
import NetworkBanner from "../components/NetworkBanner";
import ThreeDButton from "../components/ThreeDButton";
import { usePremium } from '../context/PremiumContext';
import { Ionicons } from "@expo/vector-icons";
import { trackScreen } from "../services/analytics";

const DashboardScreen = () => {
  const [savedCareers, setSavedCareers] = useState([]);
  const navigation = useNavigation();
  const { colors, isDark, wp, hp, normalize, isTablet } = useThemeStyles();
  const isConnected = useNetworkStatus();
  const { isPremium } = usePremium();

  useEffect(() => {
    const loadCareers = async () => {
      const stored = JSON.parse(await AsyncStorage.getItem("savedCareers") || "[]");
      const full = stored
        .map((title) => careerRoadmapsFull[title] && { title, ...careerRoadmapsFull[title] })
        .filter(Boolean);
      setSavedCareers(full);
    };
    loadCareers();
  }, []);

  useEffect(() => {
  trackScreen('DashboardScreen');
}, []);

  const handleRemoveCareer = async (titleToRemove) => {
    const updated = savedCareers.filter((c) => c.title !== titleToRemove);
    setSavedCareers(updated);
    const titles = updated.map((c) => c.title);
    await AsyncStorage.setItem("savedCareers", JSON.stringify(titles));
  };

  const clearDashboard = async () => {
    await AsyncStorage.removeItem("savedCareers");
    setSavedCareers([]);
  };

  const exportToJSON = async () => {
    const exportData = savedCareers.map(career => ({
      ...career,
      resources: isPremium ? career.resources : [],
    }));
    const blob = JSON.stringify(exportData, null, 2);
    const path = FileSystem.documentDirectory + "career-paths.json";
    await FileSystem.writeAsStringAsync(path, blob);
    await Sharing.shareAsync(path);
  };

  const exportToPDF = async () => {
    const html = `
      <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #4f46e5;">My Saved Career Paths</h1>
        ${savedCareers.map((c) => `
          <div style="margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
            <h2 style="color: #1e3a8a;">${c.title}</h2>
            <p><strong>Top Skills:</strong> ${c.skills?.join(", ")}</p>
            <p><strong>Roadmap:</strong></p>
            <ul>
              ${c.roadmap?.map((step) => {
                const stepText = typeof step === 'object' ? step.text : step;
                return `<li>${stepText}</li>`;
              }).join("")}
            </ul>
            <p><strong>Resources:</strong></p>
            <ul>
              ${isPremium 
                ? c.resources?.map((r) => `<li>${r}</li>`).join("") 
                : `<li>Upgrade to Premium to access resources</li>`
              }
            </ul>
          </div>
        `).join("")}
      </body></html>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  return (
    <ImageBackground
      source={require("../assets/splash/splash.png")}
      style={{ flex: 1, backgroundColor: colors.background }}
      imageStyle={{ opacity: 0.04, resizeMode: "contain" }}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.container,
          { padding: wp(4), paddingBottom: hp(5) },
          isTablet && { width: wp(85), alignSelf: 'center' }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <NetworkBanner isConnected={isConnected} />
        {!isConnected && <OfflineBanner />}

        <Text style={[styles.title, { color: colors.text, fontSize: normalize(24) }]}>📁 Saved Careers</Text>

        {savedCareers.length === 0 ? (
          <View style={[styles.emptyBox, { marginTop: hp(10), paddingHorizontal: wp(5) }]}>
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: normalize(16) }]}>
              📭 No saved careers yet. Save careers from quiz results or career explorer!
            </Text>
          </View>
        ) : (
          savedCareers.map((career, i) => {
            const watermarkSize = normalize(70);
            return (
            <View key={i} style={[styles.card, { backgroundColor: colors.card, padding: normalize(18), borderRadius: normalize(16) }]}>
              <Image
                source={require("../assets/splash/splash.png")}
                style={[styles.watermark, { width: watermarkSize, height: watermarkSize, borderRadius: watermarkSize / 2 }]}
              />

              <View style={styles.badgeRow}>
                <View style={[styles.titleBadge, { backgroundColor: isDark ? "#4f46e520" : "#e0e7ff", paddingVertical: normalize(6), paddingHorizontal: normalize(12) }]}>
                  <Text style={[styles.emoji, { fontSize: normalize(18) }]}>{careerEmojis[career.title] || "💼"}</Text>
                  <Text style={[styles.badgeText, { color: isDark ? "#c7d2fe" : "#1e3a8a", fontSize: normalize(16) }]}>
                    {career.title}
                  </Text>
                </View>
              </View>

              {career.intro && (
                <Text style={[styles.intro, { color: colors.textSecondary, fontSize: normalize(14), lineHeight: normalize(20) }]}>
                  {career.intro}
                </Text>
              )}

              {career.roles?.length > 0 && (
                <>
                  <Text style={[styles.label, { color: colors.text, fontSize: normalize(15) }]}>Roles:</Text>
                  <View style={styles.skillContainer}>
                    {career.roles.slice(0, 3).map((role, j) => (
                      <Text key={j} style={[
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

              <Text style={[styles.label, { color: colors.text, fontSize: normalize(15) }]}>Top Skills:</Text>
              <View style={styles.skillContainer}>
                {career.skills?.map((skill, j) => (
                  <Text key={j} style={[
                    styles.skillTag,
                    {
                      backgroundColor: isDark ? "#374151" : "#e0e7ff",
                      color: isDark ? "#c7d2fe" : "#1e3a8a",
                      fontSize: normalize(12),
                      paddingHorizontal: normalize(10),
                      paddingVertical: normalize(4)
                    }
                  ]}>{skill}</Text>
                ))}
              </View>

              <Text style={[styles.label2, { color: colors.text, fontSize: normalize(15), marginTop: hp(3) }]}>Roadmap Preview:</Text>
              <View style={styles.stepsContainer}>
                {career.roadmap?.slice(0, 8).map((step, j) => {
                  const stepText = typeof step === 'object' ? step.text : step;
                  const stepDifficulty = typeof step === 'object' ? step.difficulty : null;
                  return (
                    <View key={j} style={styles.stepRow}>
                      <Text style={[styles.step, { color: colors.text, fontSize: normalize(14), lineHeight: normalize(20) }]}>• {stepText}</Text>
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
                {career.roadmap?.length > 8 && (
                  <Text style={[styles.moreSteps, { color: colors.textSecondary, fontSize: normalize(12) }]}>
                    + {career.roadmap.length - 8} more steps
                  </Text>
                )}
              </View>

              {career.resources?.length > 0 && (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.label, { color: colors.text, marginTop: hp(1), fontSize: normalize(15) }]}>Resources:</Text>
                    {!isPremium && (
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Premium')}
                        style={[styles.premiumBadge, { backgroundColor: colors.primary, paddingHorizontal: normalize(8), paddingVertical: normalize(4) }]}
                      >
                        <Ionicons name="diamond" size={normalize(14)} color="#FFD700" />
                        <Text style={[styles.premiumText, { fontSize: normalize(10) }]}>PREMIUM</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {isPremium ? (
                    career.resources.slice(0, 4).map((link) => (
                      <Text
                        key={link}
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
                        <Text style={[styles.unlockButtonText, { fontSize: normalize(14), marginLeft: normalize(8) }]}>Unlock All Resources</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}

              {/* Premium Feature Buttons */}
              <View style={styles.premiumButtonsContainer}>
                {[
                  { screen: 'LearningPlan', icon: 'calendar-outline', label: 'Learning Plan', bg: '#0d9488' },
                  { screen: 'SkillGap', icon: 'analytics', label: 'Skill Gap', bg: '#10B981' },
                  { screen: 'ProjectIdeas', icon: 'bulb-outline', label: 'Projects', bg: '#8B5CF6' },
                  { screen: 'MockInterview', icon: 'chatbubbles-outline', label: 'Interview', bg: '#EC489A' },
                ].map((btn, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.premiumButton, { backgroundColor: btn.bg, paddingVertical: normalize(12), marginBottom: normalize(8) }]}
                    onPress={() => navigation.navigate(btn.screen, { career: career.title })}
                  >
                    <Ionicons name={btn.icon} size={normalize(18)} color="white" />
                    <Text style={[styles.premiumButtonText, { fontSize: normalize(14), marginLeft: normalize(8) }]}>{btn.label}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[styles.resumeButton, { backgroundColor: '#F59E0B', paddingVertical: normalize(12) }]}
                  onPress={() => navigation.navigate('ResumeBuilder', { career: career.title })}
                >
                  <Ionicons name="document-text" size={normalize(18)} color="white" />
                  <Text style={[styles.resumeButtonText, { fontSize: normalize(14), marginLeft: normalize(8) }]}>Build Resume</Text>
                </TouchableOpacity>
              </View>

              <ThreeDButton
                title="Delete Career"
                onPress={() => handleRemoveCareer(career.title)}
                gradient
                style={{ backgroundColor: "#dc2626" }}
              />
            </View>
          );
        })
        )}

        <View style={styles.actions}>
          <ThreeDButton title="Export PDF" onPress={exportToPDF} gradient />
          <ThreeDButton title="Export JSON" onPress={exportToJSON} gradient />
          <ThreeDButton title="Clear All" onPress={clearDashboard} style={{ backgroundColor: "#ef4444" }} />
          <ThreeDButton
            title="Home"
            onPress={() => navigation.navigate("Main", { screen: "Home" })}
            style={{ backgroundColor: "#6b7280" }}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  title: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  watermark: {
    position: "absolute",
    opacity: 0.1,
    top: -4,
    right: 10,
    zIndex: -1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
    fontStyle: "italic",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  label2: {
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
  stepsContainer: {
    marginTop: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  step: {
  },
  difficultyBadge: {
    fontWeight: '500',
    marginLeft: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  moreSteps: {
    marginTop: 4,
    fontStyle: 'italic',
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
  },
  unlockButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  actions: {
    marginTop: 20,
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  emptyBox: {
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 22,
  },
});

export default DashboardScreen;