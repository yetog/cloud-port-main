
import { ThemeProvider } from '../contexts/ThemeContext';
import GameHub from '../components/GameHub';

/**
 * Index Page Component
 * 
 * Main entry point for the game hub application
 */
const Index = () => {
  return (
    <ThemeProvider>
      <GameHub />
    </ThemeProvider>
  );
};

export default Index;
