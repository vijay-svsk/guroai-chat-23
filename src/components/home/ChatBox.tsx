
import React from "react";
import { useChatBox } from "./chat/useChatBox";
import { ChatToggleButton, MobileChatToggleButton } from "./chat/ChatToggleButton";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";
import { ApiKeyInput } from "./chat/ApiKeyInput";

export const ChatBox = () => {
  const {
    isOpen,
    message,
    messages,
    isLoading,
    messagesEndRef,
    chatBoxRef,
    setMessage,
    handleToggleChat,
    handleSubmit
  } = useChatBox();

  return (
    <div ref={chatBoxRef} className="fixed z-50 bottom-4 w-full md:w-auto md:right-4">
      {/* Chat icon button - only visible on tablet/desktop */}
      {!isOpen && (
        <div className="hidden md:flex flex-col items-center">
          <ChatToggleButton onClick={handleToggleChat} />
        </div>
      )}

      {/* Mobile chat button - centered at bottom */}
      {!isOpen && (
        <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center">
          <MobileChatToggleButton onClick={handleToggleChat} />
        </div>
      )}

      {/* Chat box */}
      {isOpen && (
        <div className="flex flex-col bg-white rounded-lg shadow-xl max-w-full w-full md:w-[350px] h-[550px] md:h-[450px] border border-gray-200 mx-auto md:mx-0 fixed bottom-0 left-0 right-0 md:bottom-4 md:right-4 md:left-auto">
          {/* Chat header */}
          <ChatHeader onClose={handleToggleChat} />

          {/* Messages container */}
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading} 
            messagesEndRef={messagesEndRef} 
          />

          {/* Message input */}
          <ChatInput
            message={message}
            setMessage={setMessage}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          
          {/* API Key Input */}
          <ApiKeyInput />
        </div>
      )}
    </div>
  );
};
