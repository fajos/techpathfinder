import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const NetworkBanner = ({ isConnected }) => {
  useEffect(() => {
    console.log("📡 Network status in banner:", isConnected);
  }, [isConnected]);

  if (isConnected) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>📴 You’re offline. Some features may not work.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#dc2626",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  bannerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default NetworkBanner;