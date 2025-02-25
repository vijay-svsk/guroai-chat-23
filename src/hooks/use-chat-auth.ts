
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Create a namespace for chat-specific authentication
const CHAT_AUTH_KEY = "guro_chat_auth";

export const useChatAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Start checking auth status immediately
    checkUser();
    
    // Add a timeout to avoid showing loading state for too long
    const timeoutId = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 2000); // Max 2 seconds before we stop showing loading state
    
    return () => clearTimeout(timeoutId);
  }, []);

  const checkUser = async () => {
    try {
      // First check local storage for chat-specific auth
      const chatAuthData = localStorage.getItem(CHAT_AUTH_KEY);
      
      if (chatAuthData) {
        const { id, expiresAt } = JSON.parse(chatAuthData);
        
        // Check if token is expired
        if (expiresAt && new Date(expiresAt) > new Date()) {
          setUserId(id);
          setIsCheckingAuth(false);
          return;
        } else {
          // Clear expired token
          localStorage.removeItem(CHAT_AUTH_KEY);
        }
      }
      
      // If no valid chat auth in local storage, reset state
      setUserId(null);
    } catch (error) {
      console.error("Error checking chat auth:", error);
      setUserId(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const redirectToSubscribe = () => {
    try {
      // Redirect to Xendit payment
      window.location.href = 'https://checkout.xendit.co/od/guroai.online';
      return false; // Return false as we're redirecting, not completing registration
    } catch (error: any) {
      toast({
        title: "Redirect failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const signOut = async () => {
    // Just remove the chat-specific auth from local storage
    localStorage.removeItem(CHAT_AUTH_KEY);
    setUserId(null);
    
    toast({
      title: "Signed out",
      description: "You've been signed out from GuroAI Chat."
    });
    navigate("/"); // Redirect to index page
  };

  return { 
    userId, 
    isCheckingAuth,
    redirectToSubscribe, 
    signOut 
  };
};
