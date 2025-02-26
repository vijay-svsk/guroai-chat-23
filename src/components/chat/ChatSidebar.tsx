
import { cn } from "@/lib/utils";
import { ChatSession } from "@/hooks/use-chat";

interface ChatSidebarProps {
  showPreviousChats: boolean;
  setShowPreviousChats: (show: boolean) => void;
  chatHistory: ChatSession[];
  loadChatSession: (id: string) => void;
}

export const ChatSidebar = ({
  showPreviousChats,
  setShowPreviousChats,
  chatHistory,
  loadChatSession
}: ChatSidebarProps) => {
  return (
    <div className="relative">
      <div 
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white shadow-lg transition-all duration-300 transform z-20 border-r border-gray-200 pt-16",
          showPreviousChats ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 overflow-y-auto h-full">
          <h3 className="font-medium text-lg mb-4 text-[#023d54]">Chat History</h3>
          {chatHistory.length === 0 ? (
            <p className="text-gray-500">No previous chats found</p>
          ) : (
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <div 
                  key={chat.id} 
                  className="p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => loadChatSession(chat.id)}
                >
                  <p className="font-medium text-sm text-[#023d54]">{chat.message}</p>
                  <p className="text-xs text-gray-500">{chat.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay to close sidebar when clicked outside */}
      {showPreviousChats && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setShowPreviousChats(false)}
        />
      )}
    </div>
  );
};
