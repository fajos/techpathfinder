import React from "react";
import { View, Text } from "react-native";

const OfflineBanner = () => {
  return (
    <View
      style={{
        backgroundColor: "#fee2e2",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          color: "#991b1b",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        ⚠️ You are currently offline. Some features may not work.
      </Text>
    </View>
  );
};

export default OfflineBanner;