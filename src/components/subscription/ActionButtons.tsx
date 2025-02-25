
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <Button 
        onClick={() => navigate('/dashboard')} 
        className="w-full bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54] font-semibold py-3 px-6 rounded-lg transition-all"
      >
        Generate Lesson Plan
      </Button>
      <Button 
        onClick={() => navigate('/ask-guro')} 
        className="w-full bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54] font-semibold py-3 px-6 rounded-lg transition-all"
      >
        <MessageSquare className="mr-2" />
        Ask GuroAI
      </Button>
    </div>
  );
};
