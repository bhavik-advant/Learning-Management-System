'use client';

import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-300 border-gray-400'
      }`}
    >
      <div
        className={`w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md transform transition-all duration-300 ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDark ? <FiSun size={14} className="text-black" /> : <FiMoon size={14} />}
      </div>
    </button>
  );
}

export default ThemeButton;
