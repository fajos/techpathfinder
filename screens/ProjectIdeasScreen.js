// screens/ProjectIdeasScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  Linking,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { usePremium } from '../context/PremiumContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { getProjectsForCareer, getDifficultyLevels } from '../data/projects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated, Easing } from 'react-native';
import { trackScreen, trackEvent } from '../services/analytics';

const { width } = Dimensions.get('window');

// Difficulty colors and gradients
const difficultyConfig = {
  beginner: {
    name: 'Beginner',
    gradient: ['#10B981', '#059669'],
    badgeColor: '#10B981',
    bgLight: '#D1FAE5',
    icon: '🌱'
  },
  intermediate: {
    name: 'Intermediate',
    gradient: ['#F59E0B', '#D97706'],
    badgeColor: '#F59E0B',
    bgLight: '#FEF3C7',
    icon: '⚡'
  },
  advanced: {
    name: 'Advanced',
    gradient: ['#EF4444', '#DC2626'],
    badgeColor: '#EF4444',
    bgLight: '#FEE2E2',
    icon: '🚀'
  }
};

export default function ProjectIdeasScreen({ route, navigation }) {
  const { career } = route.params;
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const { colors, wp, hp, normalize, isTablet } = useThemeStyles();
  
  const [projects, setProjects] = useState({ beginner: [], intermediate: [], advanced: [] });
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [loading, setLoading] = useState(true);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
  // Subtle bounce animation for the hint
  Animated.loop(
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.05,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);
  
  useEffect(() => {
    loadProjects();
    loadCompletedProjects();
  }, [career]);

useEffect(() => {
  trackScreen('ProjectIdeasScreen');
  trackEvent('feature_used', { 
    feature: 'project_ideas', 
    career: career,
    difficulty: selectedDifficulty
  });
}, [career]);
  
  const loadProjects = () => {
    const careerProjects = getProjectsForCareer(career);
    setProjects(careerProjects);
    setLoading(false);
  };
  
  const loadCompletedProjects = async () => {
    try {
      const saved = await AsyncStorage.getItem(`completed_projects_${user?.uid || 'anonymous'}`);
      if (saved) {
        setCompletedProjects(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading completed projects:', error);
    }
  };
  
  const toggleComplete = async (projectId) => {
    const updated = completedProjects.includes(projectId)
      ? completedProjects.filter(id => id !== projectId)
      : [...completedProjects, projectId];
    
    setCompletedProjects(updated);
    await AsyncStorage.setItem(
      `completed_projects_${user?.uid || 'anonymous'}`,
      JSON.stringify(updated)
    );
  };
  
  // Premium gate
  if (!isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: wp(5) }]}>
        <LinearGradient
          colors={['#4f46e5', '#7c3aed']}
          style={[styles.lockIconContainer, { width: normalize(80), height: normalize(80), borderRadius: normalize(40) }]}
        >
          <Ionicons name="lock-closed" size={normalize(40)} color="white" />
        </LinearGradient>
        <Text style={[styles.title, { color: colors.text, textAlign: 'center', marginTop: hp(2.5), fontSize: normalize(22), fontWeight: 'bold' }]}>
          Project Ideas
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginVertical: hp(2.5), fontSize: normalize(14) }]}>
          Get curated portfolio projects to build your skills and stand out to employers.
        </Text>
        <TouchableOpacity
          style={[styles.upgradeButton, { maxWidth: normalize(280) }]}
          onPress={() => navigation.navigate('Premium')}
        >
          <LinearGradient
            colors={['#4f46e5', '#7c3aed']}
            style={[styles.upgradeGradient, { padding: normalize(14) }]}
          >
            <Ionicons name="diamond" size={normalize(20)} color="white" />
            <Text style={[styles.upgradeButtonText, { fontSize: normalize(16) }]}>Upgrade to Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }
  
  const currentProjects = projects[selectedDifficulty] || [];
  const currentConfig = difficultyConfig[selectedDifficulty];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, paddingVertical: hp(1.5), marginTop: hp(2.5) }]}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: normalize(18) }]}>Project Ideas</Text>
        <View style={{ width: 40 }} />
      </View>
      
      {/* Hero Section */}
      <View style={[isTablet ? { alignSelf: 'center', width: wp(85) } : null]}>
        <LinearGradient
          colors={['#4f46e5', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroSection, { margin: wp(4), padding: normalize(24) }]}
        >
          <Ionicons name="bulb-outline" size={normalize(40)} color="white" />
          <Text style={[styles.heroTitle, { fontSize: normalize(22) }]}>Build Your Portfolio</Text>
          <Text style={[styles.heroSubtitle, { fontSize: normalize(14) }]}>
            Complete projects to showcase your {career} skills
          </Text>
        </LinearGradient>
      </View>
      
      {/* Difficulty Tabs */}
      <View style={[isTablet ? { alignSelf: 'center', width: wp(85) } : null]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
          contentContainerStyle={[styles.tabsContent, { paddingHorizontal: wp(4) }]}
        >
          {getDifficultyLevels().map(level => {
            const config = difficultyConfig[level];
            const isActive = selectedDifficulty === level;
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.tab,
                  { paddingHorizontal: normalize(16), paddingVertical: normalize(10) },
                  isActive && { backgroundColor: config.gradient[0] + '15' }
                ]}
                onPress={() => setSelectedDifficulty(level)}
              >
                <Text style={[
                  styles.tabEmoji,
                  { fontSize: normalize(16) },
                  isActive && { color: config.gradient[0] }
                ]}>{config.icon}</Text>
                <Text style={[
                  styles.tabText,
                  { fontSize: normalize(14), color: isActive ? config.gradient[0] : colors.textSecondary }
                ]}>
                  {config.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      
      {/* Projects List */}
      <ScrollView 
        style={styles.projectsList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.projectsListContent,
          { padding: wp(4), paddingBottom: hp(5) },
          isTablet ? { alignSelf: 'center', width: wp(85) } : null
        ]}
      >
        {currentProjects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bulb-outline" size={normalize(64)} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: normalize(16) }]}>
              No projects available for this level yet.
            </Text>
          </View>
        ) : (
          currentProjects.map((project, index) => {
            const isCompleted = completedProjects.includes(project.id);
            const config = difficultyConfig[selectedDifficulty];
            
            return (
              <TouchableOpacity
                key={project.id}
                activeOpacity={0.9}
                onPress={() => {
                  setSelectedProject(project);
                  setModalVisible(true);
                }}
              >
                <LinearGradient
                  colors={isCompleted ? ['#10B981', '#059669'] : ['#183663', '#04225e']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.projectCard, { padding: normalize(18) }]}
                >
                  {/* Completion ribbon */}
                  {isCompleted && (
                    <View style={styles.completedRibbon}>
                      <Ionicons name="checkmark" size={normalize(16)} color="white" />
                      <Text style={styles.completedRibbonText}>Completed</Text>
                    </View>
                  )}
                  
                  <View style={styles.projectHeader}>
                    <View style={[styles.projectNumber, { width: normalize(40), height: normalize(40) }]}>
                      <Text style={[styles.projectNumberText, { fontSize: normalize(14) }]}>{String(index + 1).padStart(2, '0')}</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => toggleComplete(project.id)}
                      style={styles.checkButton}
                    >
                      <Ionicons
                        name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                        size={normalize(28)}
                        color={isCompleted ? '#10B981' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={[styles.projectTitle, { color: isCompleted ? '#D1D5DB' : 'white', fontSize: normalize(18) }]}>
                    {project.title}
                  </Text>
                  
                  <Text style={[styles.projectDescription, { color: '#9CA3AF', fontSize: normalize(13), lineHeight: normalize(18) }]}>
                    {project.description}
                  </Text>
                  
                  <View style={styles.projectMeta}>
                    <View style={[styles.metaItem, { backgroundColor: config.gradient[0] + '20', paddingHorizontal: normalize(10), paddingVertical: normalize(4) }]}>
                      <Ionicons name="time-outline" size={normalize(14)} color={config.gradient[0]} />
                      <Text style={{ color: config.gradient[0], fontSize: normalize(12) }}>
                        {project.estimatedHours} hrs
                      </Text>
                    </View>
                    <View style={styles.techStack}>
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <View key={idx} style={[styles.techTag, { backgroundColor: '#374151', paddingHorizontal: normalize(8), paddingVertical: normalize(3) }]}>
                          <Text style={[styles.techTagText, { fontSize: normalize(10) }]}>{tech}</Text>
                        </View>
                      ))}
                      {project.technologies.length > 3 && (
                        <Text style={{ color: '#6B7280', fontSize: normalize(11) }}>+{project.technologies.length - 3}</Text>
                      )}
                    </View>
                  </View>

                  {/* Click for details indicator - Enhanced */}
                  <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
                  <View style={[styles.clickIndicator, { marginTop: normalize(12), paddingTop: normalize(10) }]}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.05)']}
                      style={styles.clickIndicatorGradient}
                    >
                      <View style={styles.clickIndicatorContent}>
                        <Ionicons name="information-circle-outline" size={normalize(16)} color="#9CA3AF" />
                        <Text style={[styles.clickIndicatorText, {color: colors.text, fontSize: normalize(11)}]}>Tap for step-by-step guide</Text>
                        <Ionicons name="chevron-forward" size={normalize(14)} color="#9CA3AF" />
                      </View>
                    </LinearGradient>
                  </View>
                  </Animated.View>  
                </LinearGradient>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
      
      {/* Project Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, width: isTablet ? wp(85) : '100%', alignSelf: 'center' }]}>
            <LinearGradient
              colors={difficultyConfig[selectedDifficulty]?.gradient || ['#4f46e5', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.modalHeaderGradient, { paddingHorizontal: wp(5), paddingVertical: hp(2.5) }]}
            >
              <Text style={[styles.modalHeaderTitle, { fontSize: normalize(20) }]}>{selectedProject?.title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={normalize(24)} color="white" />
              </TouchableOpacity>
            </LinearGradient>
            
            <ScrollView style={[styles.modalBody, { padding: wp(5) }]} showsVerticalScrollIndicator={false}>
              <View style={[styles.modalMetaContainer, { marginBottom: hp(2.5) }]}>
                <View style={[styles.modalMetaItem, { backgroundColor: colors.primary + '15', paddingHorizontal: normalize(12), paddingVertical: normalize(8) }]}>
                  <Ionicons name="time-outline" size={normalize(18)} color={colors.text} />
                  <Text style={{ color: colors.text, marginLeft: normalize(6), fontSize: normalize(14) }}>
                    {selectedProject?.estimatedHours} hours
                  </Text>
                </View>
                <View style={[styles.modalMetaItem, { backgroundColor: colors.primary + '15', paddingHorizontal: normalize(12), paddingVertical: normalize(8) }]}>
                  <Ionicons name="code-outline" size={normalize(18)} color={colors.text} />
                  <Text style={{ color: colors.text, marginLeft: normalize(6), fontSize: normalize(14) }}>
                    {selectedProject?.technologies.length} technologies
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.modalDescription, { color: colors.text, fontSize: normalize(14), lineHeight: normalize(20), marginBottom: hp(2.5) }]}>
                {selectedProject?.description}
              </Text>
              
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(16) }]}>
                📋 Steps to Complete
              </Text>
              {selectedProject?.steps.map((step, index) => (
                <View key={index} style={[styles.stepRow, { marginBottom: hp(1.5) }]}>
                  <LinearGradient
                    colors={['#4f46e5', '#7c3aed']}
                    style={[styles.stepNumberCircle, { width: normalize(28), height: normalize(28), borderRadius: normalize(14) }]}
                  >
                    <Text style={[styles.stepNumberText, { fontSize: normalize(12) }]}>{index + 1}</Text>
                  </LinearGradient>
                  <Text style={[styles.stepText, { color: colors.text, fontSize: normalize(14), lineHeight: normalize(20) }]}>{step}</Text>
                </View>
              ))}
              
              {selectedProject?.resources && selectedProject.resources.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text, marginTop: hp(2), fontSize: normalize(16) }]}>
                    📚 Helpful Resources
                  </Text>
                  {selectedProject.resources.map((resource, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.resourceLink, { backgroundColor: colors.primary + '10', padding: normalize(12) }]}
                      onPress={() => Linking.openURL(resource)}
                    >
                      <Ionicons name="link-outline" size={normalize(18)} color={colors.text} />
                      <Text style={{ color: colors.text, marginLeft: normalize(10), flex: 1, fontSize: normalize(14) }} numberOfLines={1}>
                        {resource.replace('https://', '').substring(0, 50)}
                      </Text>
                      <Ionicons name="open-outline" size={normalize(16)} color={colors.text} />
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>
            
            <TouchableOpacity
              style={[styles.startButton, { margin: wp(5), marginTop: 0 }]}
              onPress={() => {
                setModalVisible(false);
                Alert.alert('🎯 Get Started!', `Time to build "${selectedProject?.title}". Good luck with your project!`);
              }}
            >
              <LinearGradient
                colors={['#4f46e5', '#7c3aed']}
                style={[styles.startButtonGradient, { padding: normalize(16) }]}
              >
                <Ionicons name="rocket-outline" size={normalize(20)} color="white" />
                <Text style={[styles.startButtonText, { fontSize: normalize(16) }]}>Start Building</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  
  heroSection: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  
  tabs: {
    maxHeight: 50,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#1f2937',
  },
  tabEmoji: { fontSize: 16 },
  tabText: { fontSize: 14, fontWeight: '500' },
  
  projectsList: { flex: 1 },
  projectsListContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  
  projectCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  completedRibbon: {
    position: 'absolute',
    top: 12,
    right: -30,
    backgroundColor: '#10B981',
    paddingHorizontal: 30,
    paddingVertical: 4,
    transform: [{ rotate: '45deg' }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedRibbonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkButton: {
    padding: 4,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    gap: 4,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  techTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  techTagText: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: { fontSize: 16, textAlign: 'center' },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeaderGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalBody: {
    padding: 20,
  },
  modalMetaContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  modalMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  stepNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  startButton: {
    margin: 20,
    marginTop: 0,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  lockIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButton: {
    width: '100%',
    maxWidth: 280,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clickIndicator: {
  marginTop: 12,
  paddingTop: 10,
  borderTopWidth: 1,
  borderTopColor: 'rgba(255,255,255,0.08)',
},
clickIndicatorContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
},
clickIndicatorText: {
  fontSize: 11,
  fontWeight: '500',
  textAlign: 'center',
},
});