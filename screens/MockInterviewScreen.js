// screens/MockInterviewScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
  TextInput,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useAudioRecorder,
  useAudioPlayer,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import { useAuth } from '../context/AuthContext';
import { usePremium } from '../context/PremiumContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { getQuestionsForCareer, getQuestionCategories } from '../data/interviewQuestions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trackScreen, trackEvent } from '../services/analytics';

export default function MockInterviewScreen({ route, navigation }) {
  const { career } = route.params;
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const { colors } = useThemeStyles();

  const [questions, setQuestions] = useState({ behavioral: [], technical: [] });
  const [selectedCategory, setSelectedCategory] = useState('behavioral');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [favorites, setFavorites] = useState([]);
 
  const [playback, setPlayback] = useState(null);
  
  const [userAnswer, setUserAnswer] = useState('');
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [recording, setRecording] = useState(null);
const [isRecording, setIsRecording] = useState(false);
const [recordedUri, setRecordedUri] = useState(null);
const [sound, setSound] = useState(null);
const [isPlaying, setIsPlaying] = useState(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [player, setPlayer] = useState(null);
  const audioPlayer = useAudioPlayer();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadQuestions();
    loadFavorites();
  }, [career]);

useEffect(() => {
  trackScreen('MockInterviewScreen');
  trackEvent('feature_used', { 
    feature: 'mock_interview', 
    career: career
  });
}, [career]);

  const loadQuestions = () => {
    const careerQuestions = getQuestionsForCareer(career);

    // Safety check: ensure careerQuestions exists with required arrays
    if (!careerQuestions || !careerQuestions.behavioral || !careerQuestions.technical) {
      console.warn('No questions found for career:', career);
      // Provide fallback questions
      setQuestions({
        behavioral: [
          {
            id: "fallback_behavioral_1",
            question: "Tell me about yourself.",
            category: "Introduction",
            sampleAnswer: "I'm passionate about technology and have been working in this field for [X] years. I specialize in [area] and enjoy solving complex problems.",
            tips: "Keep it concise and relevant to the role."
          },
          {
            id: "fallback_behavioral_2",
            question: "Why are you interested in this role?",
            category: "Motivation",
            sampleAnswer: "I'm excited about this role because it aligns with my skills in [skills] and passion for [area]. I've been following your company's work in [field].",
            tips: "Show you've done research on the company."
          }
        ],
        technical: [
          {
            id: "fallback_technical_1",
            question: "How do you stay updated with the latest technologies?",
            category: "Learning",
            sampleAnswer: "I follow industry blogs, take online courses, and build side projects to experiment with new technologies.",
            tips: "Show your passion for continuous learning."
          }
        ]
      });

      if (careerQuestions.behavioral && careerQuestions.behavioral.length > 0) {
        setCurrentQuestion(careerQuestions.behavioral[0]);
      } else {
        setCurrentQuestion({
          id: "fallback_behavioral_1",
          question: "Tell me about yourself.",
          category: "Introduction",
          sampleAnswer: "I'm passionate about technology and have been working in this field for [X] years.",
          tips: "Keep it concise and relevant to the role."
        });
      }
      setLoading(false);
      return;
    }

    setQuestions(careerQuestions);
    if (careerQuestions.behavioral.length > 0) {
      setCurrentQuestion(careerQuestions.behavioral[0]);
    }
    setLoading(false);

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      })
    ]).start();
  };

  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem(`favorite_questions_${user?.uid || 'anonymous'}`);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (questionId) => {
    const updated = favorites.includes(questionId)
      ? favorites.filter(id => id !== questionId)
      : [...favorites, questionId];

    setFavorites(updated);
    await AsyncStorage.setItem(
      `favorite_questions_${user?.uid || 'anonymous'}`,
      JSON.stringify(updated)
    );
  };

  const nextQuestion = () => {
    const currentList = selectedCategory === 'behavioral'
      ? questions.behavioral
      : questions.technical;

    const currentIndex = currentList.findIndex(q => q.id === currentQuestion?.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < currentList.length) {
      setCurrentQuestion(currentList[nextIndex]);
      setShowAnswer(false);
      setUserAnswer('');
      setRecordedUri(null);
    } else {
      Alert.alert('Great job!', 'You\'ve completed all questions. Keep practicing to improve!');
    }
  };

  const previousQuestion = () => {
    const currentList = selectedCategory === 'behavioral'
      ? questions.behavioral
      : questions.technical;

    const currentIndex = currentList.findIndex(q => q.id === currentQuestion?.id);
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      setCurrentQuestion(currentList[prevIndex]);
      setShowAnswer(false);
      setUserAnswer('');
      setRecordedUri(null);
    }
  };

  // Start Recording - Updated for expo-audio
 // Start Recording
