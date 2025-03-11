
import { useState, useEffect } from "react";
import { LoadingState } from "@/components/subscription/LoadingState";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatFooter } from "@/components/chat/ChatFooter";
import { ChatAuth } from "@/components/chat/ChatAuth";
import { ApiKeyForm } from "@/components/chat/ApiKeyForm";
import { useChat } from "@/hooks/use-chat";
import { useChatAuth } from "@/hooks/use-chat-auth";
import { useToast } from "@/hooks/use-toast";
import { checkSubscriptionStatus } from "@/services/subscription-service";

const AskGuro = () => {
  const { userId, isCheckingAuth, redirectToSubscribe, signOut } = useChatAuth();
  const [showPreviousChats, setShowPreviousChats] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(true); // Default to true
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const { toast } = useToast();
  
  // Set default API key on component mount
  useEffect(() => {
    localStorage.setItem("together_api_key", "aaba53e54192b3dd8454bff28451d27c4f8e23de88600cce9d074f4db1dc0066");
  }, []);
  
  const {
    question,
    setQuestion,
    messages,
    isLoading,
    isLoadingHistory,
    chatHistory,
    chatEndRef,
    hasApiKey,
    saveApiKey,
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

  // Check subscription status when user is authenticated
  useEffect(() => {
    setIsSubscribed(true); // Always set to true to bypass subscription check
    setIsCheckingSubscription(false);
  }, [userId]);

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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
      {/* Top bar with Previous Responses and New Chat buttons */}
      <ChatHeader 
        startNewChat={startNewChat} 
        isLoading={isLoading} 
        onSignOut={signOut}
        isAuthenticated={!!userId}
        showPreviousChats={showPreviousChats}
        setShowPreviousChats={setShowPreviousChats}
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
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              chatEndRef={chatEndRef}
              apiKeyMissing={false}
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
        disabled={false}
      />
    </div>
  );
};

export default AskGuro;
