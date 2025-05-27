
import React, { useRef, useEffect, useState } from 'react';
import { Game } from './Game';

interface SnakeProps {
  onExit: () => void;
}

/**
 * Snake Game Component
 * 
 * Classic snake game where the player controls a snake to eat food and grow
 */
const Snake: React.FC<SnakeProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  
  // Game state variables
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: 'right',
    nextDirection: 'right',
    gridSize: 20,
    speed: 150, // ms
    canChangeDirection: true
  });
  
  // Timer reference for game loop
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start the game
  const startGame = () => {
    if (canvasRef.current) {
      // Reset game state
      const canvas = canvasRef.current;
      const cellSize = canvas.width / gameStateRef.current.gridSize;
      
      gameStateRef.current = {
        snake: [{ x: 10, y: 10 }],
        food: generateFood(),
        direction: 'right',
        nextDirection: 'right',
        gridSize: 20,
        speed: 150,
        canChangeDirection: true
      };
      
      setScore(0);
      setGameOver(false);
      setIsRunning(true);
      
      // Start the game loop
      startGameLoop();
    }
  };
  
  // Generate random food position
  const generateFood = () => {
    const state = gameStateRef.current;
    const position = {
      x: Math.floor(Math.random() * state.gridSize),
      y: Math.floor(Math.random() * state.gridSize)
    };
    
    // Make sure food doesn't appear on snake
    for (const segment of state.snake) {
      if (segment.x === position.x && segment.y === position.y) {
        return generateFood(); // Recursively try again
      }
    }
    
    return position;
  };
  
  // Game loop
  const startGameLoop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      if (!isRunning) return;
      
      updateGame();
      drawGame();
    }, gameStateRef.current.speed);
  };
  
  // Update game state
  const updateGame = () => {
    const state = gameStateRef.current;
    
    // Update direction from the nextDirection
    state.direction = state.nextDirection;
    state.canChangeDirection = true;
    
    // Calculate new head position
    const head = { ...state.snake[0] };
    switch (state.direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
    }
    
    // Check for wall collision
    if (
      head.x < 0 || 
      head.x >= state.gridSize || 
      head.y < 0 || 
      head.y >= state.gridSize
    ) {
      setGameOver(true);
      setIsRunning(false);
      return;
    }
    
    // Check for self collision
    for (const segment of state.snake) {
      if (head.x === segment.x && head.y === segment.y) {
        setGameOver(true);
        setIsRunning(false);
        return;
      }
    }
    
    // Add new head
    state.snake.unshift(head);
    
    // Check for food collision
    if (head.x === state.food.x && head.y === state.food.y) {
      // Increase score
      setScore(prevScore => prevScore + 10);
      
      // Generate new food
      state.food = generateFood();
      
      // Increase speed slightly for challenge
      if (state.speed > 50) {
        state.speed -= 2;
      }
    } else {
      // Remove tail if no food was eaten
      state.snake.pop();
    }
  };
  
  // Draw game elements on canvas
  const drawGame = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const state = gameStateRef.current;
    const cellSize = canvas.width / state.gridSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = 'currentColor';
    for (let i = 0; i < state.snake.length; i++) {
      const segment = state.snake[i];
      
      // Draw each segment with a slight gap for visual separation
      ctx.fillRect(
        segment.x * cellSize + 1, 
        segment.y * cellSize + 1, 
        cellSize - 2, 
        cellSize - 2
      );
    }
    
    // Draw food
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(
      state.food.x * cellSize + cellSize / 2,
      state.food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw grid (optional, can be removed for cleaner look)
    // ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    // ctx.lineWidth = 0.5;
    // for (let i = 0; i <= state.gridSize; i++) {
    //   ctx.beginPath();
    //   ctx.moveTo(i * cellSize, 0);
    //   ctx.lineTo(i * cellSize, canvas.height);
    //   ctx.stroke();
    //   
    //   ctx.beginPath();
    //   ctx.moveTo(0, i * cellSize);
    //   ctx.lineTo(canvas.width, i * cellSize);
    //   ctx.stroke();
    // }
  };
  
  // Stop the game
  const stopGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };
  
  // Handle keyboard input for controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStateRef.current.canChangeDirection) return;
      
      const state = gameStateRef.current;
      let newDirection = state.direction;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (state.direction !== 'down') newDirection = 'up';
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (state.direction !== 'up') newDirection = 'down';
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (state.direction !== 'right') newDirection = 'left';
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (state.direction !== 'left') newDirection = 'right';
          break;
        case 'Escape':
          e.preventDefault();
          stopGame();
          onExit();
          return;
      }
      
      if (newDirection !== state.direction) {
        state.nextDirection = newDirection;
        state.canChangeDirection = false; // Prevent multiple direction changes in a single game update
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopGame();
    };
  }, [onExit]);
  
  // Initialize the game when component mounts
  useEffect(() => {
    drawGame();
    return () => stopGame();
  }, []);
  
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center justify-between w-full max-w-md mb-2">
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
        width={400} 
        height={400} 
        className="game-canvas bg-card"
      />
      
      <div className="text-sm text-muted-foreground mt-2">
        Use arrow keys to control the snake
      </div>
      
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-xl font-semibold">Game Over</p>
          <p>Final Score: {score}</p>
          <button 
            onClick={startGame} 
            className="btn-game btn-primary mt-2"
          >
            Play Again
          </button>
        </div>
      )}
      
      {!isRunning && !gameOver && (
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

export const snakeGame: Game = {
  name: "Snake",
  icon: "🐍",
  description: "Control the snake to eat food and grow without hitting walls or yourself.",
  start: () => {}, // Implemented within component
  stop: () => {}   // Implemented within component
};

export default Snake;