const startRecording = async () => {
  try {
    // Request permissions
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission needed', 'Please allow microphone access to record answers.');
      return;
    }

    // Set audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    // Ensure any existing recording is cleaned up
    if (recording) {
      await recording.stopAndUnloadAsync().catch(console.error);
      setRecording(null);
    }

    // Create new recording
    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    
    setRecording(newRecording);
    setIsRecording(true);
  } catch (error) {
    console.error('Failed to start recording:', error);
    Alert.alert('Error', 'Could not start recording. Please try again.');
  }
};

// Stop Recording
const stopRecording = async () => {
    trackEvent('interview_answer_recorded', {
    career: career,
    question_category: currentQuestion?.category
  });
  if (!recording) {
    console.warn('No active recording to stop');
    setIsRecording(false);
    return;
  }

  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    if (uri) {
      setRecordedUri(uri);
    }
    
    // Clear the recording reference
    setRecording(null);
    setIsRecording(false);
  } catch (error) {
    console.error('Failed to stop recording:', error);
    Alert.alert('Error', 'Could not stop recording. Please try again.');
  }
};

// Play Recording
const playRecording = async () => {
  if (!recordedUri) {
    Alert.alert('No Recording', 'Please record your answer first.');
    return;
  }

  try {
    // Clean up any existing sound
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }

    // Create and play new sound
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: recordedUri },
      { shouldPlay: true }
    );

    setSound(newSound);
    setIsPlaying(true);

    // Listen for playback completion
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  } catch (error) {
    console.error('Failed to play recording:', error);
    Alert.alert('Error', 'Could not play recording.');
  }
};
const stopPlayback = async () => {
  if (sound) {
    try {
      await sound.pauseAsync();
      setIsPlaying(false);
    } catch (error) {
      console.error('Failed to stop playback:', error);
    }
  }
};


