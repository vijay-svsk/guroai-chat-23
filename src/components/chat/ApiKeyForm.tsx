
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyFormProps {
  onKeySaved: () => void;
}

export const ApiKeyForm = ({ onKeySaved }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState("");
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[#023d54]">Connect Your AI</h2>
        <p className="text-gray-600 text-sm">
          GuroAI requires a Together AI API key to function. You can get an API key from{" "}
          <a 
            href="https://www.together.ai/api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Together AI
          </a>.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
            Enter your Together AI API key
          </label>
          <Input
            id="api-key"
            type="password"
            placeholder="togetherapi-xxxxxxx..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={handleSaveKey}
            disabled={isSaving || !apiKey.trim()}
            className="bg-[#023d54] hover:bg-[#023d54]/90"
          >
            {isSaving ? "Saving..." : "Save API Key"}
          </Button>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-50 p-3 rounded-md text-xs text-gray-500">
        <p>
          Your API key is stored securely in your browser and is only used to make requests to Together AI. 
          We never store your API key on our servers.
        </p>
      </div>
    </div>
  );
};
