// src/context/ThemeContext.jsx
import { createContext, useContext, useState } from "react";
import { DARK, LIGHT } from "../themes";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState("light");
  const theme = themeId === "dark" ? DARK : LIGHT;

  const toggleTheme = () => setThemeId((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, themeId, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);