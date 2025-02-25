
import { useState } from "react";
import { LoadingState } from "@/components/subscription/LoadingState";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatFooter } from "@/components/chat/ChatFooter";
import { useChat } from "@/hooks/use-chat";
import { useChatAuth } from "@/hooks/use-chat-auth";

const AskGuro = () => {
  const { userId } = useChatAuth();
  const [showPreviousChats, setShowPreviousChats] = useState(false);
  
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

  if (isLoadingHistory) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
        <div className="flex-1 flex items-center justify-center">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#023d54] tracking-tight mb-2">
              Please Sign In
            </h1>
            <p className="text-2xl text-[#023d54]/80 tracking-tight">
              Sign in to start chatting with GuroAI
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
      {/* Top bar with New Chat button */}
      <ChatHeader startNewChat={startNewChat} isLoading={isLoading} />

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
