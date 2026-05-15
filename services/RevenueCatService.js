// services/RevenueCatService.js
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Replace these with your PRODUCTION keys when launching
const API_KEYS = {
  ios: 'appl_xxxxxxxxxxxxx',  // Replace with your iOS production key
  android: 'goog_xxxxxxxxxxxxx', // Replace with your Google Play production key
};

// Test keys for development (keep for testing)
const TEST_API_KEYS = {
  ios: 'your_ios_test_key_here',
  android: 'test_dwFsfUBLqajVghxYiAeCIPCtRil',
};

let isConfigured = false;

class RevenueCatService {
  constructor() {
    this.entitlements = null;
    this.isProduction = false; // Set to true when launching
  }

  // Set to production mode before building final APK
  setProductionMode(enabled) {
    this.isProduction = enabled;
  }

  async configure(userId) {
    if (isConfigured) return;

    try {

      
      // Use production or test keys based on mode
      const apiKey = this.isProduction 
        ? (Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android)
        : (Platform.OS === 'ios' ? TEST_API_KEYS.ios : TEST_API_KEYS.android);
      
      await Purchases.configure({ apiKey });

      if (userId) {
        const { customerInfo } = await Purchases.logIn(userId);

        this.entitlements = customerInfo.entitlements.active;
      }

      isConfigured = true;

    } catch (error) {
      console.error('RevenueCat config error:', error);
    }
  }

  async getPackages() {
    try {

      const offerings = await Purchases.getOfferings();
      
      if (!offerings.current) {
        console.log('No current offering found');
        return [];
      }
      
      // Organize packages by type for easier display
      const packages = offerings.current.availablePackages || [];
      const organized = {
        monthly: packages.find(p => p.identifier === '$rc_monthly'),
        yearly: packages.find(p => p.identifier === '$rc_annual'),
        lifetime: packages.find(p => p.identifier === '$rc_lifetime'),
        all: packages
      };
      
      console.log('Packages found:', {
        monthly: organized.monthly?.product.priceString,
        yearly: organized.yearly?.product.priceString,
        lifetime: organized.lifetime?.product.priceString
      });
      
      return organized;
    } catch (error) {
      console.error('Error getting packages:', error);
      return { monthly: null, yearly: null, lifetime: null, all: [] };
    }
  }

  // Get formatted pricing for display
  getFormattedPricing(packages) {
    return {
      monthly: packages.monthly?.product.priceString || '$4.99',
      yearly: packages.yearly?.product.priceString || '$29.99',
      lifetime: packages.lifetime?.product.priceString || '$49.99',
      yearlySavings: this.calculateYearlySavings(packages)
    };
  }

  calculateYearlySavings(packages) {
    if (packages.monthly && packages.yearly) {
      const monthlyPrice = packages.monthly.product.price;
      const yearlyPrice = packages.yearly.product.price;
      const monthlyTotal = monthlyPrice * 12;
      const savings = ((monthlyTotal - yearlyPrice) / monthlyTotal) * 100;
      return Math.round(savings);
    }
    return 50; // Default 50% savings
  }

  async purchasePackage(purchasedPackage) {
    try {

      
      if (!purchasedPackage || !purchasedPackage.product) {
        throw new Error('Invalid package');
      }
      
      console.log('Product details:', {
        identifier: purchasedPackage.identifier,
        title: purchasedPackage.product.title,
        price: purchasedPackage.product.priceString
      });
      
      const purchaseResult = await Purchases.purchasePackage(purchasedPackage);

      
      const { customerInfo } = purchaseResult;
      this.entitlements = customerInfo.entitlements.active;
      const isPremium = this.entitlements?.premium?.isActive === true;
      

      
      return { 
        success: true, 
        customerInfo,
        isPremium
      };
    } catch (error) {
      console.error('❌ Purchase error:', error);
      
      if (error.code === '1' || error.userCancelled) {

        return { success: false, userCancelled: true };
      }
      
      return { 
        success: false, 
        error: error.message || 'Purchase failed',
        code: error.code
      };
    }
  }

  async restorePurchases() {
    try {

      const customerInfo = await Purchases.restorePurchases();
      
      this.entitlements = customerInfo.entitlements.active;
      const isPremium = this.entitlements?.premium?.isActive === true;
      
      return { success: true, customerInfo, isPremium };
    } catch (error) {
      console.error('Restore error:', error);
      return { success: false, error };
    }
  }

  async checkPremiumStatus(userId) {
    try {
      await this.configure(userId);
      
      const customerInfo = await Purchases.getCustomerInfo();
      
      this.entitlements = customerInfo.entitlements.active;
      return this.entitlements?.premium?.isActive === true;
    } catch (error) {
      console.error('Error checking premium:', error);
      return false;
    }
  }

  async getCustomerInfo() {
    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error('Error getting customer info:', error);
      return null;
    }
  }
}

export default new RevenueCatService();