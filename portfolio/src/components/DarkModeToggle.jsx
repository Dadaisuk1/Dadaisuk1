import { useState, useEffect } from 'react';
import { Icon } from '@mdi/react';
import { mdiWeatherSunny, mdiWeatherNight } from '@mdi/js';

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check system preference or localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDark(JSON.parse(savedMode));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`relative inline-flex items-center justify-center w-14 h-8 rounded-full transition-colors duration-300 ${
        isDark
          ? 'bg-dark-accent'
          : 'bg-light-accent'
      }`}
      aria-label="Toggle dark mode"
      style={{
        backgroundColor: isDark ? '#415A77' : '#E5E7EB',
      }}
    >
      {/* Knob with sliding animation */}
      <div
        className={`absolute w-7 h-7 rounded-full transition-all duration-300 flex items-center justify-center pointer-events-none ${
          isDark ? 'translate-x-3' : '-translate-x-3'
        }`}
        style={{
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Icon morphing - sun to moon */}
        <div className="relative w-5 h-5">
          {/* Sun icon - visible in light mode */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: isDark ? 0 : 1 }}
          >
            <Icon path={mdiWeatherSunny} size={1} color="#D4AF37" />
          </div>
          {/* Moon icon - visible in dark mode */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: isDark ? 1 : 0 }}
          >
            <Icon path={mdiWeatherNight} size={1} color="#06B6D4" />
          </div>
        </div>
      </div>
    </button>
  );
}

export default DarkModeToggle;
