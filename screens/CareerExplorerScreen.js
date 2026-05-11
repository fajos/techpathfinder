import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import careerRoadmapsFull from "../data/careerRoadmapsFull";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { useTranslation } from "react-i18next";
import careerEmojis from "../data/careerEmojis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ThreeDButton from "../components/ThreeDButton";
import { Ionicons } from '@expo/vector-icons';
import { usePremium } from '../context/PremiumContext';

const CareerExplorerScreen = () => {
  const { colors } = useThemeStyles();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [savedTitles, setSavedTitles] = useState([]);
  const navigation = useNavigation();

  const { isPremium } = usePremium();
const showPremiumFeatures = isPremium;

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("savedCareers");
      if (saved) setSavedTitles(JSON.parse(saved));
    };
    load();
  }, []);

  const filteredCareers = Object.keys(careerRoadmapsFull)
    .filter((title) => title.toLowerCase().includes(query.toLowerCase()))
    .map((title) => ({ title, ...careerRoadmapsFull[title] }));

  const handleSave = async (title) => {
    const existing = JSON.parse(await AsyncStorage.getItem("savedCareers") || "[]");
    const updated = [...new Set([...existing, title])];
    await AsyncStorage.setItem("savedCareers", JSON.stringify(updated));
    setSavedTitles(updated);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>🔍 {t("explorer.title", "Explore Tech Careers")}</Text>

      <ThreeDButton
        title={t("backHome")}
        onPress={() => navigation.navigate("Main", { screen: "Home" })}
        style={{ backgroundColor: "#6b7280" }}
      />

      <TextInput
        placeholder={t("explorer.search", "Search careers...")}
        placeholderTextColor='#9e9393'
        style={[styles.searchBox, { color: colors.text, borderColor: colors.border }]}
        onChangeText={setQuery}
        value={query}
      />

      {filteredCareers.map((career) => (
        <View key={career.title} style={[styles.card, { backgroundColor: colors.card }]}>
          {/* Watermark */}
          <Image
            source={require("../assets/splash/splash.png")}
            style={styles.watermark}
          />

          {/* Title Badge */}
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
                {career.roles.slice(0, 3).map((r, i) => (
                  <Text key={i} style={styles.skillTag}>{r}</Text>
                ))}
              </View>
            </>
          )}

          <Text style={[styles.label, { color: colors.text }]}>Top Skills:</Text>
          <View style={styles.skillContainer}>
            {career.skills?.map((s, i) => (
              <Text key={i} style={styles.skillTag}>{s}</Text>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Roadmap:</Text>
          {career.roadmap?.slice(0, 17).map((step, i) => (
            <View key={i} style={styles.stepContainer}>
              <Text style={[styles.step, { color: colors.text }]}>• {step.text}</Text>
              <Text style={[styles.stepDifficulty, { color: colors.text }]}>
                {step.difficulty}
              </Text>
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

          <TouchableOpacity
            style={[styles.planButton, { backgroundColor: '#e2af09' }]}
            onPress={() => navigation.navigate('LearningPlan', { career: career.title })}
          >
            <Ionicons name="calendar-outline" size={20} color="white" />
            <Text style={styles.planButtonText}>View Learning Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gapButton, { backgroundColor: '#10B981' }]}
            onPress={() => navigation.navigate('SkillGap', { career: career.title })}
          >
            <Ionicons name="analytics" size={20} color="white" />
            <Text style={styles.gapButtonText}>Analyze Skill Gap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.resumeButton, { backgroundColor: '#065a06' }]}
            onPress={() => navigation.navigate('ResumeBuilder', { career: career.title })}
          >
            <Ionicons name="document-text" size={20} color="white" />
            <Text style={styles.resumeButtonText}>Build Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.projectButton, { backgroundColor: '#8B5CF6' }]}
            onPress={() => navigation.navigate('ProjectIdeas', { career: career.title })}
          >
            <Ionicons name="bulb-outline" size={20} color="white" />
            <Text style={styles.projectButtonText}>Project Ideas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.interviewButton, { backgroundColor: '#EC489A' }]}
            onPress={() => navigation.navigate('MockInterview', { career: career.title })}
          >
            <Ionicons name="chatbubbles-outline" size={20} color="white" />
            <Text style={styles.interviewButtonText}>Mock Interview</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSave(career.title)}
            disabled={savedTitles.includes(career.title)}
            style={[
              styles.saveBtn,
              { backgroundColor: savedTitles.includes(career.title) ? "#9ca3af" : "#4f46e5" },
            ]}
          >
            <Text style={styles.saveText}>
              {savedTitles.includes(career.title)
                ? "✔ Saved"
                : "Save to Dashboard"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  searchBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
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
    top: 0,
    right: 5,
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
    marginTop: 14,
    marginBottom: 6,
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
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
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  stepHours: {
    fontSize: 12,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 8,
    gap: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  planButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  resumeButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  marginBottom: 8,
  gap: 8,
},
resumeButtonText: {
  color: 'white',
  fontSize: 14,
  fontWeight: '600',
},

  gapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  gapButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  link: {
    fontSize: 13,
    textDecorationLine: "underline",
    marginBottom: 3,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
  projectButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  marginBottom: 8,
  gap: 8,
},
interviewButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  marginBottom: 8,
  gap: 8,
},
interviewButtonText: {
  color: 'white',
  fontSize: 14,
  fontWeight: '600',
},
projectButtonText: {
  color: 'white',
  fontSize: 14,
  fontWeight: '600',
},
  stepContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
  flexWrap: 'wrap',
},
stepDifficulty: {
  fontSize: 11,
  fontWeight: '500',
  marginLeft: 8,
  backgroundColor: 'rgba(220, 219, 241, 0.1)',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 4,
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
  //marginBottom: 8,
},
unlockButtonText: {
  color: 'white',
  fontWeight: 'bold',
  marginLeft: 8,
},
link: {
  fontSize: 13,
  marginTop: 4,
  textDecorationLine: 'underline',
  color: '#2563eb',
},
});

export default CareerExplorerScreen;