import React, { useEffect, useRef } from 'react';
import { View, Animated, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStyles } from '../hooks/useThemeStyles';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(30)).current;
  const navigation = useNavigation();
  const { hp, normalize } = useThemeStyles();

  useEffect(() => {
    // Start the rocket animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(moveAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Main screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace("Main");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const logoSize = normalize(200);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/splash/splash.png')} // You can update this image name/path
        style={[
          styles.image,
          {
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize / 2,
            marginTop: hp(10),
            opacity: fadeAnim,
            transform: [{ translateY: moveAnim }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
  },
});

export default SplashScreen;