
import React from 'react';
import { Game } from '../games/Game';
import { pongGame } from '../games/Pong';
import { alienInvadersGame } from '../games/AlienInvaders';
import { candyCrushGame } from '../games/CandyCrush';
import { memoryMatchGame } from '../games/MemoryMatch';
import { snakeGame } from '../games/Snake';
import { mazeGame } from '../games/Maze';
import { slotMachineGame } from '../games/SlotMachine';
import { flappyBirdGame } from '../games/FlappyBird';
import { brickBreakerGame } from '../games/BrickBreaker';
import { motion } from 'framer-motion';

interface GameMenuProps {
  onSelectGame: (game: Game) => void;
}

/**
 * Game Menu Component
 * 
 * Displays a grid of available games for the user to select
 */
const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  // List of all available games
  const games: Game[] = [
    pongGame,
    alienInvadersGame,
    candyCrushGame,
    memoryMatchGame,
    snakeGame,
    mazeGame,
    slotMachineGame,
    flappyBirdGame,
    brickBreakerGame
  ];
  
  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="animate-fade-in">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {games.map((game, index) => (
          <motion.div
            key={game.name}
            className="group relative overflow-hidden rounded-xl bg-card hover:bg-card/80 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => onSelectGame(game)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex flex-col items-center justify-center h-full p-8 relative z-10">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {game.icon}
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
              
              <p className="text-sm text-muted-foreground text-center mb-6">
                {game.description}
              </p>
              
              <button 
                className="mt-auto btn-game btn-primary px-8 py-2 rounded-full text-sm font-medium 
                           opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectGame(game);
                }}
              >
                Play Now
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GameMenu;
