
import { Clock } from "lucide-react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimerProps {
  timeRemaining: TimeRemaining;
  progressPercentage: number;
}

export const Timer = ({ timeRemaining, progressPercentage }: TimerProps) => {
  return (
    <div className="relative mx-auto w-48 h-48">
      <div 
        className="absolute inset-0 rounded-full transition-all duration-1000 ease-in-out"
        style={{
          background: `conic-gradient(#8cd09b ${progressPercentage}%, #e5e7eb ${progressPercentage}%)`,
          transform: 'rotate(-90deg)',
          transition: 'all 1s linear'
        }}
      />
      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-1 text-[#8cd09b] animate-pulse" />
          <div className="space-y-1">
            <p className="text-xl font-bold text-[#023d54]">
              {timeRemaining.days}d {timeRemaining.hours}h
            </p>
            <p className="text-sm text-[#023d54]">
              {timeRemaining.minutes}m {timeRemaining.seconds}s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
