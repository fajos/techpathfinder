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
  const { colors, isDark, wp, hp, normalize, isTablet } = useThemeStyles();
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        { padding: wp(4) },
        isTablet ? { alignSelf: 'center', width: wp(80) } : null
      ]}
    >
      <Text style={[styles.title, { color: colors.text, fontSize: normalize(24), marginTop: hp(2), marginBottom: hp(2) }]}>🔍 Explore Tech Careers</Text>

      <ThreeDButton
        title="Home"
        onPress={() => navigation.navigate("Main", { screen: "Home" })}
        style={{ backgroundColor: "#6b7280" }}
      />

      <TextInput
        placeholder="Search careers..."
        placeholderTextColor={colors.textSecondary}
        style={[styles.searchBox, {
          color: colors.text,
          borderColor: colors.border,
          backgroundColor: colors.card,
          marginTop: hp(1.5),
          padding: normalize(12),
          fontSize: normalize(16),
          borderRadius: normalize(12)
        }]}
        onChangeText={setQuery}
        value={query}
      />

      {filteredCareers.map((career) => (
        <View key={career.title} style={[styles.card, {
          backgroundColor: colors.card,
          borderRadius: normalize(16),
          padding: normalize(18),
          marginBottom: hp(2.5)
        }]}>
          {/* Watermark */}
          <Image
            source={require("../assets/splash/splash.png")}
            style={[styles.watermark, { width: normalize(70), height: normalize(70), borderRadius: normalize(35) }]}
          />

          {/* Title Badge */}
          <View style={[styles.badgeRow, { marginBottom: hp(1.5) }]}>
            <View style={[styles.titleBadge, {
              backgroundColor: isDark ? "#4f46e520" : "#e0e7ff",
              paddingVertical: hp(0.75),
              paddingHorizontal: wp(3),
              borderRadius: normalize(20)
            }]}>
              <Text style={[styles.emoji, { fontSize: normalize(18) }]}>{careerEmojis[career.title] || "💼"}</Text>
              <Text style={[styles.badgeText, { color: isDark ? "#c7d2fe" : "#1e3a8a", fontSize: normalize(16), marginLeft: wp(2) }]}>
                {career.title}
              </Text>
            </View>
          </View>

          {career.intro && (
            <Text style={[styles.intro, { color: colors.textSecondary, fontSize: normalize(14), marginBottom: hp(1.5), lineHeight: normalize(20) }]}>{career.intro}</Text>
          )}

          {career.roles?.length > 0 && (
            <>
              <Text style={[styles.label, { color: colors.text, fontSize: normalize(15), marginBottom: hp(1) }]}>Roles:</Text>
              <View style={[styles.skillContainer, { gap: wp(2), marginBottom: hp(1.5) }]}>
                {career.roles.slice(0, 3).map((r, i) => (
                  <Text key={i} style={[
                    styles.skillTag,
                    {
                      backgroundColor: isDark ? "#374151" : "#e0e7ff",
                      color: isDark ? "#c7d2fe" : "#1e3a8a",
                      fontSize: normalize(12),
                      paddingHorizontal: wp(2.5),
                      paddingVertical: hp(0.5),
                      borderRadius: normalize(999)
                    }
                  ]}>{r}</Text>
                ))}
              </View>
            </>
          )}

          <Text style={[styles.label, { color: colors.text, fontSize: normalize(15), marginBottom: hp(1) }]}>Top Skills:</Text>
          <View style={[styles.skillContainer, { gap: wp(2), marginBottom: hp(1.5) }]}>
            {career.skills?.map((s, i) => (
              <Text key={i} style={[
                styles.skillTag,
                {
                  backgroundColor: isDark ? "#374151" : "#e0e7ff",
                  color: isDark ? "#c7d2fe" : "#1e3a8a",
                  fontSize: normalize(12),
                  paddingHorizontal: wp(2.5),
                  paddingVertical: hp(0.5),
                  borderRadius: normalize(999)
                }
              ]}>{s}</Text>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text, marginTop: hp(2), fontSize: normalize(15), marginBottom: hp(1) }]}>Roadmap:</Text>
          {career.roadmap?.slice(0, 8).map((step, i) => (
            <View key={i} style={[styles.stepContainer, { marginBottom: hp(0.75) }]}>
              <Text style={[styles.step, { color: colors.text, fontSize: normalize(14), lineHeight: normalize(20) }]}>• {step.text}</Text>
              <Text style={[
                styles.stepDifficulty,
                {
                  backgroundColor: isDark ? "#4f46e520" : "#e0e7ff",
                  color: colors.primary,
                  fontSize: normalize(11),
                  marginLeft: wp(2),
                  paddingHorizontal: wp(1.5),
                  paddingVertical: hp(0.25),
                  borderRadius: normalize(6)
                }
              ]}>
                {step.difficulty}
              </Text>
            </View>
          ))}
          {career.roadmap?.length > 8 && (
            <Text style={[styles.moreSteps, { color: colors.textSecondary, fontSize: normalize(12), marginTop: hp(0.5) }]}>
              + {career.roadmap.length - 8} more steps
            </Text>
          )}

          {career.resources?.length > 0 && (
            <>
              <View style={[styles.sectionHeader, { marginTop: hp(1), marginBottom: hp(0.5) }]}>
                <Text style={[styles.label, { color: colors.text, fontSize: normalize(15) }]}>Resources:</Text>
                {!isPremium && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Premium')}
                    style={[styles.premiumBadge, { backgroundColor: colors.primary, paddingHorizontal: wp(2), paddingVertical: hp(0.5), borderRadius: normalize(12), gap: wp(1) }]}
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
                    style={[styles.link, { color: colors.primary, fontSize: normalize(13), marginTop: hp(0.5) }]}
                    onPress={() => Linking.openURL(link)}
                  >
                    🔗 {link}
                  </Text>
                ))
              ) : (
                <>
                  <Text style={[styles.previewText, { color: colors.textSecondary, marginTop: hp(0.5) }]}>
                    {career.resources.slice(0, 1).map((link) => (
                      <Text key={link} style={[styles.link, { color: colors.primary, fontSize: normalize(13) }]}>
                        🔗 {link.substring(0, 40)}...\n
                      </Text>
                    ))}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Premium')}
                    style={[styles.unlockButton, { backgroundColor: colors.primary, padding: normalize(10), borderRadius: normalize(8), marginTop: hp(1), gap: wp(2) }]}
                  >
                    <Ionicons name="lock-open" size={normalize(20)} color="white" />
                    <Text style={[styles.unlockButtonText, { fontSize: normalize(14) }]}>Unlock All Resources</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          <View style={[styles.buttonGrid, { marginTop: hp(2), marginBottom: hp(1) }]}>
            <TouchableOpacity
              style={[styles.premiumButton, { backgroundColor: '#0d9488', paddingVertical: hp(1.5), borderRadius: normalize(10), marginBottom: hp(1), gap: wp(2) }]}
              onPress={() => navigation.navigate('LearningPlan', { career: career.title })}
            >
              <Ionicons name="calendar-outline" size={normalize(18)} color="white" />
              <Text style={[styles.buttonText, { fontSize: normalize(14) }]}>Learning Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.premiumButton, { backgroundColor: '#10B981', paddingVertical: hp(1.5), borderRadius: normalize(10), marginBottom: hp(1), gap: wp(2) }]}
              onPress={() => navigation.navigate('SkillGap', { career: career.title })}
            >
              <Ionicons name="analytics" size={normalize(18)} color="white" />
              <Text style={[styles.buttonText, { fontSize: normalize(14) }]}>Skill Gap</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.premiumButton, { backgroundColor: '#8B5CF6', paddingVertical: hp(1.5), borderRadius: normalize(10), marginBottom: hp(1), gap: wp(2) }]}
              onPress={() => navigation.navigate('ProjectIdeas', { career: career.title })}
            >
              <Ionicons name="bulb-outline" size={normalize(18)} color="white" />
              <Text style={[styles.buttonText, { fontSize: normalize(14) }]}>Projects</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.premiumButton, { backgroundColor: '#EC489A', paddingVertical: hp(1.5), borderRadius: normalize(10), marginBottom: hp(1), gap: wp(2) }]}
              onPress={() => navigation.navigate('MockInterview', { career: career.title })}
            >
              <Ionicons name="chatbubbles-outline" size={normalize(18)} color="white" />
              <Text style={[styles.buttonText, { fontSize: normalize(14) }]}>Interview</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.premiumButton, { backgroundColor: '#F59E0B', paddingVertical: hp(1.5), borderRadius: normalize(10), marginBottom: hp(1), gap: wp(2) }]}
              onPress={() => navigation.navigate('ResumeBuilder', { career: career.title })}
            >
              <Ionicons name="document-text" size={normalize(18)} color="white" />
              <Text style={[styles.buttonText, { fontSize: normalize(14) }]}>Resume</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => handleSave(career.title)}
            disabled={savedTitles.includes(career.title)}
            style={[
              styles.saveBtn,
              {
                backgroundColor: savedTitles.includes(career.title) ? (isDark ? "#4b5563" : "#9ca3af") : colors.primary,
                paddingVertical: hp(1.75),
                borderRadius: normalize(10),
                marginBottom: hp(1.75)
              },
            ]}
          >
            <Text style={[styles.saveText, { fontSize: normalize(14) }]}>
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