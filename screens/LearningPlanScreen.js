// screens/LearningPlanScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { usePremium } from '../context/PremiumContext';
import { useUserProfileStore } from '../store/userProfileStore';
import { useThemeStyles } from '../hooks/useThemeStyles';
import learningPlanService from '../services/learningPlanService';
import careerRoadmapsFull from '../data/careerRoadmapsFull';
import { Linking } from 'react-native';
import { trackScreen, trackEvent } from '../services/analytics';

export default function LearningPlanScreen({ route, navigation }) {
  const { career } = route.params;
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const { getCurrentProfile, updateProfile } = useUserProfileStore();
  const { colors, wp, hp, normalize, isTablet } = useThemeStyles();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && career) {
      generatePlan();
    }
  }, [user, career]);

useEffect(() => {
  trackScreen('LearningPlanScreen');
  trackEvent('feature_used', { 
    feature: 'learning_plan', 
    career: career,
    weeks: plan?.weeksNeeded
  });
}, [career, plan]);

  const generatePlan = async () => {
    setLoading(true);

    try {
      const profile = getCurrentProfile() || {};
      const safeProfile = {
        weeklyHours: profile?.weeklyHours || 5,
        experience: profile?.experience || 'beginner',
        completedRoadmaps: profile?.completedRoadmaps || [],
        ...profile
      };

      const careerData = careerRoadmapsFull[career];
      if (!careerData) {
        setLoading(false);
        return;
      }

      const learningPlan = learningPlanService.generatePlan(safeProfile, career);
      setPlan(learningPlan);

      if (user && learningPlan) {
        const currentProfile = getCurrentProfile() || {};
        updateProfile(user.uid, {
          learningPlans: {
            ...(currentProfile.learningPlans || {}),
            [career]: learningPlan
          }
        });
      }
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  // Premium gate
  if (!isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: wp(5) }]}>
        <Ionicons name="lock-closed" size={normalize(60)} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text, textAlign: 'center', marginTop: hp(2), fontSize: normalize(24), fontWeight: 'bold' }]}>
          Personalized Learning Plans
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginVertical: hp(2), fontSize: normalize(16) }]}>
          Upgrade to Premium to get a custom study schedule tailored to your available time and learning pace.
        </Text>
        <TouchableOpacity
          style={[styles.upgradeButton, { backgroundColor: '#4d31f1', width: isTablet ? wp(40) : wp(70), padding: hp(2), borderRadius: normalize(8) }]}
          onPress={() => navigation.navigate('Premium')}
        >
          <Text style={[styles.upgradeButtonText, { fontSize: normalize(16), fontWeight: 'bold' }]}>View Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: hp(2), fontSize: normalize(16) }}>Creating your personalized learning plan...</Text>
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text, fontSize: normalize(16) }}>Could not generate plan. Please try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={isTablet ? { alignSelf: 'center', width: wp(90) } : null}
    >
      {/* Header */}
      <View style={[styles.header, { padding: wp(5), paddingBottom: hp(1) }]}>
        <Text style={[styles.careerTitle, { color: colors.text, fontSize: normalize(28) }]}>
          {plan.careerTitle}
        </Text>
        <Text style={[styles.planSubtitle, { color: colors.text, fontSize: normalize(14), marginTop: hp(0.5) }]}>
          Your personalized {plan.weeksNeeded}-week learning journey
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={[styles.statsContainer, { paddingHorizontal: wp(5), marginBottom: hp(2) }]}>
        <View style={[styles.statCard, { backgroundColor: colors.card, padding: normalize(12), borderRadius: normalize(12), width: wp(28) }]}>
          <Text style={[styles.statValue, { color: colors.text, fontSize: normalize(22) }]}>
            {plan.weeksNeeded}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text, fontSize: normalize(12), marginTop: hp(0.5) }]}>Weeks</Text>
        </View>


        <View style={[styles.statCard, { backgroundColor: colors.card, padding: normalize(12), borderRadius: normalize(12), width: wp(28) }]}>
          <Text style={[styles.statValue, { color: colors.text, fontSize: normalize(20) }]}>
            {plan.pace}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text, fontSize: normalize(12), marginTop: hp(0.5) }]}>Pace</Text>
        </View>
      </View>

      {/* Completion Date */}
      <View style={[styles.completionCard, { backgroundColor: colors.card, padding: normalize(16), marginHorizontal: wp(5), marginBottom: hp(3), borderRadius: normalize(12) }]}>
        <Ionicons name="calendar-outline" size={normalize(20)} color={colors.text} />
        <Text style={{ color: colors.text, marginLeft: wp(2), flex: 1, fontSize: normalize(14) }}>
          Est. completion: {new Date(plan.estimatedEndDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
      </View>

      {/* Weekly Breakdown Title */}
      <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(18), paddingHorizontal: wp(5), marginBottom: hp(1.5) }]}>
        Weekly Breakdown
      </Text>

      {/* Weekly Plan Cards */}
      {plan.weeklyPlan.map((week) => (
        <View key={week.week} style={[styles.weekCard, { backgroundColor: colors.card, marginHorizontal: wp(5), marginBottom: hp(1.5), padding: normalize(16), borderRadius: normalize(12) }]}>
          <View style={styles.weekHeader}>
            <Text style={[styles.weekTitle, { color: colors.text, fontSize: normalize(18) }]}>
              Week {week.week}
            </Text>
          </View>

          <Text style={[styles.weekFocus, { color: colors.text, fontSize: normalize(16), marginBottom: hp(1.5) }]}>
            {week.focus}
          </Text>

          {week.steps.length > 0 && (
            <View style={styles.stepsContainer}>
              {week.steps.map((step, idx) => (
                <View key={idx} style={[styles.stepRow, { marginBottom: hp(1) }]}>
                  <View style={[styles.stepBullet, { backgroundColor: colors.primary, width: normalize(6), height: normalize(6), borderRadius: normalize(3), marginTop: hp(0.8), marginRight: wp(2.5) }]} />
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepText, { color: colors.text, fontSize: normalize(14), lineHeight: normalize(20) }]}>
                      {step.text}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Check if ANY resources exist for this week */}
          {(week.courses?.length > 0 || week.articles?.length > 0 || week.videos?.length > 0 || week.projects?.length > 0) && (
            <View style={[styles.resourcesContainer, { marginTop: hp(2), paddingTop: hp(2) }]}>
              <Text style={[styles.resourcesTitle, { color: colors.text, fontSize: normalize(14), marginBottom: hp(1.5) }]}>
                📚 What to Study This Week
              </Text>

              {/* Courses */}
              {week.courses?.map((course, idx) => (
                <TouchableOpacity
                  key={`course-${idx}`}
                  style={[styles.resourceItem, { backgroundColor: colors.background, padding: normalize(10), borderRadius: normalize(8), marginBottom: hp(1) }]}
                  onPress={() => course.url && Linking.openURL(course.url)}
                >
                  <View style={[styles.resourceIcon, { width: normalize(32) }]}>
                    <Ionicons name="school" size={normalize(20)} color={colors.text} />
                  </View>
                  <View style={[styles.resourceContent, { marginLeft: wp(2) }]}>
                    <Text style={[styles.resourceTitle, { color: colors.text, fontSize: normalize(13) }]}>
                      {course.displayTitle || course.title}
                    </Text>
                    <View style={styles.resourceMeta}>
                      <Text style={[styles.resourcePlatform, { color: colors.text, fontSize: normalize(11) }]}>
                        {course.platform}
                      </Text>
                      <Text style={[styles.resourceDuration, { color: colors.text, fontSize: normalize(11), marginLeft: wp(1) }]}>
                        • {course.duration}
                      </Text>
                      {course.pricing === 'free' ? (
                        <View style={[styles.freeBadge, { backgroundColor: '#10B98120', paddingHorizontal: wp(1.5), paddingVertical: hp(0.25), borderRadius: normalize(4), marginLeft: wp(2) }]}>
                          <Text style={{ color: '#10B981', fontSize: normalize(10), fontWeight: 'bold' }}>FREE</Text>
                        </View>
                      ) : course.pricing === 'paid' ? (
                        <View style={[styles.paidBadge, { backgroundColor: '#F59E0B20', paddingHorizontal: wp(1.5), paddingVertical: hp(0.25), borderRadius: normalize(4), marginLeft: wp(2) }]}>
                          <Text style={{ color: '#F59E0B', fontSize: normalize(10), fontWeight: 'bold' }}>PAID</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <Ionicons name="open-outline" size={normalize(18)} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}

              {/* Articles */}
              {week.articles?.map((article, idx) => (
                <TouchableOpacity
                  key={`article-${idx}`}
                  style={[styles.resourceItem, { backgroundColor: colors.background, padding: normalize(10), borderRadius: normalize(8), marginBottom: hp(1) }]}
                  onPress={() => article.url && Linking.openURL(article.url)}
                >
                  <View style={[styles.resourceIcon, { width: normalize(32) }]}>
                    <Ionicons name="document-text" size={normalize(20)} color={colors.text} />
                  </View>
                  <View style={[styles.resourceContent, { marginLeft: wp(2) }]}>
                    <Text style={[styles.resourceTitle, { color: colors.text, fontSize: normalize(13) }]}>
                      {article.title}
                    </Text>
                    <View style={styles.resourceMeta}>
                      <Text style={[styles.resourcePlatform, { color: colors.text, fontSize: normalize(11) }]}>
                        {article.platform}
                      </Text>
                      <Text style={[styles.resourceDuration, { color: colors.text, fontSize: normalize(11), marginLeft: wp(1) }]}>
                        • {article.readTime || article.duration}
                      </Text>
                      {article.pricing === 'free' && (
                        <View style={[styles.freeBadge, { backgroundColor: '#10B98120', paddingHorizontal: wp(1.5), paddingVertical: hp(0.25), borderRadius: normalize(4), marginLeft: wp(2) }]}>
                          <Text style={{ color: '#10B981', fontSize: normalize(10), fontWeight: 'bold' }}>FREE</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Ionicons name="open-outline" size={normalize(18)} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}

              {/* Videos */}
              {week.videos?.map((video, idx) => (
                <TouchableOpacity
                  key={`video-${idx}`}
                  style={[styles.resourceItem, { backgroundColor: colors.background, padding: normalize(10), borderRadius: normalize(8), marginBottom: hp(1) }]}
                  onPress={() => video.url && Linking.openURL(video.url)}
                >
                  <View style={[styles.resourceIcon, { width: normalize(32) }]}>
                    <Ionicons name="play-circle" size={normalize(20)} color={colors.text} />
                  </View>
                  <View style={[styles.resourceContent, { marginLeft: wp(2) }]}>
                    <Text style={[styles.resourceTitle, { color: colors.text, fontSize: normalize(13) }]}>
                      {video.title}
                    </Text>
                    <View style={styles.resourceMeta}>
                      <Text style={[styles.resourcePlatform, { color: colors.text, fontSize: normalize(11) }]}>
                        {video.platform}
                      </Text>
                      <Text style={[styles.resourceDuration, { color: colors.text, fontSize: normalize(11), marginLeft: wp(1) }]}>
                        • {video.duration}
                      </Text>
                      {video.pricing === 'free' && (
                        <View style={[styles.freeBadge, { backgroundColor: '#10B98120', paddingHorizontal: wp(1.5), paddingVertical: hp(0.25), borderRadius: normalize(4), marginLeft: wp(2) }]}>
                          <Text style={{ color: '#10B981', fontSize: normalize(10), fontWeight: 'bold' }}>FREE</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Ionicons name="open-outline" size={normalize(18)} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}

              {/* Projects */}
              {week.projects?.map((project, idx) => (
                <View key={`project-${idx}`} style={[styles.resourceItem, { backgroundColor: colors.background, padding: normalize(10), borderRadius: normalize(8), marginBottom: hp(1) }]}>
                  <View style={[styles.resourceIcon, { width: normalize(32) }]}>
                    <Ionicons name="code-slash" size={normalize(20)} color={colors.text} />
                  </View>
                  <View style={[styles.resourceContent, { marginLeft: wp(2) }]}>
                    <Text style={[styles.resourceTitle, { color: colors.text, fontSize: normalize(13) }]}>
                      {project.title}
                    </Text>
                    <Text style={[styles.resourceDescription, { color: colors.text, fontSize: normalize(12) }]}>
                      {project.description}
                    </Text>
                    <View style={styles.resourceMeta}>
                      <Text style={[styles.resourcePlatform, { color: colors.text, fontSize: normalize(11) }]}>
                        {project.difficulty} • {project.timeEstimate}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      {/* Milestones Section */}
      <Text style={[styles.sectionTitle, { color: colors.text, fontSize: normalize(18), paddingHorizontal: wp(5), marginTop: hp(2.5), marginBottom: hp(1.5) }]}>
        Learning Milestones
      </Text>

      {plan.milestones.map((milestone, index) => (
        <View key={index} style={[styles.milestoneCard, { backgroundColor: colors.card, marginHorizontal: wp(5), marginBottom: hp(1.5), padding: normalize(16), borderRadius: normalize(12) }]}>
          <View style={styles.milestoneHeader}>
            <Ionicons
              name="trophy-outline"
              size={normalize(24)}
              color="#FFD700"
            />
            <View style={[styles.milestoneBadge, { paddingHorizontal: wp(2.5), paddingVertical: hp(0.5), borderRadius: normalize(12), backgroundColor: '#f0f0f0' }]}>
              <Text style={[styles.milestoneWeek, { color: colors.primary, fontSize: normalize(12), fontWeight: '600' }]}>
                Week {milestone.week}
              </Text>
            </View>
          </View>
          <Text style={[styles.milestoneTitle, { color: colors.text, fontSize: normalize(16), fontWeight: '600', marginBottom: hp(0.5) }]}>
            {milestone.title}
          </Text>
          <Text style={[styles.milestoneDescription, { color: colors.text, fontSize: normalize(14), lineHeight: normalize(20) }]}>
            {milestone.description}
          </Text>
        </View>
      ))}

      {/* Start Learning Button */}
      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: colors.primary, margin: wp(5), padding: hp(2), borderRadius: normalize(12), alignItems: 'center' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.startButtonText, { color: 'white', fontSize: normalize(16), fontWeight: 'bold' }]}>Start Learning</Text>
      </TouchableOpacity>
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
  planSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    width: '30%',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  completionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  weekCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekHoursBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  weekFocus: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  stepsContainer: {
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  stepBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 10,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20,
  },
  stepHours: {
    fontSize: 12,
    marginTop: 2,
  },
  milestoneCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  milestoneWeek: {
    fontSize: 12,
    fontWeight: '600',
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  milestoneDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  startButton: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  upgradeButton: {
    padding: 16,
    borderRadius: 8,
    width: '70%',
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resourcesContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  resourcesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  resourceIcon: {
    width: 32,
    alignItems: 'center',
  },
  resourceContent: {
    flex: 1,
    marginLeft: 8,
  },
  resourceTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourcePlatform: {
    fontSize: 11,
  },
  resourceDuration: {
    fontSize: 11,
    marginLeft: 4,
  },

  freeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  paidBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  resourcesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  resourcesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  resourceIcon: {
    width: 32,
    alignItems: 'center',
  },
  resourceContent: {
    flex: 1,
    marginLeft: 8,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  resourcePlatform: {
    fontSize: 12,
  },
  resourceDuration: {
    fontSize: 12,
    marginLeft: 4,
  },
});