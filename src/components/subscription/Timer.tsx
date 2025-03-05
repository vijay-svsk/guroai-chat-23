
import { TimeRemaining } from "@/utils/time-utils";

interface TimerProps {
  timeRemaining: TimeRemaining;
  progressPercentage: number;
}

export const Timer = ({ timeRemaining, progressPercentage }: TimerProps) => {
  const { days, hours, minutes, seconds } = timeRemaining;
  
  // Function to determine color based on days remaining
  const getTimeColor = () => {
    if (days <= 5) return "text-red-500";
    if (days <= 10) return "text-orange-500";
    return "text-[#023d54]";
  };

  // Background gradient logic
  const gradientStyle = {
    background: `conic-gradient(#8cd09b ${progressPercentage}%, #e0e9ed ${progressPercentage}%)`,
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[#023d54]">Subscription Time Remaining</h3>
      </div>
      
      <div className="relative flex items-center justify-center">
        <div 
          className="subscription-timer w-52 h-52 rounded-full flex items-center justify-center"
          style={gradientStyle}
        >
          <div className="bg-white w-44 h-44 rounded-full flex items-center justify-center shadow-inner">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className={`text-5xl font-bold ${getTimeColor()}`}>
                {days}
              </div>
              <div className="text-gray-500 font-medium mt-1">
                {days === 1 ? "Day" : "Days"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <div className="text-center w-16">
          <div className="bg-[#023d54]/5 rounded-lg p-2">
            <div className="text-xl font-bold text-[#023d54]">{hours}</div>
            <div className="text-xs text-gray-500">Hours</div>
          </div>
        </div>
        <div className="text-center w-16">
          <div className="bg-[#023d54]/5 rounded-lg p-2">
            <div className="text-xl font-bold text-[#023d54]">{minutes}</div>
            <div className="text-xs text-gray-500">Minutes</div>
          </div>
        </div>
        <div className="text-center w-16">
          <div className="bg-[#023d54]/5 rounded-lg p-2">
            <div className="text-xl font-bold text-[#023d54]">{seconds}</div>
            <div className="text-xs text-gray-500">Seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
};
