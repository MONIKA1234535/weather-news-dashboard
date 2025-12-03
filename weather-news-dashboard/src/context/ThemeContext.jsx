import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context object
const ThemeContext = createContext();

// 2. Create a custom hook to use the theme easily
export const useTheme = () => {
  return useContext(ThemeContext);
};

// 3. Create the Provider component
export const ThemeProvider = ({ children }) => {
  // Initialize state based on 'dark' class presence on the body, defaulting to 'light'
  const [theme, setTheme] = useState(() => {
    return document.body.classList.contains('dark') ? 'dark' : 'light';
  });

  // Effect to apply the theme class to the body element whenever 'theme' changes
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};