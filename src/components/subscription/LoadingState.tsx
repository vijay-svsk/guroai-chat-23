
import { Clock } from "lucide-react";
import { Header } from "./Header";

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse">
          <Clock className="w-16 h-16 text-[#8cd09b]" />
        </div>
      </div>
    </div>
  );
};
