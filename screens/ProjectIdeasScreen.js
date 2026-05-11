// screens/ProjectIdeasScreen.js
import React, { useState, useEffect } from 'react';
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
  const { colors } = useThemeStyles();
  
  const [projects, setProjects] = useState({ beginner: [], intermediate: [], advanced: [] });
  const [selectedDifficulty, setSelectedDifficulty] = useState('beginner');
  const [loading, setLoading] = useState(true);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    loadProjects();
    loadCompletedProjects();
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
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <LinearGradient
          colors={['#4f46e5', '#7c3aed']}
          style={styles.lockIconContainer}
        >
          <Ionicons name="lock-closed" size={40} color="white" />
        </LinearGradient>
        <Text style={[styles.title, { color: colors.text, textAlign: 'center', marginTop: 20 }]}>
          Project Ideas
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginVertical: 20 }]}>
          Get curated portfolio projects to build your skills and stand out to employers.
        </Text>
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => navigation.navigate('Premium')}
        >
          <LinearGradient
            colors={['#4f46e5', '#7c3aed']}
            style={styles.upgradeGradient}
          >
            <Ionicons name="diamond" size={20} color="white" />
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
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
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Project Ideas</Text>
        <View style={{ width: 40 }} />
      </View>
      
      {/* Hero Section */}
      <LinearGradient
        colors={['#4f46e5', '#7c3aed']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <Ionicons name="bulb-outline" size={40} color="white" />
        <Text style={styles.heroTitle}>Build Your Portfolio</Text>
        <Text style={styles.heroSubtitle}>
          Complete projects to showcase your {career} skills
        </Text>
      </LinearGradient>
      
      {/* Difficulty Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
      >
        {getDifficultyLevels().map(level => {
          const config = difficultyConfig[level];
          const isActive = selectedDifficulty === level;
          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.tab,
                isActive && { backgroundColor: config.gradient[0] + '15' }
              ]}
              onPress={() => setSelectedDifficulty(level)}
            >
              <Text style={[
                styles.tabEmoji,
                isActive && { color: config.gradient[0] }
              ]}>{config.icon}</Text>
              <Text style={[
                styles.tabText,
                { color: isActive ? config.gradient[0] : colors.textSecondary }
              ]}>
                {config.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {/* Projects List */}
      <ScrollView 
        style={styles.projectsList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.projectsListContent}
      >
        {currentProjects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bulb-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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
                  style={styles.projectCard}
                >
                  {/* Completion ribbon */}
                  {isCompleted && (
                    <View style={styles.completedRibbon}>
                      <Ionicons name="checkmark" size={16} color="white" />
                      <Text style={styles.completedRibbonText}>Completed</Text>
                    </View>
                  )}
                  
                  <View style={styles.projectHeader}>
                    <View style={styles.projectNumber}>
                      <Text style={styles.projectNumberText}>{String(index + 1).padStart(2, '0')}</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => toggleComplete(project.id)}
                      style={styles.checkButton}
                    >
                      <Ionicons
                        name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                        size={28}
                        color={isCompleted ? '#10B981' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={[styles.projectTitle, { color: isCompleted ? '#D1D5DB' : 'white' }]}>
                    {project.title}
                  </Text>
                  
                  <Text style={[styles.projectDescription, { color: '#9CA3AF' }]}>
                    {project.description}
                  </Text>
                  
                  <View style={styles.projectMeta}>
                    <View style={[styles.metaItem, { backgroundColor: config.gradient[0] + '20' }]}>
                      <Ionicons name="time-outline" size={14} color={config.gradient[0]} />
                      <Text style={{ color: config.gradient[0], fontSize: 12 }}>
                        {project.estimatedHours} hrs
                      </Text>
                    </View>
                    <View style={styles.techStack}>
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <View key={idx} style={[styles.techTag, { backgroundColor: '#374151' }]}>
                          <Text style={styles.techTagText}>{tech}</Text>
                        </View>
                      ))}
                      {project.technologies.length > 3 && (
                        <Text style={{ color: '#6B7280', fontSize: 11 }}>+{project.technologies.length - 3}</Text>
                      )}
                    </View>
                  </View>
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
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <LinearGradient
              colors={difficultyConfig[selectedDifficulty]?.gradient || ['#4f46e5', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalHeaderGradient}
            >
              <Text style={styles.modalHeaderTitle}>{selectedProject?.title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </LinearGradient>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.modalMetaContainer}>
                <View style={[styles.modalMetaItem, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="time-outline" size={18} color={colors.primary} />
                  <Text style={{ color: colors.text, marginLeft: 6 }}>
                    {selectedProject?.estimatedHours} hours
                  </Text>
                </View>
                <View style={[styles.modalMetaItem, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="code-outline" size={18} color={colors.primary} />
                  <Text style={{ color: colors.text, marginLeft: 6 }}>
                    {selectedProject?.technologies.length} technologies
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                {selectedProject?.description}
              </Text>
              
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                📋 Steps to Complete
              </Text>
              {selectedProject?.steps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <LinearGradient
                    colors={['#4f46e5', '#7c3aed']}
                    style={styles.stepNumberCircle}
                  >
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </LinearGradient>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>{step}</Text>
                </View>
              ))}
              
              {selectedProject?.resources && selectedProject.resources.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>
                    📚 Helpful Resources
                  </Text>
                  {selectedProject.resources.map((resource, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.resourceLink, { backgroundColor: colors.primary + '10' }]}
                      onPress={() => Linking.openURL(resource)}
                    >
                      <Ionicons name="link-outline" size={18} color={colors.primary} />
                      <Text style={{ color: colors.primary, marginLeft: 10, flex: 1 }} numberOfLines={1}>
                        {resource.replace('https://', '').substring(0, 50)}
                      </Text>
                      <Ionicons name="open-outline" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                setModalVisible(false);
                Alert.alert('🎯 Get Started!', `Time to build "${selectedProject?.title}". Good luck with your project!`);
              }}
            >
              <LinearGradient
                colors={['#4f46e5', '#7c3aed']}
                style={styles.startButtonGradient}
              >
                <Ionicons name="rocket-outline" size={20} color="white" />
                <Text style={styles.startButtonText}>Start Building</Text>
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
});