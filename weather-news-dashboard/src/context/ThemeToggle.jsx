import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const icon = theme === 'light' ? '🌙' : '☀️';
  const label = theme === 'light' ? 'Dark Mode' : 'Light Mode';

  return (
    <button onClick={toggleTheme} className="theme-toggle-button">
      <span role="img" aria-label={label}>{icon}</span> {label}
    </button>
  );
}