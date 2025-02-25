
import { cn } from "@/lib/utils";
import { GuroAvatar } from "@/components/ui/guro-avatar";

export const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-center mb-4 animate-fade-in">
        <h1 className="text-3xl font-bold text-[#023d54] tracking-tight mb-2">
          Hi, I'm GuroAI.
        </h1>
        <p className="text-lg text-[#023d54]/80 tracking-tight">
          How can I help you today?
        </p>
      </div>
      <div className={cn("w-32 h-32 mb-4")}>
        <GuroAvatar />
      </div>
    </div>
  );
};
