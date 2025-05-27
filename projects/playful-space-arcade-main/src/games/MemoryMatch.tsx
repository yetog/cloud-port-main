
import React, { useState, useEffect } from 'react';
import { Game } from './Game';

interface MemoryMatchProps {
  onExit: () => void;
}

/**
 * Memory Match Game Component
 * 
 * A card-matching memory game where you flip pairs of cards to find matches
 */
const MemoryMatch: React.FC<MemoryMatchProps> = ({ onExit }) => {
  const GRID_SIZE = 4; // 4x4 grid
  const cardColors = [
    '#FF5252', '#FF5252', // Red (pair)
    '#42A5F5', '#42A5F5', // Blue (pair)
    '#66BB6A', '#66BB6A', // Green (pair)
    '#FFC107', '#FFC107', // Yellow (pair)
    '#AB47BC', '#AB47BC', // Purple (pair)
    '#26C6DA', '#26C6DA', // Cyan (pair)
    '#FF7043', '#FF7043', // Orange (pair)
    '#EC407A', '#EC407A'  // Pink (pair)
  ];
  
  // Card type definition
  type Card = {
    id: number;
    color: string;
    isFlipped: boolean;
    isMatched: boolean;
  };
  
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  
  // Initialize the game board
  const initializeCards = () => {
    // Create a new shuffled deck of cards
    let newCards = [...cardColors].map((color, index) => ({
      id: index,
      color,
      isFlipped: false,
      isMatched: false
    }));
    
    // Shuffle the cards
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }
    
    return newCards;
  };
  
  // Handle card click
  const handleCardClick = (index: number) => {
    // Don't allow flipping if game is over or card is already flipped or matched
    if (isGameOver || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }
    
    // Don't allow more than 2 cards to be flipped at once
    if (flippedIndices.length === 2) {
      return;
    }
    
    // Start the game timer on the first card flip
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    // Flip the card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    
    // Add card to flipped cards
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    // If we have flipped 2 cards, check for a match
    if (newFlippedIndices.length === 2) {
      setMoves(prevMoves => prevMoves + 1);
      
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      if (newCards[firstIndex].color === newCards[secondIndex].color) {
        // If colors match, mark cards as matched
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setMatches(prevMatches => {
          const newMatches = prevMatches + 1;
          // Check if all matches are found
          if (newMatches === cardColors.length / 2) {
            setIsGameOver(true);
            setGameStarted(false);
          }
          return newMatches;
        });
      } else {
        // If colors don't match, flip cards back after a delay
        setTimeout(() => {
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };
  
  // Start a new game
  const startGame = () => {
    setCards(initializeCards());
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setIsGameOver(false);
    setTimer(0);
    setGameStarted(false);
  };
  
  // Initialize game on component mount
  useEffect(() => {
    startGame();
  }, []);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (gameStarted && !isGameOver) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, isGameOver]);
  
  // Format timer as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="flex items-center justify-between w-full max-w-md mb-2">
        <div className="text-lg">
          Moves: {moves}
        </div>
        
        <div className="text-lg">
          Time: {formatTime(timer)}
        </div>
        
        <button 
          onClick={onExit} 
          className="btn-game btn-primary bg-primary/90 rounded-full px-4 py-2 text-sm"
        >
          Exit Game
        </button>
      </div>
      
      <div 
        className="grid gap-4 p-4"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: '400px',
          height: '400px'
        }}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`w-full h-full rounded-md transition-all duration-300 transform cursor-pointer ${
              card.isFlipped || card.isMatched ? '' : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: card.isFlipped || card.isMatched ? card.color : 'var(--card)',
              border: '1px solid var(--border)',
              transform: `rotateY(${card.isFlipped || card.isMatched ? '180deg' : '0deg'})`,
              transformStyle: 'preserve-3d',
              boxShadow: card.isMatched ? '0 0 8px rgba(255,255,255,0.5)' : 'none'
            }}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      
      {isGameOver && (
        <div className="mt-4 text-center">
          <p className="text-xl font-semibold">Game Complete!</p>
          <p>Time: {formatTime(timer)}</p>
          <p>Moves: {moves}</p>
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

export const memoryMatchGame: Game = {
  name: "Memory Match",
  icon: "🎴",
  description: "Flip and match pairs of cards. Find all matches with the fewest moves.",
  start: () => {}, // Implemented within component
  stop: () => {}   // Implemented within component
};

export default MemoryMatch;
