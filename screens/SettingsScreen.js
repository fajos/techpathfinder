import React, { useContext, useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../utils/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { useTranslation } from "react-i18next";
import { usePremium } from '../context/PremiumContext';
import { Ionicons } from '@expo/vector-icons';
import RevenueCatService from '../services/RevenueCatService';

const SettingsScreen = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const { colors } = useThemeStyles();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);

  const { isPremium, expirationDate, refreshPremiumStatus } = usePremium();

  const availableLanguages = [
    { code: "en", label: "English" },
    { code: "yo", label: "Yorùbá" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
  ];


  const changeLang = async (lang) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem("appLanguage", lang);
    setLanguage(lang);
  };

  useEffect(() => {
    const loadLang = async () => {
      const lang = await AsyncStorage.getItem("appLanguage");
      if (lang) setLanguage(lang);
    };
    loadLang();
  }, []);

  const resetDashboard = async () => {
    await AsyncStorage.removeItem("savedCareers");
    alert(t("resetSuccess", "All saved careers have been cleared."));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>⚙️ {t("settings", "Settings")}</Text>

      {/* 🌙 Dark Mode */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>🌙 {t("darkMode", "Dark Mode")}</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      {/* 🗑 Reset Button */}
      <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={resetDashboard}>
        <Text style={[styles.label, { color: "#dc2626" }]}>🗑 {t("reset", "Reset Saved Careers")}</Text>
      </TouchableOpacity>

      {/* 🔐 Passcode */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate("ChangePasscode")}
      >
        <Text style={[styles.label, { color: colors.text }]}>🔐 {t("changePasscode", "Change Dashboard Passcode")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate('Premium')}
      >
        <Ionicons
          name={isPremium ? "diamond" : "diamond-outline"}
          size={24}
          color={isPremium ? "#FFD700" : colors.text}
        />
        <Text style={[styles.label, { color: colors.text }]}>
          {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={colors.text} />
      </TouchableOpacity>

      {/* ℹ️ About */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate("About")}
      >
        <Text style={[styles.label, { color: colors.text }]}>ℹ️ {t("about", "About This App")}</Text>
      </TouchableOpacity>

      {/* 🌐 Language Selection */}
      <View style={{ marginTop: 24 }}>
        <Text style={[styles.label, { marginBottom: 10, color: colors.text }]}>
          🌍 {t("chooseLanguage", "Choose Language")}:
        </Text>

        {availableLanguages.map(({ code, label }) => {
          const isActive = language === code;

          return (
            <TouchableOpacity
              key={code}
              style={[
                styles.langRow,
                {
                  backgroundColor: isActive ? "#e0e7ff" : "transparent",
                  borderColor: isActive ? "#4f46e5" : "#e5e7eb",
                },
              ]}
              onPress={() => changeLang(code)}
            >
              <Text
                style={[
                  styles.languageText,
                  {
                    fontWeight: isActive ? "bold" : "500",
                    color: isActive ? "#1e3a8a" : colors.text,
                  },
                ]}
              >
                {label} {isActive && "✅"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 🔙 Back to Home */}
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  langRow: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  languageText: {
    fontSize: 14,
  },
});