// context/PremiumContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert, AppState } from 'react-native';
import RevenueCatService from '../services/RevenueCatService';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PremiumContext = createContext();

export const PremiumProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [packages, setPackages] = useState({ monthly: null, yearly: null, lifetime: null, all: [] });
  const [loading, setLoading] = useState(true);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
  const [yearlySavings, setYearlySavings] = useState(50);
  
  const { user } = useAuth();

  // Listen for app foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active' && user) {
        console.log('📱 App foreground - checking premium status');
        await checkStatus();
      }
    });

    return () => subscription.remove();
  }, [user]);

  // Initialize when user changes
  useEffect(() => {
    if (user) {
      initializePremium(user.uid);
    } else {
      // Reset when logged out
      setIsPremium(false);
      setPackages({ monthly: null, yearly: null, lifetime: null, all: [] });
      setSubscriptionEndDate(null);
      setLoading(false);
    }
  }, [user]);

  const initializePremium = async (userId) => {
    try {
      setLoading(true);
      
      // First, configure RevenueCat
      await RevenueCatService.configure(userId);
      
      // Check status
      await checkStatus();
      
      // Load products
      await loadProducts();
      
    } catch (error) {
      console.error('Premium init error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!user) return false;
    
    try {
      const status = await RevenueCatService.checkPremiumStatus(user.uid);
      setIsPremium(status);
      
      if (status) {
        const info = await RevenueCatService.getCustomerInfo();
        const expDate = info?.entitlements.active?.premium?.expirationDate;
        setSubscriptionEndDate(expDate || null);
        
        await AsyncStorage.setItem('@premium_status', 'true');
        if (expDate) {
          await AsyncStorage.setItem('@premium_expiry', expDate);
        }
      } else {
        await AsyncStorage.setItem('@premium_status', 'false');
      }
      
      return status;
    } catch (error) {
      console.error('Status check error:', error);
      const stored = await AsyncStorage.getItem('@premium_status');
      setIsPremium(stored === 'true');
      return stored === 'true';
    }
  };

  const loadProducts = async () => {
    try {
      console.log('Loading products...');
      const organizedPackages = await RevenueCatService.getPackages();
      console.log('Packages loaded:', {
        monthly: organizedPackages.monthly?.product.priceString,
        yearly: organizedPackages.yearly?.product.priceString,
        lifetime: organizedPackages.lifetime?.product.priceString
      });
      
      setPackages(organizedPackages);
      
      // Calculate yearly savings
      const savings = RevenueCatService.calculateYearlySavings(organizedPackages);
      setYearlySavings(savings);
    } catch (error) {
      console.error('Error loading products:', error);
      setPackages({ monthly: null, yearly: null, lifetime: null, all: [] });
    }
  };

  const purchaseProduct = async (pkg) => {
    console.log('🔵 purchaseProduct called with package:', pkg?.identifier);
    
    if (!user) {
      console.log('❌ No user found');
      Alert.alert('Error', 'Please log in first');
      return false;
    }

    if (!pkg) {
      console.log('❌ No package provided');
      Alert.alert('Error', 'No product selected');
      return false;
    }

    setLoading(true);
    try {
      console.log('Calling RevenueCatService.purchasePackage...');
      const result = await RevenueCatService.purchasePackage(pkg);
      console.log('RevenueCat result:', result);

      if (result.success) {
        if (user) {
          const { setPremiumSyncStatus } = require('../store/userProfileStore');
          const syncService = require('../services/syncService').default;

          setPremiumSyncStatus(true, user.uid);
          await syncService.fullSyncToCloud(user.uid, true);
        }
        console.log('✅ Purchase successful, checking status...');
        const status = await RevenueCatService.checkPremiumStatus(user.uid);
        console.log('New premium status:', status);
        setIsPremium(status);

        if (status) {
          const info = await RevenueCatService.getCustomerInfo();
          setSubscriptionEndDate(info?.entitlements.active?.premium?.expirationDate || null);
        }

        Alert.alert(
          '🎉 Welcome to Premium!',
          'Thank you for subscribing. You now have access to all premium features.',
          [{ text: 'Continue' }]
        );

          return true;
      } else if (result.userCancelled) {
        console.log('User cancelled purchase');
        return false;
      } else {
        console.log('❌ Purchase failed:', result.error);
        Alert.alert('Purchase failed', result.error || 'Please try again');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Purchase error in context:', error);
      Alert.alert('Error', error?.message || 'Purchase failed');
      return false;
    } finally {
      setLoading(false);
      console.log('Purchase flow completed');
    }
    
  };

  const restorePurchases = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return false;
    }

    setLoading(true);
    try {
      const result = await RevenueCatService.restorePurchases();
      
      if (result.success) {
        await checkStatus();
        Alert.alert(
          'Purchases Restored',
          result.isPremium ? 'Premium activated!' : 'No purchases found'
        );
        return result.isPremium;
      } else {
        Alert.alert('Restore failed', 'Could not restore purchases');
        return false;
      }
    } catch (error) {
      Alert.alert('Error', 'Restore failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Helper to get formatted pricing
  const getPricing = () => {
    return {
      monthly: packages.monthly?.product.priceString || '$4.99',
      yearly: packages.yearly?.product.priceString || '$29.99',
      lifetime: packages.lifetime?.product.priceString || '$49.99',
      yearlySavings: yearlySavings
    };
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        packages,
        loading,
        subscriptionEndDate,
        purchaseProduct,
        restorePurchases,
        checkStatus,
        loadProducts,
        getPricing,
        yearlySavings
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};