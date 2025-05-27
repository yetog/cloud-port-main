
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className="fixed top-6 right-6 p-2 rounded-full glass transition-all duration-300 hover:scale-110 focus:outline-none"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-6 w-6 text-foreground" />
      ) : (
        <Sun className="h-6 w-6 text-foreground" />
      )}
    </button>
  );
};

export default ThemeToggle;
