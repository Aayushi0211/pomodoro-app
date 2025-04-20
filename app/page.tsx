"use client"

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

export default function PomodoroApp() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer complete
      const sound = new Audio('/notification.mp3');
      sound.play().catch(e => console.log('Audio play failed:', e));
      
      // Switch modes
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60); // 5 minute break
        setCycles(cycles + 1);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60); // Back to 25 minutes focus
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, cycles]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('focus');
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? (1 - timeLeft / (25 * 60)) * 100 
    : (1 - timeLeft / (5 * 60)) * 100;
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8">Pomodoro Timer</h1>
        
        <div className="mb-8 flex justify-center">
          <button 
            className={`px-6 py-2 rounded-l-full ${mode === 'focus' ? 'bg-indigo-500' : 'bg-indigo-800/40'}`}
            onClick={() => {
              if (mode !== 'focus') {
                setMode('focus');
                setTimeLeft(25 * 60);
                setIsRunning(false);
              }
            }}
          >
            <div className="flex items-center">
              <Brain size={18} className="mr-2" />
              Focus
            </div>
          </button>
          <button 
            className={`px-6 py-2 rounded-r-full ${mode === 'break' ? 'bg-indigo-500' : 'bg-indigo-800/40'}`}
            onClick={() => {
              if (mode !== 'break') {
                setMode('break');
                setTimeLeft(5 * 60);
                setIsRunning(false);
              }
            }}
          >
            <div className="flex items-center">
              <Coffee size={18} className="mr-2" />
              Break
            </div>
          </button>
        </div>
        
        <div className="relative h-64 w-64 mx-auto mb-8">
          {/* Progress circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {isRunning ? <Pause /> : <Play />}
          </button>
          <button
            onClick={resetTimer}
            className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <RotateCcw />
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p>Completed Cycles: {cycles}</p>
          <p className="text-sm opacity-75 mt-2">
            {mode === 'focus' ? 'Stay focused and productive!' : 'Take a short break, you earned it!'}
          </p>
        </div>
      </div>
    </div>
  );
}