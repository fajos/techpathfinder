// services/RevenueCatService.js
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEYS = {
  ios: 'your_ios_api_key_here',
  android: 'test_dwFsfUBLqajVghxYiAeCIPCtRil',  // Your test key
};

let isConfigured = false;

class RevenueCatService {
  constructor() {
    this.entitlements = null;
  }

  async configure(userId) {
    if (isConfigured) return;

    try {
      console.log('Configuring RevenueCat for user:', userId);
      
      if (Platform.OS === 'ios') {
        await Purchases.configure({ apiKey: API_KEYS.ios });
      } else {
        await Purchases.configure({ apiKey: API_KEYS.android });
      }

      if (userId) {
        const { customerInfo } = await Purchases.logIn(userId);
        console.log('User logged in:', userId);
        this.entitlements = customerInfo.entitlements.active;
      }

      isConfigured = true;
      console.log('✅ RevenueCat configured');
    } catch (error) {
      console.error('RevenueCat config error:', error);
    }
  }

  async getPackages() {
    try {
      console.log('Fetching offerings...');
      const offerings = await Purchases.getOfferings();
      
      if (!offerings.current) {
        console.log('No current offering found');
        return [];
      }
      
      console.log('Current offering packages:', offerings.current.availablePackages.length);
      return offerings.current.availablePackages || [];
    } catch (error) {
      console.error('Error getting packages:', error);
      return [];
    }
  }

  async purchasePackage(purchasedPackage) {
  try {
    console.log('💳 RevenueCatService: Starting purchase for:', purchasedPackage.identifier);
    
    // Make sure we have a valid package
    if (!purchasedPackage || !purchasedPackage.product) {
      throw new Error('Invalid package');
    }
    
    console.log('Product details:', {
      identifier: purchasedPackage.identifier,
      title: purchasedPackage.product.title,
      price: purchasedPackage.product.priceString
    });
    
    // Attempt the purchase
    const purchaseResult = await Purchases.purchasePackage(purchasedPackage);
    console.log('Purchase result received:', purchaseResult);
    
    const { customerInfo } = purchaseResult;
    this.entitlements = customerInfo.entitlements.active;
    const isPremium = this.entitlements?.premium?.isActive === true;
    
    console.log('✅ Purchase successful. Premium status:', isPremium);
    
    return { 
      success: true, 
      customerInfo,
      isPremium
    };
  } catch (error) {
    console.error('❌ RevenueCatService purchase error:', error);
    
    // Check if user cancelled
    if (error.code === '1' || error.userCancelled) {
      console.log('User cancelled purchase');
      return { success: false, userCancelled: true };
    }
    
    // Return error details
    return { 
      success: false, 
      error: error.message || 'Purchase failed',
      code: error.code
    };
  }
}

  async restorePurchases() {
    try {
      console.log('Restoring purchases...');
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