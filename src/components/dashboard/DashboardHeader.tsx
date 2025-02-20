
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface DashboardHeaderProps {
  email: string;
  onMyAccount: () => void;
}

export const DashboardHeader = ({ email, onMyAccount }: DashboardHeaderProps) => {
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
          <Button 
            variant="secondary" 
            onClick={onMyAccount} 
            className="border-white text-slate-900 bg-green-400 hover:bg-green-300 w-fit mx-auto sm:mx-0 sm:w-fit"
          >
            <User className="w-4 h-4 mr-2" />
            <span>My Account</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
