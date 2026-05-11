// screens/SkillGapScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { usePremium } from '../context/PremiumContext';
import { useUserProfileStore } from '../store/userProfileStore';
import { useThemeStyles } from '../hooks/useThemeStyles';
import careerRoadmapsFull from '../data/careerRoadmapsFull';
import { skillVariations } from '../data/skillVariations';
import { Animated } from 'react-native';

export default function SkillGapScreen({ route, navigation }) {
    const { career } = route.params;
    const { user } = useAuth();
    const { isPremium } = usePremium();
    const { getCurrentProfile, addSkill, removeSkill } = useUserProfileStore();
    const { colors } = useThemeStyles();

    const [analysis, setAnalysis] = useState(null);
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(true);
    const [userSkills, setUserSkills] = useState([]);
    const [fadeAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        if (user && career) {
            loadData();
        }
    }, [user, career]);

    const loadData = () => {
        const profile = getCurrentProfile();
        const skills = profile?.skills || []; // Ensure default empty array
        setUserSkills(skills);
        analyzeSkillGap(skills);
        setLoading(false);
    };

    const analyzeSkillGap = (skills) => {
  // Use the passed skills, or fall back to userSkills
  const skillsToUse = skills || userSkills || [];
  
  const careerData = careerRoadmapsFull[career];
  if (!careerData) return;
  
  const requiredSkills = careerData.skills || [];
  
  const matched = requiredSkills.filter(required =>
    skillsToUse.some(userSkill => 
      userSkill.toLowerCase() === required.toLowerCase()
    )
  );
  
  const missing = requiredSkills.filter(required =>
    !skillsToUse.some(userSkill => 
      userSkill.toLowerCase() === required.toLowerCase()
    )
  );
  
  const percentage = Math.round((matched.length / requiredSkills.length) * 100) || 0;
  
  setAnalysis({
    careerTitle: careerData.title,
    matched,
    missing,
    percentage,
    total: requiredSkills.length,
    requiredSkills
  });
};

    const handleAddSkill = () => {
        if (!newSkill.trim() || !user) return;

        // Ensure userSkills is an array
        const currentSkills = userSkills || [];
        const updated = [...currentSkills, newSkill.trim()];
        setUserSkills(updated);
        addSkill(user.uid, newSkill.trim());
        analyzeSkillGap(updated);
        setNewSkill('');
    };

    const handleRemoveSkill = (skill) => {
        const updated = userSkills.filter(s => s !== skill);
        setUserSkills(updated);
        removeSkill(user.uid, skill);
        analyzeSkillGap(updated);
    };

    // Premium gate
    if (!isPremium) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Ionicons name="lock-closed" size={60} color={colors.primary} />
                <Text style={[styles.title, { color: colors.text, textAlign: 'center', marginTop: 20 }]}>
                    Skill Gap Analysis
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginVertical: 20 }]}>
                    Upgrade to Premium to see how your skills match up with career requirements and identify what to learn next.
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

    if (!analysis) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: colors.text }}>Career data not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.careerTitle, { color: colors.text }]}>
                    {analysis.careerTitle}
                </Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>
                    Skill Gap Analysis
                </Text>
            </View>

            {/* Match Percentage Card */}
            <View style={[styles.percentageCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.percentageLabel, { color: colors.text }]}>
                    Match Percentage
                </Text>
                <Text style={[styles.percentageValue, { color: colors.text }]}>
                    {analysis.percentage}%
                </Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${analysis.percentage}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={[styles.matchText, { color: colors.text }]}>
                    {analysis.matched.length} of {analysis.total} skills matched
                </Text>
            </View>

       {/* Custom Skill Input (Optional) 
<View style={[styles.addSkillCard, { backgroundColor: colors.card, marginTop: 0 }]}>
  <Text style={[styles.sectionTitle, { color: colors.text }]}>
    + Add Custom Skill
  </Text>
  <View style={styles.addSkillRow}>
    <TextInput
      style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
      placeholder="e.g., TypeScript, GraphQL"
      placeholderTextColor={colors.textSecondary}
      value={newSkill}
      onChangeText={setNewSkill}
      onSubmitEditing={handleAddSkill}
    />
    <TouchableOpacity
      style={[styles.addButton, { backgroundColor: colors.primary }]}
      onPress={handleAddSkill}
    >
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  </View>
</View>*/}

            {/* Matched Skills */}
            {analysis.matched.length > 0 && (
                <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Skills You Have ({analysis.matched.length})
                        </Text>
                    </View>

                    {analysis.matched.map((skill) => ( 
                        <View key={skill} style={styles.skillRow}>
                            <Ionicons name="checkmark" size={18} color="#10B981" />
                            <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>

                            <TouchableOpacity
                                style={styles.removeSkillButton}
                                onPress={() => {
                                    Alert.alert(
                                        'Remove Skill',
                                        `Are you sure you want to remove "${skill}"?`,
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            {
                                                text: 'Remove',
                                                style: 'destructive',
                                                onPress: async () => {
                                                    const updatedSkills = userSkills.filter(s =>
                                                        s.toLowerCase() !== skill.toLowerCase()
                                                    );
                                                    setUserSkills(updatedSkills);
                                                    await removeSkill(user.uid, skill);
                                                    analyzeSkillGap(updatedSkills);
                                                }
                                            }
                                        ]
                                    );
                                }}
                            >
                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            {/* Missing Skills */}
{analysis.missing.length > 0 && (
  <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
    <View style={styles.sectionHeader}>
      <Ionicons name="alert-circle" size={24} color="#EF4444" />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Skills to Learn ({analysis.missing.length})
      </Text>
    </View>
    
    {analysis.missing.map((skill) => {  // ✅ No index
      const isAdded = userSkills.some(s => 
        s.toLowerCase() === skill.toLowerCase()
      );
      
      return (
        <View key={skill} style={styles.skillRow}>
          <Ionicons 
            name={isAdded ? "checkmark-circle" : "close"} 
            size={18} 
            color={isAdded ? "#10B981" : "#EF4444"} 
          />
          <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
          
          {!isAdded ? (
            <TouchableOpacity
              style={[styles.addSkillButton, { borderColor: colors.text }]}
              onPress={async () => {
                const updatedSkills = [...userSkills, skill];
                setUserSkills(updatedSkills);
                await addSkill(user.uid, skill);
                analyzeSkillGap(updatedSkills);
              }}
            >
              <Text style={{ color: colors.text, fontSize: 12 }}>Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.addedSkillBadge, { backgroundColor: '#10B98120' }]}>
              <Text style={{ color: '#10B981', fontSize: 12 }}>Added ✓</Text>
            </View>
          )}
        </View>
      );
    })}
  </View>
)}

            {/* Smart Suggestions */}
            {analysis.missing.length > 0 && (
                <View style={[styles.suggestionsCard, { backgroundColor: colors.card, marginTop: 10 }]}>
                    <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
                        💡 Quick Add
                    </Text>
                    <View style={styles.suggestionTags}>
                        {analysis.missing.slice(0, 5).map((skill, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.suggestionTag, { backgroundColor: colors.primary + '20' }]}
                                onPress={() => {
                                    const currentSkills = userSkills || [];
                                    const updated = [...currentSkills, skill];
                                    setUserSkills(updated);
                                    addSkill(user.uid, skill);
                                    analyzeSkillGap(updated);
                                }}
                            >
                                <Text style={{ color: colors.text }}>+ {skill}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Recommendations */}
            {analysis.missing.length > 0 && (
                <View style={[styles.recommendationsCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.recommendationsTitle, { color: colors.text }]}>
                        🎯 Next Steps
                    </Text>
                    <Text style={[styles.recommendationText, { color: colors.text }]}>
                        Focus on learning these {analysis.missing.length} skills to become a competitive {analysis.careerTitle}:
                    </Text>
                    {analysis.missing.slice(0, 10).map((skill, index) => (
                        <View key={index} style={styles.recommendationItem}>
                            <Ionicons name="arrow-forward" size={16} color={colors.text} />
                            <Text style={[styles.recommendationItemText, { color: colors.text }]}>
                                {skill}
                            </Text>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={[styles.learningPlanButton, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.navigate('LearningPlan', { career })}
                    >
                        <Text style={styles.learningPlanButtonText}>Create Learning Plan</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    careerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    percentageCard: {
        margin: 20,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    percentageLabel: {
        fontSize: 14,
    },
    percentageValue: {
        fontSize: 48,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        marginVertical: 10,
    },
    progressFill: {
        height: 8,
        borderRadius: 4,
    },
    matchText: {
        fontSize: 14,
    },
    addSkillCard: {
        margin: 20,
        marginTop: 0,
        padding: 20,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    addSkillRow: {
        flexDirection: 'row',
        gap: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skillsList: {
        marginTop: 16,
    },
    skillsListTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    skillTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        gap: 4,
    },
    sectionCard: {
        margin: 20,
        marginTop: 0,
        padding: 20,
        borderRadius: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    skillRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    skillText: {
        fontSize: 14,
        flex: 1,
    },
    addSkillButton: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    recommendationsCard: {
        margin: 20,
        marginTop: 0,
        padding: 20,
        borderRadius: 12,
    },
    recommendationsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    recommendationText: {
        fontSize: 14,
        marginBottom: 12,
    },
    recommendationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 8,
    },
    recommendationItemText: {
        fontSize: 14,
    },
    learningPlanButton: {
        marginTop: 16,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    learningPlanButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    upgradeButton: {
        padding: 16,
        borderRadius: 8,
        width: '70%',
        alignItems: 'center',
    },
    upgradeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    suggestionsCard: {
        margin: 20,
        marginTop: 0,
        padding: 16,
        borderRadius: 12,
    },
    suggestionsTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
    },
    suggestionTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    suggestionTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    addedSkillBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    removeSkillButton: {
  padding: 4,
  marginLeft: 4,
},
});