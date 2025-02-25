
import { Button } from "@/components/ui/button";
import { Save, Download, FileText, Presentation } from "lucide-react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LessonPlanContentProps {
  isLoading: boolean;
  isEditing: boolean;
  response: string;
  reviewImage?: string;
  motivationImage?: string;
  onResponseChange: (value: string) => void;
  onSave: () => void;
  onDownloadTxt: () => void;
  onDownloadDocx: () => void;
}

export const LessonPlanContent = ({
  isLoading,
  isEditing,
  response,
  reviewImage,
  motivationImage,
  onResponseChange,
  onSave,
  onDownloadTxt,
  onDownloadDocx,
}: LessonPlanContentProps) => {
  const { toast } = useToast();
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);

  const handleGenerateSlides = async () => {
    try {
      setIsGeneratingSlides(true);
      const { data, error } = await supabase.functions.invoke('generate-slides', {
        body: { content: response }
      });

      if (error) throw error;

      // Create and trigger download
      const element = document.createElement("a");
      element.href = data.presentationUrl;
      element.download = "lesson_plan_slides.pptx";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: "Success!",
        description: "Your presentation slides have been generated and downloaded.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating slides:", error);
      toast({
        title: "Error",
        description: "Failed to generate presentation slides. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsGeneratingSlides(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Generating your lesson plan...</p>
      </div>
    );
  }

  const renderContent = () => {
    if (isEditing) {
      return (
        <textarea
          value={response}
          onChange={(e) => onResponseChange(e.target.value)}
          className="w-full h-[500px] p-4 border rounded-md font-mono text-sm"
        />
      );
    }

    const lines = response.split('\n');
    const processedContent = [];
    let showReviewImage = false;
    let showMotivationImage = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('IMAGE PROMPT:')) {
        continue; // Skip image prompts
      }

      // Add the line to our processed content
      processedContent.push(<div key={i}>{line}</div>);

      // Check for section headers and insert images
      if (line.includes("Reviewing previous lesson") || line.includes("presenting the new lesson")) {
        showReviewImage = true;
        if (reviewImage) {
          processedContent.push(
            <div key={`review-image-${i}`} className="my-4">
              <img 
                src={reviewImage} 
                alt="Review visual aid" 
                className="max-w-[400px] h-auto rounded-lg shadow-lg mx-auto" 
              />
            </div>
          );
        }
      }

      if (line.includes("Establishing the purpose of the new lesson")) {
        showMotivationImage = true;
        if (motivationImage) {
          processedContent.push(
            <div key={`motivation-image-${i}`} className="my-4">
              <img 
                src={motivationImage} 
                alt="Motivation visual aid" 
                className="max-w-[400px] h-auto rounded-lg shadow-lg mx-auto" 
              />
            </div>
          );
        }
      }
    }

    return (
      <div className="whitespace-pre-wrap font-sans text-gray-800">
        {processedContent}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white border rounded-md p-4">
        {renderContent()}
      </div>
      <div className="flex flex-col gap-4">
        <Button
          onClick={onSave}
          disabled={isLoading || !response}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save this Lesson Plan
        </Button>
        <Button
          onClick={handleGenerateSlides}
          disabled={isLoading || !response || isGeneratingSlides}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <Presentation className="h-4 w-4" />
          {isGeneratingSlides ? "Generating Slides..." : "Generate Slides"}
        </Button>
        <Button
          onClick={onDownloadTxt}
          disabled={isLoading || !response}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download as TXT
        </Button>
        <Button
          onClick={onDownloadDocx}
          disabled={isLoading || !response}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Download as DOCX
        </Button>
      </div>
    </>
  );
};
