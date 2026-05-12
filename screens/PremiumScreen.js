// screens/PremiumScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { usePremium } from '../context/PremiumContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { Ionicons } from '@expo/vector-icons';
import { trackEvent } from '../services/analytics';

const PremiumScreen = ({ navigation }) => {
  // ✅ FIXED: Use correct function names from context
  const { isPremium, packages, loading, purchaseProduct, restorePurchases } = usePremium();
  const { colors } = useThemeStyles();

  if (isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Ionicons name="trophy" size={80} color="#FFD700" />
        <Text style={[styles.title, { color: colors.text }]}>You're a Premium Member!</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Thank you for supporting TechPathFinder
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Continue Exploring</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePurchase = async (pkg) => {
  // Track purchase attempt
  trackEvent('premium_purchase_started', { 
    plan: pkg.identifier,
    price: pkg.product.priceString
  });
  
  const result = await purchaseProduct(pkg);
  
  if (result.success) {
    // Track successful purchase
    trackEvent('premium_purchase_success', { 
      plan: pkg.identifier,
      price: pkg.product.priceString
    });
  } else if (!result.userCancelled) {
    // Track failed purchase
    trackEvent('premium_purchase_failed', { 
      plan: pkg.identifier,
      error: result.error
    });
  }
};

  const handleRestore = async () => {
    console.log('🔄 Restore button pressed');
    await restorePurchases();
  };

  // Show loading overlay when processing
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ color: colors.text, marginTop: 16 }}>Processing...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Ionicons name="diamond" size={60} color="#4f46e5" />
        <Text style={[styles.title, { color: colors.text }]}>Upgrade to Premium</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Unlock all features and accelerate your tech career
        </Text>
      </View>

      <View style={styles.features}>
        <FeatureItem icon="book" text="Unlimited resources for all careers" />
        <FeatureItem icon="map" text="Detailed learning roadmaps" />
        <FeatureItem icon="document-text" text="Resume builder & cover letters" />
        <FeatureItem icon="trending-up" text="Progress tracking" />
        <FeatureItem icon="school" text="Certificate of completion" />
        <FeatureItem icon="remove-circle" text="No advertisements" />
      </View>

      <View style={styles.packages}>
        {packages.map((pkg) => (
          <TouchableOpacity
            key={pkg.identifier}
            style={styles.packageCard}
            onPress={() => handlePurchase(pkg)}
            activeOpacity={0.7}
          >
            <Text style={styles.packageTitle}>
              {pkg.product.title}
            </Text>
            <Text style={styles.packagePrice}>
              {pkg.product.priceString}
            </Text>
            <Text style={styles.packageDescription}>
              {pkg.product.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleRestore} style={styles.restoreButton}>
        <Text style={{ color: colors.text }}>Restore Purchases</Text>
      </TouchableOpacity>

      <Text style={[styles.footer, { color: colors.text }]}>
        Subscription auto-renews. Cancel anytime.
      </Text>
    </ScrollView>
  );
};

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={24} color="#4f46e5" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.8,
  },
  features: {
    padding: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  packages: {
    padding: 20,
  },
  packageCard: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  packageTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  packagePrice: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  packageDescription: {
    color: 'white',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  restoreButton: {
    alignItems: 'center',
    padding: 15,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 20,
    opacity: 0.6,
  },
});

export default PremiumScreen;