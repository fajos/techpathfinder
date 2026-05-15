// services/analytics.js
import PostHog from 'posthog-react-native';

// Replace with your actual keys from PostHog dashboard
const POSTHOG_API_KEY = 'phc_zbZePjKEcmKCgVXLNggfAiNsjxRxca9SCiSVhDLsyp9y';
const POSTHOG_HOST = 'https://us.i.posthog.com';

let posthog = null;

export const initAnalytics = () => {
  if (!posthog && POSTHOG_API_KEY !== 'phc_zbZePjKEcmKCgVXLNggfAiNsjxRxca9SCiSVhDLsyp9y') {
    posthog = new PostHog(POSTHOG_API_KEY, { host: POSTHOG_HOST });
    console.log('✅ Analytics initialized');
  }
};

export const identifyUser = (userId, traits = {}) => {
  if (posthog) {
    posthog.identify(userId, traits);
    console.log('🔍 User identified:', userId);
  }
};

export const trackEvent = (eventName, properties = {}) => {
  if (posthog) {
    posthog.capture(eventName, properties);
    // console.log(`📊 Event tracked: ${eventName}`, properties);
  }
};

export const trackScreen = (screenName) => {
  if (posthog) {
    posthog.screen(screenName);
    // console.log(`📱 Screen viewed: ${screenName}`);
  }
};

export const resetAnalytics = () => {
  if (posthog) {
    posthog.reset();
    console.log('🔄 Analytics reset');
  }
};

export const getPostHog = () => posthog;