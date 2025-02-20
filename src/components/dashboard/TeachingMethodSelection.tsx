
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

interface TeachingMethodSelectionProps {
  onMethodSelect: (method: "7es" | "4as") => void;
}

export const TeachingMethodSelection = ({ onMethodSelect }: TeachingMethodSelectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-guro-blue mb-4">
        Select Your Teaching Method
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={() => onMethodSelect("7es")} 
          className="h-auto p-6 bg-guro-blue hover:bg-guro-blue/90 flex flex-col items-center space-y-2 px-[24px]"
        >
          <Award className="w-8 h-8" />
          <span className="text-lg font-semibold">7Es Method</span>
          <div className="opacity-90 text-sm text-center">
            <div>Elicit, Engage, Explore, Explain</div>
            <div>Elaborate, Evaluate, Extend</div>
          </div>
        </Button>

        <Button 
          onClick={() => onMethodSelect("4as")} 
          variant="secondary" 
          className="h-auto p-6 flex flex-col items-center space-y-2"
        >
          <Award className="w-8 h-8" />
          <span className="text-lg font-semibold">4As Method</span>
          <span className="text-sm opacity-90">
            Activity, Analysis, Abstraction, Application
          </span>
        </Button>
      </div>
    </div>
  );
};
