import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context object
const ThemeContext = createContext();

// 2. Custom hook to easily consume the context
export const useTheme = () => {
    return useContext(ThemeContext);
};

// 3. Provider component that manages state and provides it to children
export const ThemeProvider = ({ children }) => {
    // State initialization: checks localStorage first, then system preference
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            return localStorage.getItem('theme') || systemPreference;
        }
        return 'light';
    });

    // Effect to apply the theme class to the document root (for Tailwind dark mode)
    useEffect(() => {
        localStorage.setItem('theme', theme);
        const root = window.document.documentElement;
        
        // This is necessary for Tailwind's dark mode utility classes to work
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    // Function to toggle between themes
    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    const value = {
        theme,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};