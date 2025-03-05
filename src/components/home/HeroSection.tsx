
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, FileText, PresentationIcon, HelpCircle, Clipboard } from "lucide-react";

interface HeroSectionProps {
  onStartTrial: () => void;
}

export const HeroSection = ({ onStartTrial }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center space-y-8 px-4 py-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-guro-green/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-guro-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <h1 className="text-5xl md:text-7xl font-bold text-guro-blue text-center animate-fade-in max-w-5xl">
        Transform Your Teaching with AI-Powered Lesson Planning
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 text-center max-w-3xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
        Create DepEd-compliant lesson plans, presentations, quizzes, and more in seconds, not hours
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all duration-300">
          <FileText className="h-10 w-10 text-guro-blue mb-3" />
          <h3 className="font-semibold text-guro-blue">Lesson Plans</h3>
          <p className="text-sm text-gray-600 mt-2">Generate complete 7Es or 4As format lesson plans in seconds</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all duration-300">
          <PresentationIcon className="h-10 w-10 text-guro-blue mb-3" />
          <h3 className="font-semibold text-guro-blue">Presentations</h3>
          <p className="text-sm text-gray-600 mt-2">Create professional PowerPoint slides with just a few clicks</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all duration-300">
          <Clipboard className="h-10 w-10 text-guro-blue mb-3" />
          <h3 className="font-semibold text-guro-blue">Quizzes</h3>
          <p className="text-sm text-gray-600 mt-2">Generate comprehensive quizzes with answer keys instantly</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all duration-300">
          <BookOpen className="h-10 w-10 text-guro-blue mb-3" />
          <h3 className="font-semibold text-guro-blue">PMES Annotation</h3>
          <p className="text-sm text-gray-600 mt-2">Ensure DepEd compliance with automated PMES annotations</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in px-6 w-full sm:w-auto mt-6" style={{ animationDelay: "0.4s" }}>
        <Button 
          onClick={onStartTrial}
          className="bg-guro-blue hover:bg-guro-blue/90 text-white px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-105"
        >
          Unlock Full Access - Only ₱299/month
        </Button>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            onClick={() => navigate('/ask-guro')}
            variant="outline" 
            className="border-guro-blue text-guro-blue hover:bg-guro-blue/5 px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-105"
          >
            Ask GuroAI
          </Button>
          <Button 
            onClick={() => navigate('/newuseraccountlogin')}
            className="bg-[#94DEA5] hover:bg-[#94DEA5]/90 text-guro-blue px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-105"
          >
            Account Login
          </Button>
        </div>
      </div>
      
      <div className="text-center mt-8 text-gray-600 animate-fade-in" style={{ animationDelay: "0.5s" }}>
        <p className="max-w-2xl mx-auto">
          Join thousands of Filipino teachers already saving 5+ hours every week on lesson planning. 
          GuroAI is purpose-built for the Philippine curriculum.
        </p>
      </div>
    </section>
  );
};
