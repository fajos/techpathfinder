// Polished DashboardScreen with unified card design

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
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useNavigation } from "@react-navigation/native";
import { useThemeStyles } from "../hooks/useThemeStyles";
import useNetworkStatus from "../hooks/useNetworkStatus";
import OfflineBanner from "../components/OfflineBanner";
import NetworkBanner from "../components/NetworkBanner";
import { useTranslation } from "react-i18next";
import ThreeDButton from "../components/ThreeDButton";
import { usePremium } from '../context/PremiumContext';
import { Ionicons } from "@expo/vector-icons";

const DashboardScreen = () => {
  const [savedCareers, setSavedCareers] = useState([]);
  const navigation = useNavigation();
  const { colors } = useThemeStyles();
  const isConnected = useNetworkStatus();
  const { t } = useTranslation();

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
  // Filter out resources for free users
  const exportData = savedCareers.map(career => ({
    ...career,
    resources: isPremium ? career.resources : [], // Empty array for free users
  }));
  
  const blob = JSON.stringify(exportData, null, 2);
  const path = FileSystem.documentDirectory + "career-paths.json";
  await FileSystem.writeAsStringAsync(path, blob);
  await Sharing.shareAsync(path);
};

  const exportToPDF = async () => {
  const html = `
    <html><body>
      <h1>${t("dashboard.exportTitle")}</h1>
      ${savedCareers
        .map(
          (c) => `
            <h2>${c.title}</h2>
            <p><strong>${t("dashboard.skills")}:</strong> ${c.skills?.join(", ")}</p>
            <p><strong>${t("dashboard.roadmap")}:</strong></p>
            <ul>
              ${c.roadmap?.map((step) => {
                const stepText = typeof step === 'object' ? step.text : step;
                return `<li>${stepText}</li>`;
              }).join("")}
            </ul>
            <p><strong>${t("dashboard.resources")}:</strong></p>
            <ul>
              ${isPremium 
                ? c.resources?.map((r) => `<li>${r}</li>`).join("") 
                : `<li>Upgrade to Premium to access resources</li>`
              }
            </ul>
          `
        )
        .join("<hr/>")}
    </body></html>
  `;
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
};

  return (
    <ImageBackground
      source={require("../assets/splash/splash.png")}
      style={{ flex: 1 }}
      imageStyle={{ opacity: 0.04, resizeMode: "contain" }}
    >
      <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false} >
        <NetworkBanner isConnected={isConnected} />
        {!isConnected && <OfflineBanner />}

        <Text style={[styles.title, { color: colors.text }]}>📁 {t("dashboard.savedTitle")}</Text>

        {savedCareers.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, { color: colors.text }]}>📭 {t("dashboard.empty")}</Text>
          </View>
        ) : (
          savedCareers.map((career, i) => (
            <View key={i} style={[styles.card, { backgroundColor: colors.card }]}>
              <Image
                source={require("../assets/splash/splash.png")}
                style={styles.watermark}
              />

              <View style={styles.badgeRow}>
                <View style={styles.titleBadge}>
                  <Text style={styles.emoji}>{careerEmojis[career.title] || "💼"}</Text>
                  <Text style={styles.badgeText}>{career.title}</Text>
                </View>
              </View>

              {career.intro && (
                <Text style={[styles.intro, { color: colors.text }]}>{career.intro}</Text>
              )}

              {career.roles?.length > 0 && (
                <>
                  <Text style={[styles.label, { color: colors.text }]}>Roles:</Text>
                  <View style={styles.skillContainer}>
                    {career.roles.slice(0, 3).map((role, j) => (
                      <Text key={j} style={styles.skillTag}>{role}</Text>
                    ))}
                  </View>
                </>
              )}

              <Text style={[styles.label, { color: colors.text }]}>{t("dashboard.skills")}:</Text>
              <View style={styles.skillContainer}>
                {career.skills?.map((skill, j) => (
                  <Text key={j} style={styles.skillTag}>{skill}</Text>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.text }]}>{t("dashboard.roadmap")}:</Text>
              {career.roadmap?.slice(0, 10).map((step, j) => {
                const stepText = typeof step === 'object' ? step.text : step;
                const stepDifficulty = typeof step === 'object' ? step.difficulty : null;
                return (
                  <View key={j} style={styles.stepContainer}>
                    <Text style={[styles.step, { color: colors.text }]}>• {stepText}</Text>
                    {stepDifficulty && (
                      <Text style={[styles.difficultyBadge, { backgroundColor: colors.primary + '20', color: colors.primary }]}>
                        {stepDifficulty}
                      </Text>
                    )}
                  </View>
                );
              })}

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
      career.resources.slice(0, 5).map((link) => (
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
            <Text key={link} style={styles.link}>🔗 {link.substring(0, 40)}...\n</Text>
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

              <ThreeDButton
                title={t("dashboard.delete")}
                onPress={() => handleRemoveCareer(career.title)}
                gradient
                style={{ backgroundColor: "#dc2626" }}
              />
            </View>
          ))
        )}

        <View style={styles.actions}>
          <ThreeDButton title={t("dashboard.exportPdf")} onPress={exportToPDF} gradient />
          <ThreeDButton title={t("dashboard.exportJson")} onPress={exportToJSON} gradient />
          <ThreeDButton title={t("dashboard.clear")} onPress={clearDashboard} style={{ backgroundColor: "#ef4444" }} />
          <ThreeDButton
            title={t("backHome")}
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
    marginBotton: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    overflow: "hidden",
  },
  watermark: {
    position: "absolute",
    width: 70,
    height: 70,
    opacity: 0.25,
    borderRadius: 35,
    top: -4,
    right: 10,
    zIndex: -1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  titleBadge: {
    backgroundColor: "#e0e7ff",
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
    color: "#1e3a8a",
  },
  intro: {
    fontStyle: "italic",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
   stepContainer: {
  flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
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
  step: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 4,
  },
  link: {
    fontSize: 13,
    marginBottom: 4,
    textDecorationLine: "underline",
  },
  actions: {
    marginTop: 20,
    alignItems: "center",
    gap: 10,
  },
  emptyBox: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
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

export default DashboardScreen;