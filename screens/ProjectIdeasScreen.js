// screens/ProjectIdeasScreen.js (Updated - Fixed Spacing)
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
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { usePremium } from '../context/PremiumContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { getProjectsForCareer, getDifficultyLevels } from '../data/projects';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <Ionicons name="lock-closed" size={60} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, textAlign: 'center', marginTop: 20 }]}>
          Project Ideas
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginVertical: 20 }]}>
          Get curated portfolio projects to build your skills and stand out to employers.
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
  
  const currentProjects = projects[selectedDifficulty] || [];
  const difficultyNames = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Project Ideas</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Career Info */}
      <View style={[styles.careerCard, { backgroundColor: colors.card }]}>
        <Ionicons name="briefcase-outline" size={24} color={colors.primary} />
        <Text style={[styles.careerName, { color: colors.text }]}>{career}</Text>
      </View>
      
      {/* Difficulty Tabs - Removed bottom margin, let ScrollView handle */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
      >
        {getDifficultyLevels().map(level => (
          <TouchableOpacity
            key={level}
            style={[
              styles.tab,
              selectedDifficulty === level && styles.activeTab,
              { borderBottomColor: selectedDifficulty === level ? colors.primary : 'transparent' }
            ]}
            onPress={() => setSelectedDifficulty(level)}
          >
            <Text style={[
              styles.tabText,
              { color: selectedDifficulty === level ? colors.primary : colors.textSecondary }
            ]}>
              {difficultyNames[level]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Projects List - Directly after tabs, no extra padding */}
      <ScrollView 
        style={styles.projectsList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.projectsListContent}
      >
        {currentProjects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bulb-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No projects available for this level yet.
            </Text>
          </View>
        ) : (

currentProjects.map(project => {
  const isCompleted = completedProjects.includes(project.id);
  
  return (
    <TouchableOpacity
      key={project.id}
      style={[styles.projectCard, { backgroundColor: colors.card }]}
      onPress={() => {
        setSelectedProject(project);
        setModalVisible(true);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.projectHeader}>
        <View style={styles.projectTitleContainer}>
          <Text style={[styles.projectTitle, { color: colors.text }]}>
            {project.title}
          </Text>
          <View style={[styles.difficultyBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '600' }}>
              {project.difficulty}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleComplete(project.id)}>
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={24}
            color={isCompleted ? '#10B981' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.projectDescription, { color: colors.textSecondary }]}>
        {project.description}
      </Text>
      
      <View style={styles.projectMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {project.estimatedHours} hrs
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="code-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {project.technologies.slice(0, 3).join(', ')}
            {project.technologies.length > 3 ? '...' : ''}
          </Text>
        </View>
      </View>
      
      {/* ADD THIS: Click for details indicator */}
      <View style={styles.clickIndicator}>
        <View style={styles.clickIndicatorContent}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.clickIndicatorText, { color: colors.textSecondary }]}>
            Tap for details & step-by-step guide
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
        </View>
      </View>
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
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedProject?.title}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                {selectedProject?.description}
              </Text>
              
              <View style={styles.modalMeta}>
                <View style={styles.modalMetaItem}>
                  <Ionicons name="time-outline" size={16} color={colors.primary} />
                  <Text style={{ color: colors.text }}>{selectedProject?.estimatedHours} hours</Text>
                </View>
                <View style={styles.modalMetaItem}>
                  <Ionicons name="code-outline" size={16} color={colors.primary} />
                  <Text style={{ color: colors.text }}>{selectedProject?.technologies.join(' · ')}</Text>
                </View>
              </View>
              
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Steps</Text>
              {selectedProject?.steps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <Text style={[styles.stepNumber, { color: colors.primary }]}>{index + 1}</Text>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>{step}</Text>
                </View>
              ))}
              
              {selectedProject?.resources && selectedProject.resources.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>Resources</Text>
                  {selectedProject.resources.map((resource, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.resourceLink}
                      onPress={() => Linking.openURL(resource)}
                    >
                      <Ionicons name="link-outline" size={16} color={colors.primary} />
                      <Text style={{ color: colors.primary, marginLeft: 8 }}>
                        {resource.replace('https://', '').substring(0, 40)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>
            
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                setModalVisible(false);
                Alert.alert('Great choice!', `Start working on "${selectedProject?.title}". Mark it complete when you're done!`);
              }}
            >
              <Text style={styles.startButtonText}>Start Project</Text>
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
  headerTitle: { fontSize: 18, fontWeight: '600' },
  careerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  careerName: { fontSize: 18, fontWeight: '600', flex: 1 },
  tabs: {
    maxHeight: 44,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 2,
  },
  activeTab: { borderBottomWidth: 2 },
  tabText: { fontSize: 14, fontWeight: '500' },
  projectsList: {
    flex: 1,
  },
  projectsListContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 24,
  },
  projectCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  projectTitle: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  projectDescription: { fontSize: 14, marginBottom: 12, lineHeight: 20 },
  projectMeta: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12 },
  emptyContainer: { alignItems: 'center', padding: 40, gap: 12 },
  emptyText: { fontSize: 16, textAlign: 'center' },
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
  modalTitle: { fontSize: 20, fontWeight: 'bold', flex: 1, marginRight: 12 },
  modalBody: { maxHeight: '80%' },
  modalDescription: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  modalMeta: { flexDirection: 'row', gap: 20, marginBottom: 16 },
  modalMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  stepNumber: { fontSize: 14, fontWeight: '600', width: 24 },
  stepText: { fontSize: 14, lineHeight: 20, flex: 1 },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'rgba(79,70,229,0.1)',
    borderRadius: 8,
  },
  startButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  clickIndicator: {
  marginTop: 12,
  paddingTop: 8,
  borderTopWidth: 1,
  borderTopColor: 'rgba(0,0,0,0.05)',
},
clickIndicatorContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
},
clickIndicatorText: {
  fontSize: 11,
  textAlign: 'center',
},
  startButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  upgradeButton: { padding: 16, borderRadius: 8, width: '80%', alignItems: 'center' },
  upgradeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});