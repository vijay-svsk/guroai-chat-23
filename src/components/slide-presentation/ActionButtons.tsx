
import React from 'react';
import { Button } from "@/components/ui/button";
import { Presentation, Play, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ActionButtonsProps {
  file: File | null;
  subject: string;
  gradeLevel: string;
  topic: string;
  instructions: string;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  generatedSlides: any;
  setGeneratedSlides: (slides: any) => void;
}

export const ActionButtons = ({
  file,
  subject,
  gradeLevel,
  topic,
  instructions,
  isGenerating,
  setIsGenerating,
  generatedSlides,
  setGeneratedSlides,
}: ActionButtonsProps) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [generator, setGenerator] = React.useState<'slidesgpt' | 'chatgpt'>('slidesgpt');

  const handleGenerate = async () => {
    if (!subject || !gradeLevel || !topic) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields (Subject, Grade Level, and Topic)",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('subject', subject);
      formData.append('gradeLevel', gradeLevel);
      formData.append('topic', topic);
      formData.append('instructions', instructions);

      const endpoint = generator === 'slidesgpt' ? 'generate-slides' : 'generate-slides-with-chatgpt';
      
      const { data: responseData, error: functionError } = await supabase.functions.invoke(
        endpoint,
        {
          body: formData,
        }
      );

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message);
      }

      if (!responseData) {
        throw new Error(`No data received from the ${endpoint} function`);
      }

      console.log('Generated slides data:', responseData);
      setGeneratedSlides(responseData);
      
      toast({
        title: "Success!",
        description: `Your slides have been generated successfully with ${generator === 'slidesgpt' ? 'SlidesGPT' : 'ChatGPT'}.`,
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

    setIsDownloading(true);
    try {
      console.log('Sending slides data to download function:', generatedSlides);
      
      const { data: pptxData, error } = await supabase.functions.invoke(
        'download-slides',
        {
          body: { 
            slidesData: generatedSlides,
            subject: subject,
            gradeLevel: gradeLevel,
            topic: topic
          },
        }
      );

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      if (!pptxData || !pptxData.pptxData) {
        throw new Error('No PPTX data received from the download-slides function');
      }

      // Convert base64 to Blob
      const byteCharacters = atob(pptxData.pptxData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${subject}_${topic}_presentation.pptx`;
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
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-6">
        <RadioGroup
          value={generator}
          onValueChange={(value: 'slidesgpt' | 'chatgpt') => setGenerator(value)}
          className="flex items-center space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="slidesgpt" id="slidesgpt" />
            <Label htmlFor="slidesgpt" className="text-white">SlidesGPT</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="chatgpt" id="chatgpt" />
            <Label htmlFor="chatgpt" className="text-white">ChatGPT</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-4">
        <Button
          className="flex-1 bg-[#8cd09b] hover:bg-[#8cd09b]/90 text-[#0a1d2c] font-medium"
          onClick={handleGenerate}
          disabled={isGenerating || !subject || !gradeLevel || !topic}
        >
          {isGenerating ? (
            <>
              <Play className="w-4 h-4 mr-2 animate-spin" />
              Generating with {generator === 'slidesgpt' ? 'SlidesGPT' : 'ChatGPT'}...
            </>
          ) : (
            <>
              <Presentation className="w-4 h-4 mr-2" />
              Generate Slides with {generator === 'slidesgpt' ? 'SlidesGPT' : 'ChatGPT'}
            </>
          )}
        </Button>

        {generatedSlides && (
          <Button
            className="flex-1 bg-[#8cd09b] hover:bg-[#8cd09b]/90 text-[#0a1d2c] font-medium"
            onClick={handleDownload}
            disabled={isDownloading || isGenerating}
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? 'Downloading...' : 'Download PPTX'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
