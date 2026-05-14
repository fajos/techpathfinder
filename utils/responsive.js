import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param {string|number} widthPercent The percentage of screen's width.
 * @return {number} The calculated dp.
 */
export const wp = (widthPercent) => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return (SCREEN_WIDTH * elemWidth) / 100;
};

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param {string|number} heightPercent The percentage of screen's height.
 * @return {number} The calculated dp.
 */
export const hp = (heightPercent) => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
  return (SCREEN_HEIGHT * elemHeight) / 100;
};

/**
 * Normalizes size based on screen width to ensure consistent sizing across devices.
 * factor: 0.5 is a good middle ground for tablets vs phones.
 */
export const normalize = (size, factor = 0.5) => {
  const scale = SCREEN_WIDTH / 375; // 375 is standard base width (e.g. iPhone 11)
  const newSize = size * scale;
  return size + (newSize - size) * factor;
};

/**
 * Helper to determine if the device is a tablet.
 */
export const isTablet = () => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  // Tablets typically have an aspect ratio < 1.6 and width > 600
  return SCREEN_WIDTH >= 600 || (aspectRatio < 1.6 && SCREEN_WIDTH > 400);
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };
