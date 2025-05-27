
import React, { useState, useEffect, useCallback } from 'react';
import { Game } from './Game';
import { Map, MapPin } from 'lucide-react';

interface MazeProps {
  onExit: () => void;
}

// Cell types for the maze
type CellType = 'wall' | 'path' | 'start' | 'end' | 'player';

/**
 * Maze Game Component
 * 
 * A simple maze navigation game where the player moves through the maze to reach the end
 */
const Maze: React.FC<MazeProps> = ({ onExit }) => {
  // Maze configuration
  const rows = 10;
  const cols = 10;
  
  // Simple predefined maze layout
  // 0 = path, 1 = wall, 2 = start, 3 = end
  const mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 1, 0, 3],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  
  // Player position state
  const [playerPos, setPlayerPos] = useState<{ row: number; col: number }>({ row: 1, col: 0 });
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  
  // Convert maze layout to cell types
  const getMaze = useCallback(() => {
    const maze: CellType[][] = [];
    
    for (let i = 0; i < rows; i++) {
      const row: CellType[] = [];
      for (let j = 0; j < cols; j++) {
        if (i === playerPos.row && j === playerPos.col) {
          row.push('player');
        } else if (mazeLayout[i][j] === 1) {
          row.push('wall');
        } else if (mazeLayout[i][j] === 2) {
          row.push('start');
        } else if (mazeLayout[i][j] === 3) {
          row.push('end');
        } else {
          row.push('path');
        }
      }
      maze.push(row);
    }
    
    return maze;
  }, [playerPos]);
  
  // Handle player movement with arrow keys
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (hasWon) return;
    
    const { row, col } = playerPos;
    let newRow = row;
    let newCol = col;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRow = Math.min(rows - 1, row + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newCol = Math.min(cols - 1, col + 1);
        break;
      case 'Escape':
        e.preventDefault();
        onExit();
        return;
    }
    
    // Check if the new position is valid (not a wall)
    if (mazeLayout[newRow][newCol] !== 1) {
      setPlayerPos({ row: newRow, col: newCol });
      setMoves(prev => prev + 1);
      
      // Check win condition
      if (mazeLayout[newRow][newCol] === 3) {
        setHasWon(true);
      }
    }
  }, [playerPos, hasWon, rows, cols, mazeLayout, onExit]);
  
  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // Reset the game
  const resetGame = () => {
    setPlayerPos({ row: 1, col: 0 });
    setHasWon(false);
    setMoves(0);
  };
  
  // Get cell background color based on cell type
  const getCellStyle = (cellType: CellType) => {
    switch (cellType) {
      case 'wall':
        return 'bg-gray-800';
      case 'path':
        return 'bg-muted-foreground/10';
      case 'start':
        return 'bg-green-500/30';
      case 'end':
        return 'bg-red-500/30';
      case 'player':
        return 'bg-primary';
      default:
        return '';
    }
  };
  
  const maze = getMaze();
  
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center justify-between w-full max-w-md mb-2">
        <div className="text-lg">
          Moves: <span className="font-semibold">{moves}</span>
        </div>
        
        <button 
          onClick={onExit} 
          className="btn-game btn-primary bg-primary/90 rounded-full px-4 py-2 text-sm"
        >
          Exit Game
        </button>
      </div>
      
      <div className="border border-border rounded-xl overflow-hidden shadow-md">
        <div 
          className="grid"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 30px)`,
            gridTemplateRows: `repeat(${rows}, 30px)`,
            gap: '2px',
            padding: '4px',
            background: 'var(--card)',
          }}
        >
          {maze.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-7 h-7 rounded-sm ${getCellStyle(cell)}`}
              >
                {cell === 'player' && (
                  <div className="flex items-center justify-center h-full text-primary-foreground">
                    <MapPin size={16} />
                  </div>
                )}
                {cell === 'end' && (
                  <div className="flex items-center justify-center h-full text-red-500">
                    <Map size={16} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mt-2">
        Use arrow keys to navigate the maze
      </div>
      
      {hasWon && (
        <div className="mt-4 text-center">
          <p className="text-xl font-semibold text-primary">You Win!</p>
          <p>You completed the maze in {moves} moves.</p>
          <button 
            onClick={resetGame} 
            className="btn-game btn-primary mt-4"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export const mazeGame: Game = {
  name: "Maze",
  icon: "🧩",
  description: "Navigate through a maze using arrow keys to reach the exit.",
  start: () => {}, // Implemented within component
  stop: () => {}   // Implemented within component
};

export default Maze;
