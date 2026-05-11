// components/CareerModal.js
import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStyles } from '../hooks/useThemeStyles';

const CareerModal = ({ visible, onClose, career }) => {
  const { colors } = useThemeStyles();

  if (!career) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {career.title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Intro */}
            {career.intro && (
              <Text style={[styles.intro, { color: colors.textSecondary }]}>
                {career.intro}
              </Text>
            )}

            {/* Roles - Bubble Styling */}
            {career.roles?.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Roles:</Text>
                <View style={styles.bubblesContainer}>
                  {career.roles.map((role, index) => (
                    <View key={index} style={[styles.bubble, { backgroundColor: '#e0e7ff' }]}>
                      <Text style={[styles.bubbleText, { color: '#1e3a8a' }]}>{role}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Skills - Bubble Styling */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills:</Text>
            <View style={styles.bubblesContainer}>
              {career.skills?.map((skill, index) => (
                <View key={index} style={[styles.bubble, { backgroundColor: '#e0e7ff' }]}>
                  <Text style={[styles.bubbleText, { color: '#1e3a8a' }]}>{skill}</Text>
                </View>
              ))}
            </View>

            {/* Roadmap - No changes */}
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

            {/* Resources REMOVED - they are gated on the card */}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  intro: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  bubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bubbleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
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
});

export default CareerModal;