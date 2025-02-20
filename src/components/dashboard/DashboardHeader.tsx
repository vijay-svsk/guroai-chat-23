
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  email: string;
  onMyAccount: () => void;
}

export const DashboardHeader = ({ email, onMyAccount }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/'); // Changed from '/index' to '/'
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-[#0a1d2c] text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/24e7e402-845e-4126-b717-af2167b4ef23.png" alt="GuroAI Logo" className="h-12 w-12 rounded-md" loading="eager" />
            <div>
              <h2 className="text-xl font-semibold">Welcome to GuroAI!</h2>
              <p className="text-sm text-gray-300">{email}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <Button 
              variant="secondary" 
              onClick={onMyAccount} 
              className="border-white text-slate-900 bg-green-400 hover:bg-green-300 w-full sm:w-fit"
            >
              <User className="w-4 h-4 mr-2" />
              <span>My Account</span>
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleLogout} 
              className="border-white text-slate-900 bg-green-400 hover:bg-green-300 w-full sm:w-fit"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
