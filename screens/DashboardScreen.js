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

const DashboardScreen = () => {
  const [savedCareers, setSavedCareers] = useState([]);
  const navigation = useNavigation();
  const { colors, isDark } = useThemeStyles();
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
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        <NetworkBanner isConnected={isConnected} />
        {!isConnected && <OfflineBanner />}

        <Text style={[styles.title, { color: colors.text }]}>📁 Saved Careers</Text>

        {savedCareers.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              📭 No saved careers yet. Save careers from quiz results or career explorer!
            </Text>
          </View>
        ) : (
          savedCareers.map((career, i) => (
            <View key={i} style={[styles.card, { backgroundColor: colors.card }]}>
              <Image
                source={require("../assets/splash/splash.png")}
                style={styles.watermark}
              />

              <View style={styles.badgeRow}>
                <View style={[styles.titleBadge, { backgroundColor: isDark ? "#4f46e520" : "#e0e7ff" }]}>
                  <Text style={styles.emoji}>{careerEmojis[career.title] || "💼"}</Text>
                  <Text style={[styles.badgeText, { color: isDark ? "#c7d2fe" : "#1e3a8a" }]}>
                    {career.title}
                  </Text>
                </View>
              </View>

              {career.intro && (
                <Text style={[styles.intro, { color: colors.textSecondary }]}>
                  {career.intro}
                </Text>
              )}

              {career.roles?.length > 0 && (
                <>
                  <Text style={[styles.label, { color: colors.text }]}>Roles:</Text>
                  <View style={styles.skillContainer}>
                    {career.roles.slice(0, 3).map((role, j) => (
                      <Text key={j} style={[
                        styles.skillTag,
                        { backgroundColor: isDark ? "#374151" : "#e0e7ff", color: isDark ? "#c7d2fe" : "#1e3a8a" }
                      ]}>{role}</Text>
                    ))}
                  </View>
                </>
              )}

              <Text style={[styles.label, { color: colors.text }]}>Top Skills:</Text>
              <View style={styles.skillContainer}>
                {career.skills?.map((skill, j) => (
                  <Text key={j} style={[
                    styles.skillTag,
                    { backgroundColor: isDark ? "#374151" : "#e0e7ff", color: isDark ? "#c7d2fe" : "#1e3a8a" }
                  ]}>{skill}</Text>
                ))}
              </View>

              <Text style={[styles.label2, { color: colors.text }]}>Roadmap Preview:</Text>
              <View style={styles.stepsContainer}>
                {career.roadmap?.slice(0, 8).map((step, j) => {
                  const stepText = typeof step === 'object' ? step.text : step;
                  const stepDifficulty = typeof step === 'object' ? step.difficulty : null;
                  return (
                    <View key={j} style={styles.stepRow}>
                      <Text style={[styles.step, { color: colors.text }]}>• {stepText}</Text>
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
                {career.roadmap?.length > 8 && (
                  <Text style={[styles.moreSteps, { color: colors.textSecondary }]}>
                    + {career.roadmap.length - 8} more steps
                  </Text>
                )}
              </View>

              {career.resources?.length > 0 && (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.label, { color: colors.text, marginTop: 8 }]}>Resources:</Text>
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
                    career.resources.slice(0, 4).map((link) => (
                      <Text
                        key={link}
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
                        <Text style={styles.unlockButtonText}>Unlock All Resources</Text>
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

              <ThreeDButton
                title="Delete Career"
                onPress={() => handleRemoveCareer(career.title)}
                gradient
                style={{ backgroundColor: "#dc2626" }}
              />
            </View>
          ))
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
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    borderRadius: 16,
    padding: 18,
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
    width: 70,
    height: 70,
    opacity: 0.1,
    borderRadius: 35,
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
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 15,
    marginTop: 16,
  },
  label2: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 15,
    marginTop: 28,
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
    fontSize: 14,
    lineHeight: 20,
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
  moreSteps: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
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
  actions: {
    marginTop: 20,
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  emptyBox: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default DashboardScreen;