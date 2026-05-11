import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import * as Haptics from "expo-haptics";

const DashboardLockScreen = ({ navigation }) => {
  const [pin, setPin] = useState("");
  const [storedPin, setStoredPin] = useState(null);
  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    const checkBiometric = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricSupported(compatible && enrolled);
    };

    const loadPin = async () => {
      const saved = await AsyncStorage.getItem("dashboard_pin");
      setStoredPin(saved);
    };

    checkBiometric();
    loadPin();
  }, []);

  useEffect(() => {
    if (storedPin && biometricSupported) {
      handleBiometricAuth();
    }
  }, [storedPin, biometricSupported]);

  const handleBiometricAuth = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to unlock your dashboard",
      fallbackLabel: "Enter Passcode",
    });

    if (result.success) {
      navigation.replace("DashboardReal");
    } else {
      Alert.alert("Biometric authentication failed");
    }
  };

  const handleSubmit = async () => {
    if (!storedPin) {
      // First-time setup
      if (pin.length < 4) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return Alert.alert("PIN must be 4 digits");
      }
  
      await AsyncStorage.setItem("dashboard_pin", pin);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Passcode set!");
      navigation.replace("DashboardReal");
  
    } else {
      if (pin === storedPin) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.replace("DashboardReal");
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Incorrect passcode!");
      }
    }
  };

  const resetPin = async () => {
    await AsyncStorage.removeItem("dashboard_pin");
    setStoredPin(null);
    setPin("");
    Alert.alert("Passcode reset. Please set a new one.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {storedPin ? "🔒 Enter your dashboard passcode" : "🔐 Set a dashboard passcode"}
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
        placeholder="••••"
        value={pin}
        onChangeText={setPin}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{storedPin ? "Unlock" : "Set Passcode"}</Text>
      </TouchableOpacity>

      {storedPin && (
        <TouchableOpacity onPress={resetPin} style={{ marginTop: 20 }}>
          <Text style={{ color: "#dc2626", textDecorationLine: "underline" }}>
            Forgot your passcode?
          </Text>
        </TouchableOpacity>
      )}

      {storedPin && biometricSupported && (
        <Text style={{ marginTop: 20, color: "#6b7280", fontSize: 14 }}>
          🔓 Or unlock with Face ID / Fingerprint
        </Text>
      )}
    </View>
  );
};

export default DashboardLockScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 18, marginBottom: 20, textAlign: "center", color: "#1f2937" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "60%",
    textAlign: "center",
    fontSize: 20,
    paddingVertical: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});