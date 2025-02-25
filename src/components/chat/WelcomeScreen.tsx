
import { cn } from "@/lib/utils";

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
        <img 
          src="/lovable-uploads/6b460b9b-d9f1-4fe6-9b8d-ae00fed6bff0.png"
          alt="GuroAI Character"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};
