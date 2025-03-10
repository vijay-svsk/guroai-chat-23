
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ActionButtons = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMouseEnter = (buttonName: string) => {
    setHoveredButton(buttonName);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const handleXenditPayment = async () => {
    try {
      setIsProcessing(true);
      window.location.href = 'https://checkout.xendit.co/od/guroai.online';
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "There was a problem initiating the payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const buttonClasses = "w-full group relative overflow-hidden bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54] font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg";
  
  return (
    <div className="flex flex-col gap-5">
      <Button 
        onClick={() => navigate('/dashboard')} 
        className={buttonClasses}
        onMouseEnter={() => handleMouseEnter('lesson')}
        onMouseLeave={handleMouseLeave}
        disabled={isProcessing}
      >
        <span className="flex items-center justify-center">
          Generate Lesson Plan
          <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${hoveredButton === 'lesson' ? 'translate-x-1' : ''}`} />
        </span>
        <span className={`absolute bottom-0 left-0 h-1 bg-[#023d54] transition-all duration-300 ${hoveredButton === 'lesson' ? 'w-full' : 'w-0'}`}></span>
      </Button>
      
      <Button 
        onClick={() => navigate('/ask-guro')} 
        className={buttonClasses}
        onMouseEnter={() => handleMouseEnter('ask')}
        onMouseLeave={handleMouseLeave}
        disabled={isProcessing}
      >
        <span className="flex items-center justify-center">
          Ask GuroAI
          <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${hoveredButton === 'ask' ? 'translate-x-1' : ''}`} />
        </span>
        <span className={`absolute bottom-0 left-0 h-1 bg-[#023d54] transition-all duration-300 ${hoveredButton === 'ask' ? 'w-full' : 'w-0'}`}></span>
      </Button>
      
      <Button 
        onClick={() => navigate('/pmes-annotation')} 
        className={buttonClasses}
        onMouseEnter={() => handleMouseEnter('pmes')}
        onMouseLeave={handleMouseLeave}
        disabled={isProcessing}
      >
        <span className="flex items-center justify-center">
          Generate PMES Annotation
          <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${hoveredButton === 'pmes' ? 'translate-x-1' : ''}`} />
        </span>
        <span className={`absolute bottom-0 left-0 h-1 bg-[#023d54] transition-all duration-300 ${hoveredButton === 'pmes' ? 'w-full' : 'w-0'}`}></span>
      </Button>
      
      <Button 
        onClick={() => navigate('/generate-quizzes')} 
        className={buttonClasses}
        onMouseEnter={() => handleMouseEnter('quiz')}
        onMouseLeave={handleMouseLeave}
        disabled={isProcessing}
      >
        <span className="flex items-center justify-center">
          Generate Quizzes
          <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${hoveredButton === 'quiz' ? 'translate-x-1' : ''}`} />
        </span>
        <span className={`absolute bottom-0 left-0 h-1 bg-[#023d54] transition-all duration-300 ${hoveredButton === 'quiz' ? 'w-full' : 'w-0'}`}></span>
      </Button>
      
      <Button 
        onClick={() => window.open('https://www.aidocmaker.com/g0/pptx', '_blank')} 
        className={buttonClasses}
        onMouseEnter={() => handleMouseEnter('powerpoint')}
        onMouseLeave={handleMouseLeave}
        disabled={isProcessing}
      >
        <span className="flex items-center justify-center">
          Generate Powerpoint Presentation
          <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${hoveredButton === 'powerpoint' ? 'translate-x-1' : ''}`} />
        </span>
        <span className={`absolute bottom-0 left-0 h-1 bg-[#023d54] transition-all duration-300 ${hoveredButton === 'powerpoint' ? 'w-full' : 'w-0'}`}></span>
      </Button>
    </div>
  );
};
