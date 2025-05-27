
import React, { useRef, useEffect, useState } from 'react';
import { Game } from './Game';
import { AlienInvadersEngine } from './engines/AlienInvadersEngine';

interface AlienInvadersProps {
  onExit: () => void;
}

/**
 * Alien Invaders Game Component
 * 
 * A classic space invaders style game with enhanced visuals
 */
const AlienInvaders: React.FC<AlienInvadersProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<AlienInvadersEngine>(new AlienInvadersEngine());
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  
  // Initialize game on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;
    
    // Initialize game engine with callbacks
    gameEngineRef.current.init(
      canvas,
      setScore,
      setLives,
      setIsRunning
    );
    
    // Start the game
    gameEngineRef.current.start();
    setIsRunning(true);
    
    // Cleanup on unmount
    return () => {
      gameEngineRef.current.stop();
    };
  }, []);
  
  // Handler for starting a new game
  const handleStartGame = () => {
    gameEngineRef.current.resetGame();
    gameEngineRef.current.start();
  };
  
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center justify-between w-full max-w-2xl mb-2">
        <div className="text-2xl font-semibold">
          Score: {score}
        </div>
        
        <div className="flex items-center gap-2">
          <span>Lives: </span>
          {[...Array(lives)].map((_, i) => (
            <span key={i} className="text-destructive">♥</span>
          ))}
        </div>
        
        <button 
          onClick={onExit} 
          className="btn-game btn-primary bg-primary/90 rounded-full px-4 py-2 text-sm"
        >
          Exit Game
        </button>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="game-canvas bg-black border border-primary/30 shadow-lg shadow-primary/10"
      />
      
      {!isRunning && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <p className="text-lg">Game Over</p>
          <p>Final Score: {score}</p>
          <button 
            onClick={handleStartGame}
            className="btn-game btn-primary mt-2"
          >
            Play Again
          </button>
        </div>
      )}
      
      <div className="mt-2 text-sm text-muted-foreground">
        Use arrow keys to move and space to shoot.
      </div>
    </div>
  );
};

export const alienInvadersGame: Game = {
  name: "Alien Invaders",
  icon: "👾",
  description: "Destroy the alien invasion. Use arrow keys to move and space to shoot.",
  start: () => {}, // Implemented within component
  stop: () => {}   // Implemented within component
};

export default AlienInvaders;
