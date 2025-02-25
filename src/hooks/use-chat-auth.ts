
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useChatAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    } else {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the chat feature.",
        variant: "destructive"
      });
    }
  };

  return { userId };
};
