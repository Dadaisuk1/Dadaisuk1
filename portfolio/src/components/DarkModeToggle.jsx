import { useEffect, useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiWeatherSunny, mdiWeatherNight } from '@mdi/js';

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDark]);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <button
      type="button"
      onClick={() => setIsDark((current) => !current)}
      className={`relative inline-flex items-center justify-center w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-[#D4AF37]`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      style={{
        backgroundColor: isDark ? '#415A77' : '#E5E7EB',
      }}
    >
      <div
        className={`absolute w-7 h-7 rounded-full flex items-center justify-center pointer-events-none ${
          prefersReducedMotion ? '' : 'transition-all duration-300'
        } ${isDark ? 'translate-x-3' : '-translate-x-3'}`}
        style={{
          backgroundColor: '#FFFFFF',
        }}
      >
        <div className="relative w-5 h-5">
          <div
            className={`absolute inset-0 ${
              prefersReducedMotion ? '' : 'transition-opacity duration-300'
            }`}
            style={{ opacity: isDark ? 0 : 1 }}
          >
            <Icon path={mdiWeatherSunny} size={1} color="#D4AF37" />
          </div>
          <div
            className={`absolute inset-0 ${
              prefersReducedMotion ? '' : 'transition-opacity duration-300'
            }`}
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
