
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyFormProps {
  onKeySaved: () => void;
}

export const ApiKeyForm = ({ onKeySaved }: ApiKeyFormProps) => {
  // Pre-fill with the provided API key
  const [apiKey, setApiKey] = useState("aaba53e54192b3dd8454bff28451d27c4f8e23de88600cce9d074f4db1dc0066");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Store the API key in localStorage for this session
      localStorage.setItem("together_api_key", apiKey);
      
      toast({
        title: "Success",
        description: "API key saved successfully",
      });
      
      onKeySaved();
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save the API key when component mounts
  useState(() => {
    handleSaveKey();
  });

  // The form is now hidden by default since we're using the pre-filled API key
  return null;
};

