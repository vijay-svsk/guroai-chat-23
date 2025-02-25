
import { LoadingState } from "@/components/subscription/LoadingState";
import { ChatMessage } from "./ChatMessage";
import { GuroAvatar } from "@/components/ui/guro-avatar";

interface ChatMessagesProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessages = ({ messages, isLoading, chatEndRef }: ChatMessagesProps) => {
  return (
    <div className="flex-1 py-8 space-y-6 overflow-y-auto">
      {messages.map((message, index) => (
        <ChatMessage key={index} role={message.role} content={message.content} />
      ))}
      {isLoading && (
        <div className="flex w-full items-start gap-4 p-6 bg-gray-50">
          <div className="flex-shrink-0 w-8 h-8">
            <GuroAvatar />
          </div>
          <LoadingState />
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
};
