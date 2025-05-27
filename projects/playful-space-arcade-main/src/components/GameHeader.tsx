
import React from 'react';
import { Gamepad2 } from 'lucide-react';

const GameHeader: React.FC = () => {
  return (
    <header className="mb-10">
      <div className="flex items-center justify-center">
        <Gamepad2 className="w-10 h-10 mr-3 text-primary animate-pulse" />
        <h1 className="text-5xl font-bold tracking-tight">
          Game<span className="text-primary">Hub</span>
        </h1>
      </div>
      <p className="mt-3 text-muted-foreground text-center max-w-md mx-auto">
        Your collection of classic arcade games in one place
      </p>
    </header>
  );
};

export default GameHeader;
