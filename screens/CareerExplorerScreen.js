// screens/CareerExplorerScreen.js
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
import careerEmojis from "../data/careerEmojis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ThreeDButton from "../components/ThreeDButton";
import { Ionicons } from '@expo/vector-icons';
import { usePremium } from '../context/PremiumContext';
import { trackScreen } from '../services/analytics';

const CareerExplorerScreen = () => {
  const { colors, isDark } = useThemeStyles();
  const [query, setQuery] = useState("");
  const [savedTitles, setSavedTitles] = useState([]);
  const navigation = useNavigation();

  const { isPremium } = usePremium();



  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("savedCareers");
      if (saved) setSavedTitles(JSON.parse(saved));
    };
    load();
  }, []);

  useEffect(() => {
  trackScreen('CareerExplorerScreen');
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
      <Text style={[styles.title, { color: colors.text }]}>🔍 Explore Tech Careers</Text>

      <ThreeDButton
        title="Home"
        onPress={() => navigation.navigate("Main", { screen: "Home" })}
        style={{ backgroundColor: "#6b7280" }}
      />

      <TextInput
        placeholder="Search careers..."
        placeholderTextColor={colors.textSecondary}
        style={[styles.searchBox, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card, marginTop: 10 }]}
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
            <View style={[styles.titleBadge, { backgroundColor: isDark ? "#4f46e520" : "#e0e7ff" }]}>
              <Text style={styles.emoji}>{careerEmojis[career.title] || "💼"}</Text>
              <Text style={[styles.badgeText, { color: isDark ? "#c7d2fe" : "#1e3a8a" }]}>
                {career.title}
              </Text>
            </View>
          </View>

          {career.intro && (
            <Text style={[styles.intro, { color: colors.textSecondary }]}>{career.intro}</Text>
          )}

          {career.roles?.length > 0 && (
            <>
              <Text style={[styles.label, { color: colors.text }]}>Roles:</Text>
              <View style={styles.skillContainer}>
                {career.roles.slice(0, 3).map((r, i) => (
                  <Text key={i} style={[
                    styles.skillTag,
                    { backgroundColor: isDark ? "#374151" : "#e0e7ff", color: isDark ? "#c7d2fe" : "#1e3a8a" }
                  ]}>{r}</Text>
                ))}
              </View>
            </>
          )}

          <Text style={[styles.label, { color: colors.text }]}>Top Skills:</Text>
          <View style={styles.skillContainer}>
            {career.skills?.map((s, i) => (
              <Text key={i} style={[
                styles.skillTag,
                { backgroundColor: isDark ? "#374151" : "#e0e7ff", color: isDark ? "#c7d2fe" : "#1e3a8a" }
              ]}>{s}</Text>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>Roadmap:</Text>
          {career.roadmap?.slice(0, 8).map((step, i) => (
            <View key={i} style={styles.stepContainer}>
              <Text style={[styles.step, { color: colors.text }]}>• {step.text}</Text>
              <Text style={[
                styles.stepDifficulty,
                { backgroundColor: isDark ? "#4f46e520" : "#e0e7ff", color: colors.primary }
              ]}>
                {step.difficulty}
              </Text>
            </View>
          ))}
          {career.roadmap?.length > 8 && (
            <Text style={[styles.moreSteps, { color: colors.textSecondary }]}>
              + {career.roadmap.length - 8} more steps
            </Text>
          )}

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

          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={[styles.premiumButton, { backgroundColor: '#0d9488' }]}
              onPress={() => navigation.navigate('LearningPlan', { career: career.title })}
            >
              <Ionicons name="calendar-outline" size={18} color="white" />
              <Text style={styles.buttonText}>Learning Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.premiumButton, { backgroundColor: '#10B981' }]}
              onPress={() => navigation.navigate('SkillGap', { career: career.title })}
            >
              <Ionicons name="analytics" size={18} color="white" />
              <Text style={styles.buttonText}>Skill Gap</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.premiumButton, { backgroundColor: '#8B5CF6' }]}
              onPress={() => navigation.navigate('ProjectIdeas', { career: career.title })}
            >
              <Ionicons name="bulb-outline" size={18} color="white" />
              <Text style={styles.buttonText}>Projects</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.premiumButton, { backgroundColor: '#EC489A' }]}
              onPress={() => navigation.navigate('MockInterview', { career: career.title })}
            >
              <Ionicons name="chatbubbles-outline" size={18} color="white" />
              <Text style={styles.buttonText}>Interview</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.premiumButton, { backgroundColor: '#F59E0B' }]}
              onPress={() => navigation.navigate('ResumeBuilder', { career: career.title })}
            >
              <Ionicons name="document-text" size={18} color="white" />
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => handleSave(career.title)}
            disabled={savedTitles.includes(career.title)}
            style={[
              styles.saveBtn,
              { backgroundColor: savedTitles.includes(career.title) ? (isDark ? "#4b5563" : "#9ca3af") : colors.primary },
            ]}
          >
            <Text style={styles.saveText}>
              {savedTitles.includes(career.title) ? "✔ Saved" : "Save to Dashboard"}
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
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  searchBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
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
    opacity: 0.3,
    borderRadius: 35,
    top: 0,
    right: 5,
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
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  step: {
    fontSize: 14,
    lineHeight: 20,
  },
  stepDifficulty: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
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
    marginBottom: 3,
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
  },
  unlockButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonGrid: {
    marginTop: 16,
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
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CareerExplorerScreen;