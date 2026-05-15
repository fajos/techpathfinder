// screens/SavedResumesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { shareAsync } from 'expo-sharing';
import { useThemeStyles } from '../hooks/useThemeStyles';

const { Paths, File, Directory } = FileSystem;

export default function SavedResumesScreen({ navigation }) {
  const [resumes, setResumes] = useState([]);
  const { colors, wp, hp, normalize, isTablet } = useThemeStyles();
  
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
      <View style={[styles.header, { borderBottomColor: colors.border, paddingHorizontal: wp(4), paddingVertical: hp(1.5) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { padding: wp(1) }]}>
          <Ionicons name="arrow-back" size={normalize(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: normalize(18) }]}>Saved Resumes</Text>
        <View style={{ width: normalize(24) }} />
      </View>
      
      {resumes.length === 0 ? (
        <View style={[styles.emptyContainer, { padding: wp(5) }]}>
          <Ionicons name="document-outline" size={normalize(64)} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: normalize(18), marginTop: hp(2) }]}>
            No saved resumes yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary, fontSize: normalize(14), marginTop: hp(1) }]}>
            Generate a resume to see it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={resumes}
          keyExtractor={(item) => item.uri}
          renderItem={({ item }) => (
            <View style={[styles.resumeItem, { backgroundColor: colors.card, padding: wp(4), borderRadius: normalize(12), marginBottom: hp(1.5) }]}>
              <View style={[styles.resumeInfo, { gap: wp(3) }]}>
                <Ionicons name="document-text" size={normalize(24)} color={colors.primary} />
                <View style={styles.resumeDetails}>
                  <Text style={[styles.resumeName, { color: colors.text, fontSize: normalize(14) }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.resumeDate, { color: colors.textSecondary, fontSize: normalize(12), marginTop: hp(0.3) }]}>
                    {new Date(item.modificationTime).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.resumeActions, { gap: wp(3) }]}>
                <TouchableOpacity onPress={() => shareResume(item)} style={[styles.actionButton, { padding: wp(2) }]}>
                  <Ionicons name="share-outline" size={normalize(20)} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteResume(item)} style={[styles.actionButton, { padding: wp(2) }]}>
                  <Ionicons name="trash-outline" size={normalize(20)} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={[
            styles.listContent,
            { padding: wp(4) },
            isTablet && { width: wp(85), alignSelf: 'center' }
          ]}
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
    borderBottomWidth: 1,
  },
  headerTitle: { fontWeight: '600' },
  backButton: {},
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {},
  emptySubtext: {},
  listContent: {},
  resumeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumeInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  resumeDetails: { flex: 1 },
  resumeName: { fontWeight: '500' },
  resumeDate: {},
  resumeActions: { flexDirection: 'row' },
  actionButton: {},
});