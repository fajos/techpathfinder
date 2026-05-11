// screens/SavedResumesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { useThemeStyles } from '../hooks/useThemeStyles';

const { Paths, File, Directory } = FileSystem;

export default function SavedResumesScreen({ navigation }) {
  const [resumes, setResumes] = useState([]);
  const { colors } = useThemeStyles();
  
  useEffect(() => {
    loadSavedResumes();
  }, []);
  
  const loadSavedResumes = async () => {
    try {
      const dir = new Directory(Paths.document);
      const files = dir.list();
      const pdfFiles = files.filter(f => f.name.endsWith('.pdf'));
      setResumes(pdfFiles);
    } catch (error) {
      console.error('Error loading resumes:', error);
    }
  };
  
  const deleteResume = async (file) => {
    Alert.alert(
      'Delete Resume',
      `Are you sure you want to delete "${file.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await file.delete();
            loadSavedResumes();
          }
        }
      ]
    );
  };
  
  const shareResume = async (file) => {
    await shareAsync(file.uri);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Resumes</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {resumes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No saved resumes yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Generate a resume to see it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={resumes}
          keyExtractor={(item) => item.uri}
          renderItem={({ item }) => (
            <View style={[styles.resumeItem, { backgroundColor: colors.card }]}>
              <View style={styles.resumeInfo}>
                <Ionicons name="document-text" size={24} color={colors.primary} />
                <View style={styles.resumeDetails}>
                  <Text style={[styles.resumeName, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.resumeDate, { color: colors.textSecondary }]}>
                    {new Date(item.modificationTime).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.resumeActions}>
                <TouchableOpacity onPress={() => shareResume(item)} style={styles.actionButton}>
                  <Ionicons name="share-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteResume(item)} style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: { fontSize: 18, marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8 },
  listContent: { padding: 16 },
  resumeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  resumeInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  resumeDetails: { flex: 1 },
  resumeName: { fontSize: 14, fontWeight: '500' },
  resumeDate: { fontSize: 12, marginTop: 2 },
  resumeActions: { flexDirection: 'row', gap: 12 },
  actionButton: { padding: 8 },
});