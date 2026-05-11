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
import { useTranslation } from "react-i18next";
import { styles3D } from "../styles/globalStyles";
import careerRoadmapsFull from "../data/careerRoadmapsFull";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePremium } from '../context/PremiumContext';

const ResultTabScreen = () => {
  const { isDark, colors } = useThemeStyles();
  const [results, setResults] = useState([]);
  const isConnected = useNetworkStatus();
  const [savedTitles, setSavedTitles] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const { isPremium } = usePremium();

  const navigation = useNavigation();
  const showPremiumFeatures = isPremium;

  const openModal = (career) => {
    setSelectedCareer(career);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedCareer(null);
    setModalVisible(false);
  };

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
        <Text style={[styles.emptyText, { color: colors.text }]}>
          📭 {t("resultTab.empty")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false} >
      <NetworkBanner isConnected={isConnected} />
      {!isConnected && <OfflineBanner />}

      <Text style={[styles.screenTitle, { color: colors.text }]}>
        🎯 {t("resultTab.title")}
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
              {/* ✅ Watermark inside card */}
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

              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                <View
                  style={{
                    backgroundColor: "#e0e7ff",
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{careerEmojis[career.title] || "💼"}</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginLeft: 8,
                      color: "#1e3a8a",
                    }}
                  >
                    {career.title}
                  </Text>
                  
                </View>
              </View>
              {career.intro && (
                <Text style={{ marginBottom: 8, fontStyle: "italic", color: colors.text }}>
                  {career.intro}
                </Text>
              )}

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

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills:</Text>
              <View style={styles.skillContainer}>
                {career.skills?.map((skill, index) => (
                  <Text key={index} style={[styles.skillTag, { backgroundColor: colors.primary + '20', color: colors.primary }]}>
                    {skill}
                  </Text>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Roadmap:</Text>
              {career.roadmap?.map((step, index) => {
                const stepText = typeof step === 'object' ? step.text : step;
                const stepDifficulty = typeof step === 'object' ? step.difficulty : null;
                return (
                  <View key={index} style={styles.stepContainer}>
                    <Text style={[styles.stepText, { color: colors.text }]}>
                      • {stepText}
                    </Text>
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

              <TouchableOpacity
                onPress={() => handleSaveSingle(career.title)}
                disabled={isSaved}
                style={[
                  styles3D.button,
                  { backgroundColor: isSaved ? "#9ca3af" : "#4f46e5" },
                ]}
              >
                <Text style={styles3D.buttonText}>
                  {isSaved ? `✔ ${t("dashboard.saved")}` : t("dashboard.saveToDashboard")}
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
    padding: 16,
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 16,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
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
    //marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    overflow: "hidden",
  },
  sectionTitle: {
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
    fontSize: 15,
    marginTop: 16,
  },
  smallText: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 7,
    marginBottom: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    fontSize: 13,
    marginTop: 2,
    textDecorationLine: "underline",
    color: "#2563eb",
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
  marginTop: 10,
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
scrollContent: {
  //padding: 16,
  paddingBottom: 60,
  flexGrow: 1,
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
  stepContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
  flexWrap: 'wrap',
},
unlockButton: {
  flexDirection: 'row',
  backgroundColor: '#4f46e5',
  padding: 10,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 8,
  marginBottom: 8,
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

export default ResultTabScreen;