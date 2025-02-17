
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  email: string;
  onLogout: () => Promise<void>;
}

export const DashboardHeader = ({ email, onLogout }: DashboardHeaderProps) => {
  return (
    <header className="bg-[#0a1d2c] text-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/lovable-uploads/24e7e402-845e-4126-b717-af2167b4ef23.png" alt="GuroAI Logo" className="h-12 w-12 rounded-md" loading="eager" />
            <div>
              <h2 className="text-xl font-semibold">Welcome to GuroAI!</h2>
              <p className="text-sm text-gray-300">{email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="border-white text-slate-900 bg-green-400 hover:bg-green-300">
            <LogOut className="w-4 h-4 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
