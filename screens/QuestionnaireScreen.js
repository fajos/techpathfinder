import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../utils/ThemeContext";
import useNetworkStatus from "../hooks/useNetworkStatus";
import NetworkBanner from "../components/NetworkBanner";
import ThreeDButton from "../components/ThreeDButton";
import { SafeAreaView } from 'react-native-safe-area-context';

const QuestionnaireScreen = ({ navigation }) => {
  const [answers, setAnswers] = useState({});
  const { t } = useTranslation();
  const { isDark } = useContext(ThemeContext);
  const isConnected = useNetworkStatus();

  const questions = t("questionnaire.questions", { returnObjects: true });

  const handleSelect = (questionId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = () => {
    navigation.navigate("Result", { answers });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: isDark ? "#111827" : "#F8F8FF" },
        ]}
      >
        <NetworkBanner isConnected={isConnected} />

        <Text style={[styles.heading, { color: isDark ? "#f9fafb" : "#111827" }]}>
          {t("title")}
        </Text>

        {questions.map((q, index) => {
          const questionId = index + 1;

          return (
            <View
              key={questionId}
              style={[
                styles.questionBox,
                {
                  backgroundColor: isDark ? "#1f2937" : "#ffffff",
                  borderColor: isDark ? "#374151" : "#e5e7eb",
                },
              ]}
            >
              <Text
                style={[
                  styles.questionText,
                  { color: isDark ? "#f9fafb" : "#111827" },
                ]}
              >
                {`${questionId}. ${t(q.q)}`}
              </Text>

              <View style={styles.optionsContainer}>
                {q.options.map((optionKey, i) => {
                  const selected = answers[questionId] === optionKey;

                  return (
                    <TouchableOpacity
                      key={`${questionId}_${i}`}
                      onPress={() => handleSelect(questionId, optionKey)}
                      style={[
                        styles.option,
                        {
                          backgroundColor: selected
                            ? isDark
                              ? "#6366f1"
                              : "#3b82f6"
                            : isDark
                            ? "#374151"
                            : "#f3f4f6",
                          borderColor: selected
                            ? isDark
                              ? "#4f46e5"
                              : "#2563eb"
                            : isDark
                            ? "#4b5563"
                            : "#e5e7eb",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: selected ? "#fff" : isDark ? "#f3f4f6" : "#111827",
                          fontSize: 14,
                          fontWeight: selected ? "700" : "500",
                        }}
                      >
                        {t(optionKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {Object.keys(answers).length === questions.length && (
        <ThreeDButton
          title={t("submit")}
          onPress={handleSubmit}
          gradient
        />
      )}
    </SafeAreaView>
  );
};

export default QuestionnaireScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  questionBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 14,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginBottom: 8,
    marginRight: 8,
  },
  submitBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderColor: "#d1d5db",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});