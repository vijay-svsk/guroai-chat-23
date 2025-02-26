
import { PlusCircle, LogOut, History } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  startNewChat: () => void;
  isLoading: boolean;
  onSignOut?: () => void;
  isAuthenticated?: boolean;
  showPreviousChats?: boolean;
  setShowPreviousChats?: (show: boolean) => void;
}

export const ChatHeader = ({ 
  startNewChat, 
  isLoading, 
  onSignOut,
  isAuthenticated,
  showPreviousChats,
  setShowPreviousChats
}: ChatHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-[#023d54]/10">
      <div className="max-w-5xl mx-auto w-full px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo and text removed */}
          </div>
          <div className="flex gap-3">
            {setShowPreviousChats && (
              <Button
                variant="outline" 
                size="sm" 
                onClick={() => setShowPreviousChats(!showPreviousChats)}
                className="flex items-center gap-1 text-[#023d54]"
              >
                <History className="h-4 w-4" />
                <span>Previous Responses</span>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={startNewChat}
              disabled={isLoading}
              className="flex items-center gap-1 text-[#023d54]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Chat</span>
            </Button>
            
            {isAuthenticated && onSignOut && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onSignOut}
                className="flex items-center gap-1 text-[#023d54]"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
