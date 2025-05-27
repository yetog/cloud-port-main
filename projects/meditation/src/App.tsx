import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function App() {
  const [duration, setDuration] = useState(300); // 5 minutes default
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval: number;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration);
    }
    setIsRunning(!isRunning);
  };

  const handleDurationChange = (minutes: number) => {
    const newDuration = minutes * 60;
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsRunning(false);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Mindful Minutes</h1>
        
        <div className="text-6xl font-mono text-white text-center mb-8">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {[5, 10, 15, 20].map((mins) => (
            <button
              key={mins}
              onClick={() => handleDurationChange(mins)}
              className={`px-4 py-2 rounded-lg transition-all ${
                duration === mins * 60
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-all"
          >
            {isRunning ? (
              <Pause className="w-8 h-8 text-purple-600" />
            ) : (
              <Play className="w-8 h-8 text-purple-600" />
            )}
          </button>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center hover:bg-white/30 transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        <p className="text-white/80 text-center mt-8 text-sm">
          Find your peace, one breath at a time
        </p>
      </div>
    </div>
  );
}

export default App;