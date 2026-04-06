'use client';
import { FiSun, FiMoon } from 'react-icons/fi';

import { useTheme } from 'next-themes';
function ThemeButton() {
  const { theme, setTheme } = useTheme();

  const handleToggkeTheme = () => {
    setTheme(theme == 'dark' ? 'light' : 'dark');
  };
  return (
    <button
      onClick={handleToggkeTheme}
      className="p-2 rounded-full border cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-50/20 transition"
    >
      {theme == 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
}

export default ThemeButton;
