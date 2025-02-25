
import { useState, useEffect } from "react";
import { LoadingState } from "@/components/subscription/LoadingState";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatFooter } from "@/components/chat/ChatFooter";
import { ChatAuth } from "@/components/chat/ChatAuth";
import { useChat } from "@/hooks/use-chat";
import { useChatAuth } from "@/hooks/use-chat-auth";
import { useToast } from "@/hooks/use-toast";

const AskGuro = () => {
  const { userId, isCheckingAuth, redirectToSubscribe, signOut } = useChatAuth();
  const [showPreviousChats, setShowPreviousChats] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { toast } = useToast();
  
  const {
    question,
    setQuestion,
    messages,
    isLoading,
    isLoadingHistory,
    chatHistory,
    chatEndRef,
    startNewChat,
    loadChatSession,
    handleSubmit,
    handleFileUpload,
    handleImageGeneration,
  } = useChat(userId);

  // Improve initial loading experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Show welcome toast when user successfully logs in
  useEffect(() => {
    if (userId && !isCheckingAuth && !isPageLoading) {
      toast({
        title: "Welcome to GuroAI Chat",
        description: "Ask any question to get started",
        duration: 3000,
      });
    }
  }, [userId, isCheckingAuth, isPageLoading, toast]);

  // Only show loading state if we're still checking auth AND loading is taking longer than expected
  if ((isCheckingAuth || isLoadingHistory) && isPageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
        <div className="flex-1 flex items-center justify-center">
          <LoadingState />
        </div>
      </div>
    );
  }

  // Show subscription screen if user isn't authenticated
  if (!userId && !isCheckingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc] py-10">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/d07b2441-830b-4ce2-89e4-3e17b7f268b4.png" 
                alt="GuroAI Logo" 
                className="h-32 w-auto" 
              />
            </div>
          </div>
          <ChatAuth onSubscribe={redirectToSubscribe} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
      {/* Top bar with New Chat button */}
      <ChatHeader 
        startNewChat={startNewChat} 
        isLoading={isLoading} 
        onSignOut={signOut}
        isAuthenticated={!!userId}
      />

      <div className="flex flex-1 max-w-5xl mx-auto w-full px-4 relative">
        {/* Previous Responses Sidebar */}
        <ChatSidebar 
          showPreviousChats={showPreviousChats}
          setShowPreviousChats={setShowPreviousChats}
          chatHistory={chatHistory}
          loadChatSession={(id) => {
            loadChatSession(id);
            setShowPreviousChats(false);
          }}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Always show WelcomeScreen while no messages, even during initial loading */}
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              chatEndRef={chatEndRef}
            />
          )}
        </div>
      </div>

      {/* Chat Input and Footer */}
      <ChatFooter
        question={question}
        setQuestion={setQuestion}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        userId={userId}
        onFileUpload={handleFileUpload}
        onImageGenerate={handleImageGeneration}
      />
    </div>
  );
};

export default AskGuro;
