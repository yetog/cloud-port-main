
import React, { useState, useEffect } from 'react';
import { Game } from './Game';
import { motion } from 'framer-motion';
import { Cherry, Diamond, DollarSign, Star } from 'lucide-react';

interface SlotMachineProps {
  onExit: () => void;
}

// Possible symbol types for the reels
type SymbolType = 'cherry' | 'diamond' | 'dollar' | 'star';

/**
 * SlotMachine Game Component
 * 
 * A simple slot machine game with 3 reels and 4 different symbols
 */
const SlotMachine: React.FC<SlotMachineProps> = ({ onExit }) => {
  // Number of reels
  const reelCount = 3;
  
  // Symbols for the slot machine
  const symbols: SymbolType[] = ['cherry', 'diamond', 'dollar', 'star'];
  
  // State for current symbols on reels
  const [reels, setReels] = useState<SymbolType[]>(Array(reelCount).fill('cherry'));
  
  // Spin state
  const [spinning, setSpinning] = useState<boolean>(false);
  
  // Game state
  const [coins, setCoins] = useState<number>(100);
  const [message, setMessage] = useState<string>('');
  const [win, setWin] = useState<boolean>(false);
  
  // Spin the reels
  const spinReels = () => {
    // Cost to spin
    const spinCost = 10;
    
    // Check if player has enough coins
    if (coins < spinCost) {
      setMessage("Not enough coins!");
      return;
    }
    
    // Deduct cost
    setCoins(prev => prev - spinCost);
    
    // Reset previous results
    setWin(false);
    setMessage("Spinning...");
    
    // Start spinning animation
    setSpinning(true);
    
    // Generate random results after delay
    setTimeout(() => {
      const newReels = Array(reelCount).fill('').map(() => 
        symbols[Math.floor(Math.random() * symbols.length)]
      );
      
      setReels(newReels);
      setSpinning(false);
      
      // Check for wins
      checkWin(newReels);
    }, 1000);
  };
  
  // Check for winning combinations
  const checkWin = (currentReels: SymbolType[]) => {
    // All symbols match - jackpot!
    if (currentReels.every(symbol => symbol === currentReels[0])) {
      const symbolMultiplier: Record<SymbolType, number> = {
        cherry: 5,
        star: 10,
        dollar: 15,
        diamond: 30
      };
      
      const multiplier = symbolMultiplier[currentReels[0]];
      const winAmount = 10 * multiplier;
      
      setCoins(prev => prev + winAmount);
      setMessage(`JACKPOT! All ${currentReels[0]}s! You won ${winAmount} coins!`);
      setWin(true);
    }
    // Two matching symbols
    else if (
      currentReels[0] === currentReels[1] ||
      currentReels[0] === currentReels[2] ||
      currentReels[1] === currentReels[2]
    ) {
      const winAmount = 15;
      setCoins(prev => prev + winAmount);
      setMessage(`Two matching symbols! You won ${winAmount} coins!`);
      setWin(true);
    }
    // No match
    else {
      setMessage("No match. Try again!");
    }
  };
  
  // Render symbol based on type
  const renderSymbol = (symbol: SymbolType) => {
    switch (symbol) {
      case 'cherry':
        return <Cherry className="text-red-500" />;
      case 'diamond':
        return <Diamond className="text-blue-500" />;
      case 'dollar':
        return <DollarSign className="text-green-500" />;
      case 'star':
        return <Star className="text-yellow-500" />;
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setCoins(100);
    setReels(Array(reelCount).fill('cherry'));
    setMessage('');
    setWin(false);
  };
  
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <div className="flex items-center justify-between w-full max-w-md mb-2">
        <div className="text-xl font-semibold">
          Coins: {coins}
        </div>
        
        <button 
          onClick={onExit} 
          className="btn-game btn-primary bg-primary/90 rounded-full px-4 py-2 text-sm"
        >
          Exit Game
        </button>
      </div>
      
      {/* Slot machine casing */}
      <div className="bg-card border-4 border-secondary rounded-xl p-6 shadow-lg w-full max-w-sm">
        {/* Display */}
        <div className="bg-black/90 rounded-lg p-4 mb-4 text-center">
          <p className={`text-lg font-medium ${win ? 'text-primary animate-pulse' : 'text-white'}`}>
            {message || 'Spin to play!'}
          </p>
        </div>
        
        {/* Reels container */}
        <div className="flex justify-center gap-4 bg-black/80 p-4 rounded-lg mb-6">
          {reels.map((symbol, index) => (
            <motion.div
              key={index}
              className="w-16 h-16 bg-muted flex items-center justify-center rounded-md shadow-inner text-2xl"
              animate={spinning ? { y: [0, -20, 0, -10, 0], opacity: [1, 0.5, 1, 0.5, 1] } : {}}
              transition={spinning ? { duration: 0.5, repeat: 2 } : {}}
            >
              <div className="text-3xl">
                {renderSymbol(symbol)}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Controls */}
        <div className="flex justify-center">
          <button
            onClick={spinReels}
            disabled={spinning || coins < 10}
            className={`btn-game btn-primary rounded-full px-8 py-3 text-lg font-bold shadow-lg ${
              spinning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition'
            }`}
          >
            {spinning ? 'Spinning...' : 'SPIN (10 coins)'}
          </button>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mt-2 text-center max-w-sm">
        <p>Match all three symbols for a jackpot!</p>
        <p>Two matching symbols wins 15 coins.</p>
        <p>Diamonds are the most valuable symbols.</p>
      </div>
      
      {coins <= 0 && (
        <div className="mt-4 text-center">
          <p className="text-xl font-semibold text-destructive">Game Over!</p>
          <p>You're out of coins.</p>
          <button 
            onClick={resetGame} 
            className="btn-game btn-primary mt-4"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export const slotMachineGame: Game = {
  name: "Slot Machine",
  icon: "🎰",
  description: "Spin the reels to match symbols and win coins in this simple slot machine game.",
  start: () => {}, // Implemented within component
  stop: () => {}   // Implemented within component
};

export default SlotMachine;
