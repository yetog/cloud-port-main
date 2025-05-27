
import React, { useRef, useEffect, useState } from 'react';
import { Game } from './Game';
import { FlappyBirdEngine } from './engines/FlappyBirdEngine';

interface FlappyBirdProps {
  onExit: () => void;
}

/**
 * Flappy Bird Game Component
 * 
 * A classic flappy bird game where you navigate a bird through pipes
 */
const FlappyBird: React.FC<FlappyBirdProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<FlappyBirdEngine>(new FlappyBirdEngine());
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  
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
      setIsRunning
    );
    
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
        className="game-canvas bg-blue-100 border border-primary/30 shadow-lg shadow-primary/10"
      />
      
      {!isRunning && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <p className="text-lg">Press Enter or Space to Start</p>
          <p>Final Score: {score}</p>
          <button 
            onClick={handleStartGame}
            className="btn-game btn-primary mt-2"
          >
            Play Game
          </button>
        </div>
      )}
      
      <div className="mt-2 text-sm text-muted-foreground">
        Use Space or ↑ to flap. Avoid the pipes and don't hit the ground!
      </div>
    </div>
  );
};

export const flappyBirdGame: Game = {
  name: "Flappy Bird",
  icon: "🐦",
  description: "Navigate a bird through pipes by tapping to flap. Don't hit the pipes or the ground!",
  start: () => {}, // Implemented within component
  stop: () => {}   // Implemented within component
};

export default FlappyBird;
