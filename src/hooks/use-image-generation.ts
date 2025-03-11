
import { useToast } from "@/hooks/use-toast";

export const useImageGeneration = (userId: string | null) => {
  const { toast } = useToast();

  const handleImageGeneration = () => {
    if (!userId) return;
    
    toast({
      title: "Not Supported",
      description: "Image generation is not supported with Together AI. Please use text-based queries only.",
      variant: "destructive"
    });
  };

  return { handleImageGeneration };
};
