
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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

  const signInToChat = async (email: string, password: string) => {
    try {
      // Use Supabase auth but don't store the session in browser storage
      // This creates a temporary session just for the API call
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        // Store chat-specific auth in local storage
        const chatAuth = {
          id: data.user.id,
          email: data.user.email,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        };
        
        localStorage.setItem(CHAT_AUTH_KEY, JSON.stringify(chatAuth));
        setUserId(data.user.id);
        
        toast({
          title: "Welcome to GuroAI Chat!",
          description: "You're now signed in.",
        });
        return true;
      }
      return false;
    } catch (error: any) {
      toast({
        title: "Sign-in failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const registerForChat = async (email: string, password: string) => {
    try {
      // Instead of registering directly, redirect to Xendit payment
      window.location.href = 'https://checkout.xendit.co/od/guroai.online';
      return false; // Return false as we're redirecting, not completing registration
    } catch (error: any) {
      toast({
        title: "Registration failed",
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
    signInToChat, 
    registerForChat, 
    signOut 
  };
};
