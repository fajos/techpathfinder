import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from "react-native";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { APP_NAME, VERSION, BUILT_BY, POWERED_BY } from "../constants/appInfo";
import { Ionicons } from "@expo/vector-icons";

const AboutScreen = () => {
  const { colors, wp, hp, normalize, isTablet } = useThemeStyles();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const links = [
    { icon: "globe-outline", text: t("visitDeveloper", "Visit Developer Page"), url: "https://www.linkedin.com/in/femi-adeyemi-30832056/" },
    { icon: "mail-outline", text: t("contactDeveloper", "Contact the Developer"), url: "mailto:fajostech@gmail.com?subject=Feedback on Tech Career App" },
    { icon: "call-outline", text: t("callDeveloper", "Call the Developer"), url: "tel:+2348068319016" },
    { icon: "logo-twitter", text: t("followOnTwitter", "Follow on X/Twitter"), url: "https://x.com/fajostheprince" },
    { icon: "logo-linkedin", text: t("connectOnLinkedIn", "Connect on LinkedIn"), url: "https://www.linkedin.com/in/femi-adeyemi-30832056/" },
    { icon: "logo-github", text: t("viewGitHub", "View GitHub Projects"), url: "https://github.com/fajos?tab=repositories" },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.scrollContent,
        isTablet && { width: wp(75), alignSelf: 'center' }
      ]}
    >
      <View style={[styles.header, { marginBottom: hp(4) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={normalize(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: normalize(20) }]}>{t("about", "About")}</Text>
        <View style={{ width: normalize(24) }} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="rocket" size={normalize(80)} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text, fontSize: normalize(28) }]}>{APP_NAME}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: normalize(16) }]}>
            {t("version", "Version")} {VERSION}
          </Text>
        </View>

        <View style={[styles.infoSection, { marginVertical: hp(3) }]}>
          <Text style={[styles.text, { color: colors.text, fontSize: normalize(14) }]}>
            {t("builtWith", "Built by")} <Text style={{ fontWeight: 'bold' }}>{BUILT_BY}</Text>
          </Text>
          <Text style={[styles.text, { color: colors.text, fontSize: normalize(14) }]}>
            {t("poweredBy", "Powered by")} <Text style={{ fontWeight: 'bold' }}>{POWERED_BY}</Text>
          </Text>
        </View>

        <View style={styles.linksContainer}>
          {links.map((link, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => Linking.openURL(link.url)}
              style={[styles.linkItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Ionicons name={link.icon} size={normalize(20)} color={colors.primary} />
              <Text style={[styles.linkText, { color: colors.text, fontSize: normalize(15) }]}>
                {link.text}
              </Text>
              <Ionicons name="chevron-forward" size={normalize(18)} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 8,
  },
  infoSection: {
    alignItems: 'center',
  },
  text: {
    marginBottom: 6,
    textAlign: "center",
  },
  linksContainer: {
    width: '100%',
    marginTop: 10,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  linkText: {
    flex: 1,
    marginLeft: 12,
    fontWeight: '500',
  },
});
