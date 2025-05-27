
import React, { useState } from 'react';
import { Game } from '../games/Game';
import GameMenu from './GameMenu';
import GameHeader from './GameHeader';
import Pong from '../games/Pong';
import AlienInvaders from '../games/AlienInvaders';
import CandyCrush from '../games/CandyCrush';
import MemoryMatch from '../games/MemoryMatch';
import Snake from '../games/Snake';
import Maze from '../games/Maze';
import SlotMachine from '../games/SlotMachine';
import FlappyBird from '../games/FlappyBird';
import BrickBreaker from '../games/BrickBreaker';
import ThemeToggle from './ThemeToggle';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/**
 * Game Hub Component
 * 
 * The main component that manages game selection and rendering
 */
const GameHub: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  // Handler for game selection
  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    game.start();
  };
  
  // Handler for returning to menu
  const handleExitGame = () => {
    if (selectedGame) {
      selectedGame.stop();
    }
    setSelectedGame(null);
  };
  
  // Render the current game or menu
  const renderContent = () => {
    if (!selectedGame) {
      return (
        <motion.div
          key="menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GameHeader />
          <GameMenu onSelectGame={handleSelectGame} />
        </motion.div>
      );
    }
    
    const GameComponent = () => {
      switch (selectedGame.name) {
        case 'Pong':
          return <Pong onExit={handleExitGame} />;
        case 'Alien Invaders':
          return <AlienInvaders onExit={handleExitGame} />;
        case 'Candy Crush':
          return <CandyCrush onExit={handleExitGame} />;
        case 'Memory Match':
          return <MemoryMatch onExit={handleExitGame} />;
        case 'Snake':
          return <Snake onExit={handleExitGame} />;
        case 'Maze':
          return <Maze onExit={handleExitGame} />;
        case 'Slot Machine':
          return <SlotMachine onExit={handleExitGame} />;
        case 'Flappy Bird':
          return <FlappyBird onExit={handleExitGame} />;
        case 'Brick Breaker':
          return <BrickBreaker onExit={handleExitGame} />;
        default:
          return null;
      }
    };
    
    return (
      <motion.div
        key="game"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="mb-6 flex items-center">
          <button 
            onClick={handleExitGame}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to menu</span>
          </button>
          <h2 className="text-2xl font-bold mx-auto pr-24">{selectedGame.name}</h2>
        </div>
        <GameComponent />
      </motion.div>
    );
  };
  
  return (
    <div className="min-h-screen w-full p-6 sm:p-8 md:p-10 overflow-hidden">
      <ThemeToggle />
      
      <div className="max-w-6xl mx-auto pt-10">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameHub;
