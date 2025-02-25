
import React from 'react';
import { Button } from "@/components/ui/button";
import { Presentation, Play, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ActionButtonsProps {
  file: File | null;
  instructions: string;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  generatedSlides: any;
  setGeneratedSlides: (slides: any) => void;
}

export const ActionButtons = ({
  file,
  instructions,
  isGenerating,
  setIsGenerating,
  generatedSlides,
  setGeneratedSlides,
}: ActionButtonsProps) => {
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!file) {
      toast({
        title: "No file uploaded",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('instructions', instructions);

      const { data: responseData, error: functionError } = await supabase.functions.invoke(
        'generate-slides',
        {
          body: formData,
        }
      );

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message);
      }

      if (!responseData) {
        throw new Error('No data received from the generate-slides function');
      }

      console.log('Generated slides data:', responseData);
      setGeneratedSlides(responseData);
      
      toast({
        title: "Success!",
        description: "Your slides have been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating slides:', error);
      toast({
        title: "Error generating slides",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedSlides) {
      toast({
        title: "No slides generated",
        description: "Please generate slides first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: pptxData, error } = await supabase.functions.invoke(
        'download-slides',
        {
          body: { slidesData: generatedSlides },
        }
      );

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      if (!pptxData) {
        throw new Error('No data received from the download-slides function');
      }

      const blob = new Blob([pptxData], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'presentation.pptx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success!",
        description: "Your presentation has been downloaded.",
      });
    } catch (error) {
      console.error('Error downloading slides:', error);
      toast({
        title: "Error downloading presentation",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        className="flex-1 bg-[#8cd09b] hover:bg-[#8cd09b]/90 text-[#0a1d2c] font-medium"
        onClick={handleGenerate}
        disabled={isGenerating || !file}
      >
        {isGenerating ? (
          <>
            <Play className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Presentation className="w-4 h-4 mr-2" />
            Generate Slides
          </>
        )}
      </Button>

      {generatedSlides && (
        <Button
          className="flex-1 bg-[#8cd09b] hover:bg-[#8cd09b]/90 text-[#0a1d2c] font-medium"
          onClick={handleDownload}
          disabled={isGenerating}
        >
          <Download className="w-4 h-4 mr-2" />
          Download PPTX
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
