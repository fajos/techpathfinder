import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { APP_NAME, VERSION, BUILT_BY, POWERED_BY } from "../constants/appInfo";

const AboutScreen = () => {
  const { colors } = useThemeStyles();
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 🔙 Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← {t("back", "Back")}</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>{APP_NAME}</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>
        {t("version", "Version")} {VERSION}
      </Text>

      <Text style={[styles.text, { color: colors.text }]}>
        {t("builtWith", "Built with ❤️ by")} {BUILT_BY}
      </Text>
      <Text style={[styles.text, { color: colors.text }]}>
        {t("poweredBy", "Powered by")} {POWERED_BY}
      </Text>

      <TouchableOpacity onPress={() => Linking.openURL("https://www.linkedin.com/in/femi-adeyemi-30832056/")}>
        <Text style={[styles.link, { color: "#3b82f6" }]}>
          🌐 {t("visitDeveloper", "Visit Developer Page")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL("mailto:orjidom@yahoo.com?subject=Feedback on Tech Career App")}>
        <Text style={[styles.link, { color: "#3b82f6" }]}>
          📧 {t("contactDeveloper", "Contact the Developer")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL("tel:+2348068319016")}>
  <Text style={[styles.link, { color: "#3b82f6" }]}>
    📞 {t("callDeveloper", "Call the Developer")}
  </Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => Linking.openURL("https://x.com/fajostheprince")}>
  <Text style={[styles.link, { color: "#3b82f6" }]}>
    🐦 {t("followOnTwitter", "Follow on X/Twitter")}
  </Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => Linking.openURL("https://www.linkedin.com/in/femi-adeyemi-30832056/")}>
  <Text style={[styles.link, { color: "#3b82f6" }]}>
    💼 {t("connectOnLinkedIn", "Connect on LinkedIn")}
  </Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => Linking.openURL("https://github.com/fajos?tab=repositories")}>
  <Text style={[styles.link, { color: "#3b82f6" }]}>
    💻 {t("viewGitHub", "View GitHub Projects")}
  </Text>
</TouchableOpacity>

    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  link: {
    fontSize: 15,
    marginTop: 20,
    textDecorationLine: "underline",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#d1d5db",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    zIndex: 99,
  },
  backText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
});