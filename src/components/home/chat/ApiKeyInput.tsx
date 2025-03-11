
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const ApiKeyInput = () => {
  const [showInput, setShowInput] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load the API key from localStorage when component mounts
    const savedKey = localStorage.getItem("togetherApiKey") || "aaba53e54192b3dd8454bff28451d27c4f8e23de88600cce9d074f4db1dc0066";
    if (savedKey) {
      setApiKey(savedKey);
      // Save the key to localStorage if it's not already there
      if (!localStorage.getItem("togetherApiKey")) {
        localStorage.setItem("togetherApiKey", savedKey);
        toast({
          title: "API Key Set",
          description: "Together API key has been automatically configured.",
        });
      }
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("togetherApiKey", apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Together API key has been saved successfully.",
      });
      setShowInput(false);
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
    }
  };

  const handleClearKey = () => {
    // Instead of removing the key, reset it to the default value
    const defaultKey = "aaba53e54192b3dd8454bff28451d27c4f8e23de88600cce9d074f4db1dc0066";
    localStorage.setItem("togetherApiKey", defaultKey);
    setApiKey(defaultKey);
    toast({
      title: "API Key Reset",
      description: "Your Together API key has been reset to the default.",
    });
  };

  return (
    <div className="px-4 py-2 border-t border-gray-200">
      {showInput ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="password"
              placeholder="Enter Together API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={handleSaveKey}>Save</Button>
          </div>
          <div className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowInput(false)}
            >
              Cancel
            </Button>
            {apiKey && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearKey}
                className="text-gray-500 hover:text-gray-700"
              >
                Reset Key
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs"
          onClick={() => setShowInput(true)}
        >
          {localStorage.getItem("togetherApiKey") ? "Change Together API Key" : "Set Together API Key"}
        </Button>
      )}
    </div>
  );
};
