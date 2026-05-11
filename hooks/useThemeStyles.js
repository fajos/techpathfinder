// hooks/useThemeStyles.js
import { useContext } from "react";
import { ThemeContext } from "../utils/ThemeContext";

export const useThemeStyles = () => {
  const { isDark } = useContext(ThemeContext);
  const colors = {
    background: isDark ? "#111827" : "#f0f4f8",
    text: isDark ? "#f9fafb" : "#111827",
    card: isDark ? "#1f2937" : "#ffffff",
    border: isDark ? "#374151" : "#e5e7eb",
  };
  return { colors, isDark };
};