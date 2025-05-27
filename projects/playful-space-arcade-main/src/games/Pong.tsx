import React, { useRef, useEffect, useState } from 'react';
import { Game } from './Game';

interface PongProps {
  onExit: () => void;
}

/**
 * Pong Game Component
 * 
 * A classic two-player Pong game implementation using HTML Canvas
 */
const Pong: React.FC<PongProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [score, setScore] = useState<{ player1: number; player2: number }>({ player1: 0, player2: 0 });
  
  // Game state variables (using refs so they don't trigger rerenders)
  const gameStateRef = useRef({
    ball: { x: 400, y: 200, dx: 5, dy: 5, radius: 10 },
    paddles: {
      left: { x: 10, y: 175, width: 10, height: 75, dy: 0 },
      right: { x: 780, y: 175, width: 10, height: 75, dy: 0 }
    },
    keysPressed: { w: false, s: false, ArrowUp: false, ArrowDown: false }
  });
  
  // Animation frame request ID for cleanup
  const animationRef = useRef<number | null>(null);

  // Setup game canvas and start the game loop
  const startGame = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Reset game state
    gameStateRef.current = {
      ball: { x: canvas.width / 2, y: canvas.height / 2, dx: 5, dy: 5, radius: 10 },
      paddles: {
        left: { x: 10, y: canvas.height / 2 - 37.5, width: 10, height: 75, dy: 0 },
        right: { x: canvas.width - 20, y: canvas.height / 2 - 37.5, width: 10, height: 75, dy: 0 }
      },
      keysPressed: { w: false, s: false, ArrowUp: false, ArrowDown: false }
    };
    
    setScore({ player1: 0, player2: 0 });
    setIsRunning(true);
    
    // Start the game loop
    const gameLoop = () => {
      updateGame();
      drawGame();
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
  };
  
  // Update game state (ball and paddle positions)
  const updateGame = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const state = gameStateRef.current;
    
    // Update paddles based on keys pressed
    if (state.keysPressed.w) state.paddles.left.y -= 7;
    if (state.keysPressed.s) state.paddles.left.y += 7;
    if (state.keysPressed.ArrowUp) state.paddles.right.y -= 7;
    if (state.keysPressed.ArrowDown) state.paddles.right.y += 7;
    
    // Keep paddles within bounds
    state.paddles.left.y = Math.max(0, Math.min(canvas.height - state.paddles.left.height, state.paddles.left.y));
    state.paddles.right.y = Math.max(0, Math.min(canvas.height - state.paddles.right.height, state.paddles.right.y));
    
    // Update ball position
    state.ball.x += state.ball.dx;
    state.ball.y += state.ball.dy;
    
    // Ball collision with top and bottom walls
    if (state.ball.y - state.ball.radius < 0 || state.ball.y + state.ball.radius > canvas.height) {
      state.ball.dy = -state.ball.dy;
    }
    
    // Ball collision with paddles
    if (
      (state.ball.x - state.ball.radius < state.paddles.left.x + state.paddles.left.width &&
       state.ball.y > state.paddles.left.y && 
       state.ball.y < state.paddles.left.y + state.paddles.left.height) ||
      (state.ball.x + state.ball.radius > state.paddles.right.x &&
       state.ball.y > state.paddles.right.y && 
       state.ball.y < state.paddles.right.y + state.paddles.right.height)
    ) {
      state.ball.dx = -state.ball.dx * 1.05; // Increase speed slightly on paddle hits
    }
    
    // Ball out of bounds - scoring
    if (state.ball.x < 0) {
      // Player 2 scores
      setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
      resetBall();
    } else if (state.ball.x > canvas.width) {
      // Player 1 scores
      setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
      resetBall();
    }
  };
  
  // Reset ball to center after scoring
  const resetBall = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const state = gameStateRef.current;
    
    state.ball.x = canvas.width / 2;
    state.ball.y = canvas.height / 2;
    state.ball.dx = 5 * (Math.random() > 0.5 ? 1 : -1);
    state.ball.dy = 5 * (Math.random() > 0.5 ? 1 : -1);
  };
  
  // Draw game elements on canvas
  const drawGame = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const state = gameStateRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'currentColor';
    ctx.fill();
    
    // Draw paddles
    ctx.fillRect(
      state.paddles.left.x, 
      state.paddles.left.y, 
      state.paddles.left.width, 
      state.paddles.left.height
    );
    
    ctx.fillRect(
      state.paddles.right.x, 
      state.paddles.right.y, 
      state.paddles.right.width, 
      state.paddles.right.height
    );
  };
  
  // Stop the game and clean up
  const stopGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsRunning(false);
  };
  
  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 's' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        gameStateRef.current.keysPressed[e.key as keyof typeof gameStateRef.current.keysPressed] = true;
      }
      
      // Exit game on Escape key
      if (e.key === 'Escape') {
        stopGame();
        onExit();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 's' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        gameStateRef.current.keysPressed[e.key as keyof typeof gameStateRef.current.keysPressed] = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Start game automatically when component mounts
    startGame();
    
    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      stopGame();
    };
  }, [onExit]);
  
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center justify-between w-full max-w-2xl mb-2">
        <div className="text-2xl font-semibold">
          <span className="mr-2">{score.player1}</span>
          <span>:</span>
          <span className="ml-2">{score.player2}</span>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Player 1: W/S keys</p>
          <p className="text-sm text-muted-foreground">Player 2: ↑/↓ keys</p>
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
        height={400} 
        className="game-canvas bg-card"
      />
      
      {!isRunning && (
        <button 
          onClick={startGame}
          className="btn-game btn-primary mt-4"
        >
          Start Game
        </button>
      )}
    </div>
  );
};

export const pongGame: Game = {
  name: "Pong",
  icon: "🏓",
  description: "Classic two-player Pong. Use W/S and arrow keys to move paddles.",
  start: () => {}, // Implemented within component
  stop: () => {}   // Implemented within component
};

export default Pong;
