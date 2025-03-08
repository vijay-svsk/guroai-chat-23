
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/types/chat";
import { GuroAvatar } from "@/components/ui/guro-avatar";
import { supabase } from "@/integrations/supabase/client";

export const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Use the provided API key directly
  const apiKey = "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";
  
  useEffect(() => {
    // Add welcome message when chat is first opened
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hello! I'm GuroAI's assistant. How can I help you today?

Need assistance with:
• Lesson planning with GuroAI
• Subscription information
• Payment verification
• Our newest upcoming features`
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Prevent body scrolling when chat is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Verify payment reference number in Supabase
  const verifyPaymentReference = async (refNumber: string) => {
    if (refNumber && refNumber.length >= 5) {
      try {
        // Check if this is a valid payment reference
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('stripe_subscription_id', refNumber)
          .maybeSingle();
          
        if (data) {
          return true;
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    }
    return false;
  };

  // Check if message contains payment reference claim
  const handlePaidUserClaim = async (userMessage: string) => {
    // Check if user is claiming they've paid
    const paidClaim = /paid|subscribed|payment|reference number|ref number|subscription/i.test(userMessage.toLowerCase());
    
    if (paidClaim) {
      // Check if message contains what looks like a reference number
      const refNumberMatch = userMessage.match(/([A-Za-z0-9_-]{5,})/);
      
      if (refNumberMatch) {
        const refNumber = refNumberMatch[0];
        const isValid = await verifyPaymentReference(refNumber);
        
        if (isValid) {
          return `I've verified your payment with reference number "${refNumber}". You can now access your full account at: https://guroai.lovable.app/auth

Please log in with the email you used during registration. If you have any issues accessing your account, please contact support at guroai.online@gmail.com.`;
        } else {
          return `I couldn't verify your payment with the provided reference. Please provide your complete payment reference number, or contact support at guroai.online@gmail.com for assistance.`;
        }
      } else {
        return `I see you're mentioning payment. If you've already paid, please provide your payment reference number so I can verify your account.`;
      }
    }
    
    return null;
  };

  // Check if message is about upcoming features
  const handleFeaturesInquiry = (userMessage: string) => {
    const featuresKeywords = /features|coming soon|new tools|interactive|games|upcoming|what's new/i.test(userMessage.toLowerCase());
    
    if (featuresKeywords) {
      return `I'm excited to tell you about our upcoming features at GuroAI:

📱 **Create Interactive Games**:
✅ Teachers can create engaging games like matching, quizzes, and spin-the-wheel activities.
✅ Fully customizable to adapt to your lesson content.
✅ Designed to increase student engagement and participation.

🚀 **And Many More Features Coming Soon!**
✅ GuroAI is constantly evolving with new tools to simplify teaching tasks.
✅ All new features will be included in your regular subscription of ₱299/month.

Would you like to learn more about our subscription plans?`;
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Check for special message handling cases
      const paidUserResponse = await handlePaidUserClaim(userMessage.content);
      const featuresInquiryResponse = handleFeaturesInquiry(userMessage.content);
      
      // If we have a special response, use it instead of calling the API
      if (paidUserResponse || featuresInquiryResponse) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: paidUserResponse || featuresInquiryResponse || ''
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Use Supabase Edge Function for regular responses
        const { data, error } = await supabase.functions.invoke("chat", {
          body: { 
            message: userMessage.content,
            apiKey
          },
        });

        if (error) {
          throw new Error(error.message || "Failed to get response");
        }
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.answer
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div ref={chatBoxRef} className="fixed z-50 bottom-4 w-full md:w-auto md:right-4">
      {/* Chat icon button - only visible on tablet/desktop */}
      {!isOpen && (
        <div className="hidden md:flex flex-col items-center">
          <div className="relative">
            <Button
              onClick={handleToggleChat}
              className="h-16 w-16 rounded-full bg-[#8cd09b] hover:bg-[#7bc089] shadow-lg animate-pulse-slow"
            >
              <MessageCircle className="h-7 w-7" />
            </Button>
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              1
            </span>
          </div>
          <div className="mt-2 px-3 py-1 bg-white shadow-md rounded-md text-guro-blue font-medium text-sm animate-fade-in-up">
            Ask GuroAI assistant
          </div>
        </div>
      )}

      {/* Mobile chat button - centered at bottom */}
      {!isOpen && (
        <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Button
                onClick={handleToggleChat}
                className="h-14 w-14 rounded-full bg-[#8cd09b] hover:bg-[#7bc089] shadow-lg animate-pulse-slow"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                1
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Chat box */}
      {isOpen && (
        <div className="flex flex-col bg-white rounded-lg shadow-xl max-w-full w-full md:w-[350px] h-[550px] md:h-[450px] border border-gray-200 mx-auto md:mx-0 fixed bottom-0 left-0 right-0 md:bottom-4 md:right-4 md:left-auto">
          {/* Chat header */}
          <div className="flex items-center justify-between bg-[#023d54] text-white p-3 rounded-t-lg">
            <div className="flex items-center gap-2">
              <GuroAvatar className="h-6 w-6" />
              <span className="font-semibold">GuroAI Assistant</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleChat}
              className="h-8 w-8 text-white hover:bg-[#03506a]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8">
                    <GuroAvatar />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[80%] text-left",
                    msg.role === "user"
                      ? "bg-[#023d54] text-white"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap text-left">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
                    <div className="w-4 h-4 rounded-full bg-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-8 h-8">
                  <GuroAvatar />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="resize-none min-h-[40px] max-h-[100px] text-sm p-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 bg-[#023d54] hover:bg-[#03506a]"
                disabled={isLoading || !message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
