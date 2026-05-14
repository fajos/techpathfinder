// hooks/useThemeStyles.js
import { useContext } from 'react';
import { ThemeContext } from '../utils/ThemeContext';
import { wp, hp, normalize, isTablet, SCREEN_WIDTH, SCREEN_HEIGHT } from '../utils/responsive';

export const useThemeStyles = () => {
  const { isDark } = useContext(ThemeContext);
  
  // Define colors with fallbacks for ALL properties
  const colors = {
    background: isDark ? '#111827' : '#ffffff',
    text: isDark ? '#f9fafb' : '#111827',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    card: isDark ? '#1f2937' : '#ffffff',
    border: isDark ? '#374151' : '#e5e7eb',
    primary: '#4f46e5',
    secondary: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    // Add these to prevent undefined
    primaryLight: '#4f46e520',
    secondaryLight: '#10B98120',
    cardBackground: isDark ? '#1f2937' : '#f9fafb',
    inputBackground: isDark ? '#374151' : '#f3f4f6',
    placeholder: isDark ? '#6b7280' : '#9ca3af',
  };
  
  // Make sure all colors are defined
  const safeColors = {
    background: colors.background || '#ffffff',
    text: colors.text || '#000000',
    textSecondary: colors.textSecondary || '#6b7280',
    card: colors.card || '#ffffff',
    border: colors.border || '#e5e5e5',
    primary: colors.primary || '#4f46e5',
    secondary: colors.secondary || '#10B981',
    error: colors.error || '#EF4444',
    warning: colors.warning || '#F59E0B',
    success: colors.success || '#10B981',
    primaryLight: colors.primaryLight || '#4f46e520',
    secondaryLight: colors.secondaryLight || '#10B98120',
    cardBackground: colors.cardBackground || '#f9fafb',
    inputBackground: colors.inputBackground || '#f3f4f6',
    placeholder: colors.placeholder || '#9ca3af',
  };
  
  return {
    colors: safeColors,
    isDark,
    wp,
    hp,
    normalize,
    isTablet: isTablet(),
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  };
};