// Cleanup (only for recorder)
useEffect(() => {
  return () => {
    // Clean up recording
    if (recording) {
      recording.stopAndUnloadAsync().catch(console.error);
    }
    // Clean up sound
    if (sound) {
      sound.unloadAsync().catch(console.error);
    }
  };
}, []);

  // Premium gate
  if (!isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Ionicons name="lock-closed" size={60} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, textAlign: 'center', marginTop: 20 }]}>
          Mock Interviews
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginVertical: 20 }]}>
          Practice real interview questions with sample answers, record your responses, and track your progress.
        </Text>
        <TouchableOpacity
          style={[styles.upgradeButton, { backgroundColor: '#4d31f1' }]}
          onPress={() => navigation.navigate('Premium')}
        >
          <Text style={styles.upgradeButtonText}>View Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const currentList = selectedCategory === 'behavioral'
    ? questions.behavioral
    : questions.technical;

  const currentIndex = currentQuestion ? currentList.findIndex(q => q.id === currentQuestion.id) : 0;
  const isFavorite = currentQuestion ? favorites.includes(currentQuestion.id) : false;

  return (
    <Animated.View style={[
      styles.container,
      { backgroundColor: colors.background },
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mock Interview</Text>
        <TouchableOpacity onPress={() => setShowPracticeModal(true)}>
          <Ionicons name="mic-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Career Info */}
      <View style={[styles.careerCard, { backgroundColor: colors.card }]}>
        <Ionicons name="chatbubbles-outline" size={24} color={colors.text} />
        <Text style={[styles.careerName, { color: colors.text }]}>{career}</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabs}>
        {getQuestionCategories().map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.tab,
              selectedCategory === cat && styles.activeTab,
              { borderBottomColor: selectedCategory === cat ? colors.text : 'transparent' }
            ]}
            onPress={() => {
              setSelectedCategory(cat);
              const newList = cat === 'behavioral' ? questions.behavioral : questions.technical;
              if (newList.length > 0) {
                setCurrentQuestion(newList[0]);
              }
              setShowAnswer(false);
            }}
          >
            <Text style={[
              styles.tabText,
              { color: selectedCategory === cat ? colors.text : colors.text }
            ]}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Question Counter */}
      <Text style={[styles.counter, { color: colors.text }]}>
        Question {currentIndex + 1} of {currentList.length}
      </Text>

      {/* Question Card */}
      <View style={[styles.questionCard, { backgroundColor: colors.card }]}>
        <View style={styles.questionHeader}>
          <Text style={[styles.categoryBadge, { color: colors.text, borderColor: colors.text }]}>
            {currentQuestion?.category}
          </Text>
          <TouchableOpacity onPress={() => toggleFavorite(currentQuestion?.id)}>
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={22}
              color={isFavorite ? '#FFD700' : colors.text}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.questionText, { color: colors.text }]}>
          {currentQuestion?.question}
        </Text>

        <TouchableOpacity
          style={styles.showAnswerButton}
          onPress={() => setShowAnswer(!showAnswer)}
        >
          <Text style={{ color: colors.text }}>
            {showAnswer ? 'Hide Answer' : 'Show Sample Answer'}
          </Text>
          <Ionicons
            name={showAnswer ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.text}
          />
        </TouchableOpacity>

        {showAnswer && (
          <View style={styles.answerContainer}>
            <Text style={[styles.answerTitle, { color: colors.text }]}>Sample Answer:</Text>
            <Text style={[styles.answerText, { color: colors.text }]}>
              {currentQuestion?.sampleAnswer}
            </Text>
            <Text style={[styles.tipsTitle, { color: colors.text }]}>💡 Tips:</Text>
            <Text style={[styles.tipsText, { color: colors.text }]}>
              {currentQuestion?.tips}
            </Text>
          </View>
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
          onPress={previousQuestion}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={currentIndex === 0 ? colors.text : colors.text} />
          <Text style={{ color: currentIndex === 0 ? colors.text : colors.text }}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentIndex === currentList.length - 1 && styles.disabledButton]}
          onPress={nextQuestion}
          disabled={currentIndex === currentList.length - 1}
        >
          <Text style={{ color: currentIndex === currentList.length - 1 ? colors.textSecondary : colors.text }}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color={currentIndex === currentList.length - 1 ? colors.text : colors.text} />
        </TouchableOpacity>
      </View>

      {/* Practice Modal */}
      <Modal
        visible={showPracticeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPracticeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Practice Answer</Text>
              <TouchableOpacity onPress={() => setShowPracticeModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalQuestion, { color: colors.text }]}>
                {currentQuestion?.question}
              </Text>

              <Text style={[styles.modalLabel, { color: colors.text }]}>Your Answer:</Text>
              <TextInput
                style={[styles.answerInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={userAnswer}
                onChangeText={setUserAnswer}
                placeholder="Type your answer here..."
                placeholderTextColor='#ada9a9'
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              <Text style={[styles.modalLabel, { color: colors.text }]}>Record Your Answer:</Text>
              <View style={styles.recordingControls}>
                {!isRecording && !recordedUri && (
                  <TouchableOpacity
                    style={[styles.recordButton, { backgroundColor: '#ee0e0e' }]}
                    onPress={startRecording}
                  >
                    <Ionicons name="mic" size={20} color="white" />
                    <Text style={styles.recordButtonText}>Start Recording</Text>
                  </TouchableOpacity>
                )}

                {isRecording && (
                  <TouchableOpacity
                    style={[styles.recordButton, { backgroundColor: '#EF4444' }]}
                    onPress={stopRecording}
                  >
                    <Ionicons name="stop" size={20} color="white" />
                    <Text style={styles.recordButtonText}>Stop Recording</Text>
                  </TouchableOpacity>
                )}

                {recordedUri && (
                  <View style={styles.playbackControls}>
                    {!isPlaying ? (
                      <TouchableOpacity
                        style={[styles.playButton, { backgroundColor: '#4f59e6' }]}
                        onPress={playRecording}
                      >
                        <Ionicons name="play" size={20} color="white" />
                        <Text style={styles.recordButtonText}>Play Recording</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.playButton, { backgroundColor: '#EF4444' }]}
                        onPress={stopPlayback}
                      >
                        <Ionicons name="stop" size={20} color="white" />
                        <Text style={styles.recordButtonText}>Stop</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[styles.recordButton, { backgroundColor: '#6B7280' }]}
                      onPress={() => setRecordedUri(null)}
                    >
                      <Ionicons name="trash" size={20} color="white" />
                      <Text style={styles.recordButtonText}>Discard</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: '#078122' }]}
                onPress={() => {
                  // Save practice answer
                  Alert.alert('Saved!', 'Your practice answer has been saved.');
                  setShowPracticeModal(false);
                }}
              >
                <Text style={styles.saveButtonText}>Save Practice</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginTop: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  careerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  careerName: { fontSize: 18, fontWeight: '600', flex: 1 },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 16,
  },
  tab: {
    paddingVertical: 8,
    borderBottomWidth: 2,
  },
  activeTab: { borderBottomWidth: 2 },
  tabText: { fontSize: 14, fontWeight: '500' },
  counter: {
    fontSize: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  questionCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  questionText: { fontSize: 18, fontWeight: '500', lineHeight: 26, marginBottom: 16 },
  showAnswerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  answerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  answerTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  answerText: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  tipsTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  tipsText: { fontSize: 13, lineHeight: 18 },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 4,
  },
  disabledButton: { opacity: 0.5 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { maxHeight: '80%' },
  modalQuestion: { fontSize: 16, fontWeight: '500', marginBottom: 16, lineHeight: 22 },
  modalLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  answerInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  recordingControls: { marginTop: 8, gap: 12 },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  recordButtonText: { color: 'white', fontWeight: '500' },
  playbackControls: { flexDirection: 'row', gap: 12 },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    gap: 8,
  },
  modalActions: { marginTop: 16 },
  saveButton: { padding: 14, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  upgradeButton: { padding: 16, borderRadius: 8, width: '80%', alignItems: 'center' },
  upgradeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});