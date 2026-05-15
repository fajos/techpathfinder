// screens/PremiumScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { usePremium } from '../context/PremiumContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { Ionicons } from '@expo/vector-icons';
import { trackEvent } from '../services/analytics';

const PremiumScreen = ({ navigation }) => {
  const { isPremium, packages, loading, purchaseProduct, restorePurchases, getPricing } = usePremium();
  const { colors } = useThemeStyles();

  // Helper to get package array (works with both old and new format)
  const getPackagesArray = () => {
    if (Array.isArray(packages)) {
      return packages;
    }
    // New format: { monthly, yearly, lifetime, all }
    return packages.all || [];
  };

  // Helper to get package by type
  const getPackageByType = (type) => {
    if (Array.isArray(packages)) {
      return packages.find(p => 
        p.identifier === `$rc_${type}` || 
        p.identifier.includes(type)
      );
    }
    return packages[type];
  };

  const pricing = getPricing ? getPricing() : { monthly: '$4.99', yearly: '$29.99', lifetime: '$49.99', yearlySavings: 50 };

  if (isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Ionicons name="trophy" size={80} color="#FFD700" />
        <Text style={[styles.title, { color: colors.text }]}>You're a Premium Member!</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Thank you for supporting TechPathFinder
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Continue Exploring</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePurchase = async (pkg) => {
    trackEvent('premium_purchase_started', { 
      plan: pkg.identifier,
      price: pkg.product?.priceString || pricing.monthly
    });
    
    const result = await purchaseProduct(pkg);
    
    if (result?.success) {
      trackEvent('premium_purchase_success', { 
        plan: pkg.identifier,
        price: pkg.product?.priceString || pricing.monthly
      });
    } else if (result && !result.userCancelled) {
      trackEvent('premium_purchase_failed', { 
        plan: pkg.identifier,
        error: result.error
      });
    }
  };

  const FeatureItem = ({ icon, text }) => {
    return (
      <View style={styles.featureItem}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <Text style={[styles.featureText, { color: colors.text }]}>{text}</Text>
      </View>
    );
  };

  const handleRestore = async () => {

    await restorePurchases();
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 16 }}>Loading plans...</Text>
      </View>
    );
  }

  // Get packages in preferred order: Yearly (recommended), Monthly, Lifetime
  const yearlyPkg = getPackageByType('yearly');
  const monthlyPkg = getPackageByType('monthly');
  const lifetimePkg = getPackageByType('lifetime');

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
      </View>

      <View style={styles.packages}>
        {/* Yearly Plan (Recommended) */}
        {yearlyPkg && (
          <TouchableOpacity
            key={yearlyPkg.identifier}
            style={[styles.packageCard, styles.recommendedCard]}
            onPress={() => handlePurchase(yearlyPkg)}
            activeOpacity={0.7}
          >
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>BEST VALUE</Text>
            </View>
            <Text style={styles.packageTitle}>Yearly Plan</Text>
            <Text style={styles.packagePrice}>{pricing.yearly}</Text>
            <Text style={styles.packageDescription}>per year</Text>
            <Text style={styles.savingsText}>Save {pricing.yearlySavings}% vs monthly</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureListItem}>✓ All premium features</Text>
              <Text style={styles.featureListItem}>✓ Best savings</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Monthly Plan */}
        {monthlyPkg && (
          <TouchableOpacity
            key={monthlyPkg.identifier}
            style={styles.packageCard}
            onPress={() => handlePurchase(monthlyPkg)}
            activeOpacity={0.7}
          >
            <Text style={styles.packageTitle}>Monthly Plan</Text>
            <Text style={styles.packagePrice}>{pricing.monthly}</Text>
            <Text style={styles.packageDescription}>per month</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureListItem}>✓ All premium features</Text>
              <Text style={styles.featureListItem}>✓ Cancel anytime</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Lifetime Plan */}
        {lifetimePkg && (
          <TouchableOpacity
            key={lifetimePkg.identifier}
            style={styles.packageCard}
            onPress={() => handlePurchase(lifetimePkg)}
            activeOpacity={0.7}
          >
            <Text style={styles.packageTitle}>Lifetime Access</Text>
            <Text style={styles.packagePrice}>{pricing.lifetime}</Text>
            <Text style={styles.packageDescription}>one-time payment</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureListItem}>✓ All premium features</Text>
              <Text style={styles.featureListItem}>✓ Pay once, use forever</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Fallback for old format (array of packages) */}
        {!yearlyPkg && !monthlyPkg && !lifetimePkg && getPackagesArray().map((pkg) => (
          <TouchableOpacity
            key={pkg.identifier}
            style={styles.packageCard}
            onPress={() => handlePurchase(pkg)}
            activeOpacity={0.7}
          >
            <Text style={styles.packageTitle}>{pkg.product.title}</Text>
            <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
            <Text style={styles.packageDescription}>{pkg.product.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleRestore} style={styles.restoreButton}>
        <Text style={{ color: colors.text }}>Restore Purchases</Text>
      </TouchableOpacity>

      <Text style={[styles.footer, { color: colors.text }]}>
        Subscription auto-renews. Cancel anytime in your device settings.
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
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  packageCard: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    position: 'relative',
  },
  recommendedCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  recommendedText: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  packagePrice: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  packageDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  savingsText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  featureList: {
    marginTop: 8,
    alignItems: 'center',
  },
  featureListItem: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    marginVertical: 2,
  },
  button: {
    padding: 15,
    borderRadius: 12,
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