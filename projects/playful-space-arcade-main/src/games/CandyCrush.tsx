
import React, { useState, useEffect } from 'react';
import { Game } from './Game';

interface CandyCrushProps {
  onExit: () => void;
}

/**
 * Simplified Candy Crush Game Component
 * 
 * A match-3 style game with colored squares
 */
const CandyCrush: React.FC<CandyCrushProps> = ({ onExit }) => {
  const GRID_SIZE = 8;
  const colors = ['#FF5252', '#42A5F5', '#66BB6A', '#FFC107', '#AB47BC', '#26C6DA'];
  
  const [grid, setGrid] = useState<string[][]>([]);
  const [selected, setSelected] = useState<{ row: number, col: number } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(20);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  
  // Initialize the game board
  const initializeGrid = () => {
    const newGrid: string[][] = [];
    
    for (let i = 0; i < GRID_SIZE; i++) {
      newGrid[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        newGrid[i][j] = colors[Math.floor(Math.random() * colors.length)];
      }
    }
    
    // Check for initial matches and fill those
    const gridWithoutMatches = removeInitialMatches(newGrid);
    
    return gridWithoutMatches;
  };
  
  // Remove any matches that exist on game start
  const removeInitialMatches = (grid: string[][]) => {
    let newGrid = [...grid];
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        // Check for horizontal matches of 3 or more
        if (j > 1 && 
            newGrid[i][j] === newGrid[i][j-1] && 
            newGrid[i][j] === newGrid[i][j-2]) {
          let newColor;
          do {
            newColor = colors[Math.floor(Math.random() * colors.length)];
          } while (newColor === newGrid[i][j]);
          
          newGrid[i][j] = newColor;
        }
        
        // Check for vertical matches of 3 or more
        if (i > 1 && 
            newGrid[i][j] === newGrid[i-1][j] && 
            newGrid[i][j] === newGrid[i-2][j]) {
          let newColor;
          do {
            newColor = colors[Math.floor(Math.random() * colors.length)];
          } while (newColor === newGrid[i][j]);
          
          newGrid[i][j] = newColor;
        }
      }
    }
    
    return newGrid;
  };
  
  // Handle candy selection and swapping
  const handleCandyClick = (row: number, col: number) => {
    if (isGameOver) return;
    
    if (selected === null) {
      // Select the first candy
      setSelected({ row, col });
    } else {
      // If the second click is adjacent to the first one, attempt to swap
      if (isAdjacent(selected, { row, col })) {
        const newGrid = [...grid];
        
        // Swap the candies
        const temp = newGrid[selected.row][selected.col];
        newGrid[selected.row][selected.col] = newGrid[row][col];
        newGrid[row][col] = temp;
        
        // Check if the swap creates a match
        const matchFound = checkForMatches(newGrid);
        
        if (matchFound) {
          setGrid(newGrid);
          setMoves(prevMoves => prevMoves - 1);
        } else {
          // If no match, swap back immediately
          setTimeout(() => {
            const revertGrid = [...newGrid];
            revertGrid[row][col] = revertGrid[selected.row][selected.col];
            revertGrid[selected.row][selected.col] = temp;
            setGrid(revertGrid);
          }, 300);
        }
      }
      
      // Reset selection
      setSelected(null);
    }
  };
  
  // Check if two positions are adjacent
  const isAdjacent = (pos1: { row: number, col: number }, pos2: { row: number, col: number }) => {
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };
  
  // Check for matches after a swap
  const checkForMatches = (currentGrid: string[][]) => {
    let matchFound = false;
    let newGrid = [...currentGrid];
    
    // Check for horizontal matches
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE - 2; j++) {
        if (newGrid[i][j] !== '' && 
            newGrid[i][j] === newGrid[i][j+1] && 
            newGrid[i][j] === newGrid[i][j+2]) {
          // Mark matches with empty strings temporarily
          newGrid[i][j] = '';
          newGrid[i][j+1] = '';
          newGrid[i][j+2] = '';
          matchFound = true;
          setScore(prevScore => prevScore + 30);
        }
      }
    }
    
    // Check for vertical matches
    for (let i = 0; i < GRID_SIZE - 2; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[i][j] !== '' && 
            newGrid[i][j] === newGrid[i+1][j] && 
            newGrid[i][j] === newGrid[i+2][j]) {
          // Mark matches with empty strings temporarily
          newGrid[i][j] = '';
          newGrid[i+1][j] = '';
          newGrid[i+2][j] = '';
          matchFound = true;
          setScore(prevScore => prevScore + 30);
        }
      }
    }
    
    // If matches were found, update the grid and cascade down
    if (matchFound) {
      // Let the matched cells briefly show as empty before filling
      setTimeout(() => {
        const cascadedGrid = cascadeDown(newGrid);
        setGrid(cascadedGrid);
        
        // Check for chain reactions after the cascade
        setTimeout(() => {
          const hasMoreMatches = checkForMatches(cascadedGrid);
          if (!hasMoreMatches) {
            // No more chain reactions
          }
        }, 300);
      }, 300);
    }
    
    return matchFound;
  };
  
  // Move candies down to fill empty spaces
  const cascadeDown = (currentGrid: string[][]) => {
    let newGrid = [...currentGrid];
    
    // For each column, move cells down to fill empty spaces
    for (let j = 0; j < GRID_SIZE; j++) {
      let emptySpaces = 0;
      
      // Start from the bottom of the column and move up
      for (let i = GRID_SIZE - 1; i >= 0; i--) {
        if (newGrid[i][j] === '') {
          emptySpaces++;
        } else if (emptySpaces > 0) {
          // Move the cell down by the number of empty spaces
          newGrid[i + emptySpaces][j] = newGrid[i][j];
          newGrid[i][j] = '';
        }
      }
      
      // Fill the top of the column with new random candies
      for (let i = 0; i < emptySpaces; i++) {
        newGrid[i][j] = colors[Math.floor(Math.random() * colors.length)];
      }
    }
    
    return newGrid;
  };
  
  // Start new game
  const startGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setMoves(20);
    setIsGameOver(false);
    setSelected(null);
  };
  
  // Initialize game on component mount
  useEffect(() => {
    startGame();
  }, []);
  
  // Check for game over
  useEffect(() => {
    if (moves <= 0) {
      setIsGameOver(true);
    }
  }, [moves]);
  
  // Check active grid for additional matches
  useEffect(() => {
    // After grid updates, check for new matches (for chain reactions)
    if (grid.length > 0) {
      const timer = setTimeout(() => {
        checkForMatches(grid);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [grid]);
  
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center justify-between w-full max-w-md mb-2">
        <div className="text-2xl font-semibold">
          Score: {score}
        </div>
        
        <div className="text-lg">
          Moves: {moves}
        </div>
        
        <button 
          onClick={onExit} 
          className="btn-game btn-primary bg-primary/90 rounded-full px-4 py-2 text-sm"
        >
          Exit Game
        </button>
      </div>
      
      <div className="game-grid grid-cols-8" style={{ width: '400px', height: '400px' }}>
        {grid.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-full h-full transition-all duration-300 transform cursor-pointer hover:scale-105"
              style={{
                backgroundColor: color,
                border: selected && selected.row === rowIndex && selected.col === colIndex 
                  ? '3px solid white' 
                  : '1px solid rgba(255,255,255,0.2)'
              }}
              onClick={() => handleCandyClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
      
      {isGameOver && (
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
    </div>
  );
};

export const candyCrushGame: Game = {
  name: "Candy Crush",
  icon: "🍬",
  description: "Match 3 or more candies in a row or column. Create combos for extra points.",
  start: () => {}, // Implemented within component
  stop: () => {}   // Implemented within component
};

export default CandyCrush;
