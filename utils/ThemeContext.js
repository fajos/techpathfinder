// utils/ThemeContext.js
import React, { createContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Load saved preference
  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem("themeMode");
      if (stored !== null) {
        setIsDark(stored === "dark");
      } else {
        const systemPref = Appearance.getColorScheme();
        setIsDark(systemPref === "dark");
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    await AsyncStorage.setItem("themeMode", newMode ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};