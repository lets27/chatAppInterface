import { useState } from "react";
import { ThemeContext } from "./useTheme";

const ThemeProvider = ({ children }) => {
  // Initialize with light theme if no theme is saved
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("chat-theme");
    return savedTheme || "light"; // Default to light if no theme saved
  });

  // Function to change to any theme
  const changeTheme = (newTheme) => {
    localStorage.setItem("chat-theme", newTheme);
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Optional: Keep toggle for light/dark if you want
  const toggleLightDark = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    changeTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: changeTheme,
        toggleTheme: toggleLightDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
