
import { cn } from "@/lib/utils";
import { GuroAvatar } from "@/components/ui/guro-avatar";
import { useEffect, useState } from "react";

export const WelcomeScreen = () => {
  const [showMessage, setShowMessage] = useState(true);
  const [animate, setAnimate] = useState(false);

  // Add a slight animation delay for better visual effect
  useEffect(() => {
    // Immediately show the component
    setShowMessage(true);
    
    // Add animation class after a tiny delay for better visual effect
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className={cn(
        "text-center mb-4 transition-opacity duration-500",
        animate ? "opacity-100" : "opacity-0"
      )}>
        <h1 className="text-3xl font-bold text-[#023d54] tracking-tight mb-2">
          Hi, I'm GuroAI.
        </h1>
        <p className="text-lg text-[#023d54]/80 tracking-tight">
          How can I help you today?
        </p>
      </div>
      <div className={cn(
        "w-32 h-32 mb-4 transition-all duration-500",
        animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
      )}>
        <GuroAvatar />
      </div>
    </div>
  );
};
