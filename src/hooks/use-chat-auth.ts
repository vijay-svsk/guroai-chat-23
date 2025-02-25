
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        // User is not authenticated
        setUserId(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUserId(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signInToChat = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      if (data.user) {
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;
      
      if (data.user) {
        setUserId(data.user.id);
        toast({
          title: "Account created!",
          description: "You're now registered for GuroAI Chat.",
        });
        return true;
      }
      return false;
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
    await supabase.auth.signOut();
    setUserId(null);
    toast({
      title: "Signed out",
      description: "You've been signed out from GuroAI Chat."
    });
    navigate("/"); // Changed from "/askguro" to "/" to redirect to index page
  };

  return { 
    userId, 
    isCheckingAuth, 
    signInToChat, 
    registerForChat, 
    signOut 
  };
};
