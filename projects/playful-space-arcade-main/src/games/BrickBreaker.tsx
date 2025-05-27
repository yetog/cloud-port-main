
import React, { useRef, useEffect, useState } from 'react';
import { Game } from './Game';
import { BrickBreakerEngine } from './engines/BrickBreakerEngine';
import { motion } from 'framer-motion';

interface BrickBreakerProps {
  onExit: () => void;
}

/**
 * Brick Breaker Game Component
 * 
 * A classic brick breaker game where you control a paddle to bounce a ball and break bricks
 */
const BrickBreaker: React.FC<BrickBreakerProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<BrickBreakerEngine>(new BrickBreakerEngine());
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
    
    // Set up event listeners
    const handleMouseMove = (e: MouseEvent) => {
      gameEngineRef.current.movePaddle(e.clientX);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      gameEngineRef.current.handleKeyDown(e);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        gameEngineRef.current.movePaddle(e.touches[0].clientX);
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchmove', handleTouchMove);
    
    // Cleanup on unmount
    return () => {
      gameEngineRef.current.stop();
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  
  // Handler for starting a new game
  const handleStartGame = () => {
    gameEngineRef.current.resetGame();
    gameEngineRef.current.start();
  };
  
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex gap-8">
          <div className="text-xl">
            <span className="text-muted-foreground mr-2">Score:</span>
            <span className="font-semibold">{score}</span>
          </div>
          
          <div className="text-xl">
            <span className="text-muted-foreground mr-2">Lives:</span>
            <div className="inline-flex">
              {[...Array(lives)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-primary"
                >
                  ❤️
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={onExit} 
          className="btn-game btn-primary bg-primary/90 rounded-full px-4 py-2 text-sm"
        >
          Exit Game
        </button>
      </div>
      
      <div className="relative rounded-xl overflow-hidden shadow-xl shadow-primary/10 border border-primary/20">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="game-canvas"
        />
        
        {!isRunning && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center px-8 py-10 rounded-xl bg-card/80 backdrop-blur-md shadow-lg border border-primary/20 max-w-md"
            >
              <h2 className="text-3xl font-bold mb-4">Brick Breaker</h2>
              <p className="text-muted-foreground mb-6">
                Use your paddle to bounce the ball and break all the bricks. Don't let the ball fall!
              </p>
              <button 
                onClick={handleStartGame}
                className="btn-game btn-primary px-8 py-2 rounded-full shadow-lg"
              >
                Play Game
              </button>
            </motion.div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-8 mt-2 text-sm text-muted-foreground">
        <div className="flex items-center">
          <span className="font-medium mr-2">Move:</span>
          <span>Mouse or Arrow Keys</span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium mr-2">Start/Pause:</span>
          <span>Space</span>
        </div>
      </div>
    </div>
  );
};

export const brickBreakerGame: Game = {
  name: "Brick Breaker",
  icon: "🧱",
  description: "Control a paddle to bounce the ball and break colorful bricks in this classic arcade game.",
  start: () => {}, // Implemented within component
  stop: () => {}   // Implemented within component
};

export default BrickBreaker;
