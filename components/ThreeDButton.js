// components/ThreeDButton.js
import React, { useRef } from "react";
import {
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ThreeDButton = ({ title, onPress, gradient = false, style = {} }) => {
  const anim = useRef(new Animated.Value(0)).current;

  const pressIn = () => {
    Animated.spring(anim, {
      toValue: 4,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(anim, {
      toValue: 0,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const transformStyle = {
    transform: [{ translateY: anim }],
  };

  const buttonStyle = [styles.button, style];
  const buttonContent = (
    <Animated.View style={[buttonStyle, transformStyle]}>
      <Text style={styles.text}>{title}</Text>
    </Animated.View>
  );

  return (
    <TouchableWithoutFeedback
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
    >
      {gradient ? (
        <LinearGradient
          colors={["#6366f1", "#4f46e5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {buttonContent}
        </LinearGradient>
      ) : (
        buttonContent
      )}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 12,
    marginVertical: 4,
    padding: 1,
  },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ThreeDButton;