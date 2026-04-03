'use client';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { themeActions } from '@/store/slice/theme-slice';
import { AppDispatch, RootState } from '@/store/store';
function ThemeButton() {
  const { theme } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const userTheme = (localStorage.getItem('theme') || 'light') as 'light' | 'dark';
    dispatch(themeActions.setTheme(userTheme));
    if (userTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, dispatch]);

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    dispatch(themeActions.toggleTheme());
  };
  return (
    <button
      className="p-2 rounded-md border hover:bg-gray-100 transition"
      onClick={handleToggleTheme}
    >
      {theme == 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
}

export default ThemeButton;
