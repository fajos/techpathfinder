import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeStyles } from "../hooks/useThemeStyles";
import { useNavigation } from "@react-navigation/native";

const ChangePasscodeScreen = () => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const { colors } = useThemeStyles();
  const navigation = useNavigation(); // ✅ Fix #1

  const handleChangePasscode = async () => {
    if (newPass.length < 4) {
      Alert.alert("Error", "Passcode must be at least 4 digits.");
      return;
    }

    if (newPass !== confirmPass) {
      Alert.alert("Error", "New passcodes do not match.");
      return;
    }

    try {
      const stored = await AsyncStorage.getItem("dashboardPasscode");

      if (stored && stored !== currentPass) {
        Alert.alert("Error", "Current passcode is incorrect.");
        return;
      }

      await AsyncStorage.setItem("dashboardPasscode", newPass);
      Alert.alert("Success", "Passcode updated!");

      navigation.goBack(); // ✅ Fix #2
    } catch (error) {
      console.error("Failed to update passcode:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>
        🔐 Change Dashboard Passcode
      </Text>

      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="Current Passcode"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={currentPass}
        onChangeText={setCurrentPass}
      />
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="New Passcode"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={newPass}
        onChangeText={setNewPass}
      />
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="Confirm New Passcode"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={confirmPass}
        onChangeText={setConfirmPass}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: "#4f46e5" }]} onPress={handleChangePasscode}>
        <Text style={styles.buttonText}>Update Passcode</Text>
      </TouchableOpacity>
          <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.button, { backgroundColor: "#9ca3af", marginTop: 10 }]}
          >
              <Text style={styles.buttonText}>← Back to Settings</Text>
          </TouchableOpacity>
    </View>
  );
};

export default ChangePasscodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});