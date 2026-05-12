// screens/QuestionnaireScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useThemeStyles } from "../hooks/useThemeStyles";
import useNetworkStatus from "../hooks/useNetworkStatus";
import NetworkBanner from "../components/NetworkBanner";
import ThreeDButton from "../components/ThreeDButton";
import { SafeAreaView } from 'react-native-safe-area-context';
import { trackScreen } from "../services/analytics";

const QuestionnaireScreen = ({ navigation }) => {
  const [answers, setAnswers] = useState({});
  const { colors, isDark } = useThemeStyles();
  const isConnected = useNetworkStatus();

  useEffect(() => {
  trackScreen('QuestionnaireScreen');
}, []);

  // Your original questions - hardcoded in English (since removing i18n)
  const questions = [
    {
      q: "What kind of problems do you enjoy solving?",
      options: [
        "Building apps or tools",
        "Designing things that look great",
        "Helping people fix their tech",
        "Understanding how systems work",
        "Finding security flaws or risks",
        "Organizing data to get insights"
      ]
    },
    {
      q: "Which of these sounds most exciting to you?",
      options: [
        "Creating a mobile app",
        "Training an AI model",
        "Designing user interfaces",
        "Working with hardware or devices",
        "Automating repetitive tasks",
        "Managing cloud infrastructure"
      ]
    },
    {
      q: "What would you like to learn more about?",
      options: [
        "Cloud services (AWS, Azure, GCP)",
        "Cybersecurity and ethical hacking",
        "No-code tools and automation",
        "Programming languages",
        "Designing digital products",
        "Analyzing or visualizing data"
      ]
    },
    {
      q: "Which of these tools or platforms have you heard of or used?",
      options: [
        "Figma or Canva",
        "Python or JavaScript",
        "SQL or Excel or Google Sheets",
        "Unity or Unreal Engine",
        "ChatGPT or AI tools",
        "Bubble, Glide, or Zapier",
        "Agile or Scrum"
      ]
    },
    {
      q: "How do you prefer to work?",
      options: [
        "Alone solving deep problems",
        "In teams building big products",
        "Helping users and customers",
        "Designing beautiful interfaces",
        "Exploring and analyzing data",
        "Automating systems and workflows"
      ]
    },
    {
      q: "Which of these do you find most interesting?",
      options: [
        "Machine learning and AI",
        "Website or app development",
        "System administration",
        "Data analysis and charts",
        "Blockchain or crypto tech",
        "Voice assistants and smart devices"
      ]
    },
    {
      q: "Which statement best describes you?",
      options: [
        "I like solving puzzles or coding challenges",
        "I enjoy storytelling and making things simple",
        "I'm very organized and like to plan and manage",
        "I like drawing, designing, and prototyping",
        "I enjoy working with devices, gadgets, or circuits",
        "I love exploring new tech like AI, AR, or VR"
      ]
    },
    {
      q: "If given a week to explore, what would you do?",
      options: [
        "Build a website or blog",
        "Design an app interface",
        "Create an AI chatbot",
        "Analyze data from a spreadsheet",
        "Fix a broken laptop or troubleshoot Wi-Fi",
        "Create a game or animation"
      ]
    },
    {
      q: "What industries or domains are you most curious about?",
      options: [
        "Health, finance, or education",
        "Gaming and interactive media",
        "Cybersecurity and privacy",
        "Startups and digital products",
        "IoT, robotics, and automation",
        "Marketing and digital content"
      ]
    },
    {
      q: "How comfortable are you with technical concepts right now?",
      options: [
        "Very new to tech",
        "Some familiarity, still learning",
        "Intermediate — I’ve built a few things",
        "Comfortable with coding",
        "I’m more visual or creative",
        "I prefer managing people or systems"
      ]
    }
  ];

  const handleSelect = (questionId, optionText) => {
  setAnswers((prev) => ({ ...prev, [questionId]: optionText }));
};

  const handleSubmit = () => {
    navigation.navigate("Result", { answers });
  };

  const isComplete = Object.keys(answers).length === questions.length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <NetworkBanner isConnected={isConnected} />

        <Text style={[styles.heading, { color: colors.text }]}>
          🚀 Discover Your Tech Career Path
        </Text>

        <Text style={[styles.subheading, { color: colors.textSecondary }]}>
          Answer these 10 questions to find your ideal career match
        </Text>

        {questions.map((q, index) => {
          const questionId = index + 1;

          return (
            <View
              key={questionId}
              style={[
                styles.questionBox,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.questionText,
                  { color: colors.text },
                ]}
              >
                {`${questionId}. ${q.q}`}
              </Text>

              <View style={styles.optionsContainer}>
                {q.options.map((option, optIndex) => {
                  const selected = answers[questionId] === option; // Compare text, not index

                  return (
                    <TouchableOpacity
                      key={`${questionId}_${optIndex}`}
                      onPress={() => handleSelect(questionId, option)} // Pass the actual option text
                      style={[
                        styles.option,
                        {
                          backgroundColor: selected
                            ? colors.primary
                            : isDark
                              ? "#374151"
                              : "#f3f4f6",
                          borderColor: selected ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: selected ? "#fff" : colors.text,
                          fontSize: 14,
                          fontWeight: selected ? "700" : "500",
                        }}
                      >
                        {option}
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

      {isComplete && (
        <View style={[styles.submitContainer, { backgroundColor: colors.background }]}>
          <ThreeDButton
            title="🎯 Show My Career Path"
            onPress={handleSubmit}
            gradient
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default QuestionnaireScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  subheading: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  questionBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 14,
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  option: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    marginBottom: 8,
    marginRight: 8,
  },
  submitContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 0,
  },
});