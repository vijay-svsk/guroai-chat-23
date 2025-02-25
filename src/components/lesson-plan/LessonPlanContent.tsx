
import { Button } from "@/components/ui/button";
import { Save, Download, FileText } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LessonPlanContentProps {
  isLoading: boolean;
  isEditing: boolean;
  response: string;
  reviewImage?: string;
  motivationImage?: string;
  onResponseChange: (value: string) => void;
  onSave: () => void;
  onDownloadTxt: () => void;
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
}: LessonPlanContentProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Generating your lesson plan...</p>
      </div>
    );
  }

  const handleProceedToNextStep = () => {
    // Ensure we have content before navigating
    if (response) {
      navigate("/lesson-plan-docx", { 
        state: { 
          content: response,
          // Also pass any other relevant data
          images: {
            reviewImage,
            motivationImage
          }
        } 
      });
    }
  };

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

    const processedResponse = response.split('\n').map((line, index) => {
      if (line.startsWith('IMAGE PROMPT:')) {
        return null;
      }
      return <div key={index}>{line}</div>;
    });

    return (
      <div className="space-y-6">
        {reviewImage && (
          <div className="my-4">
            <img src={reviewImage} alt="Review visual aid" className="max-w-full rounded-lg shadow-lg mx-auto" />
          </div>
        )}
        {motivationImage && (
          <div className="my-4">
            <img src={motivationImage} alt="Motivation visual aid" className="max-w-full rounded-lg shadow-lg mx-auto" />
          </div>
        )}
        <div className="whitespace-pre-wrap font-sans text-gray-800">
          {processedResponse}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white border rounded-md p-4">
        {renderContent()}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Button
          onClick={onSave}
          disabled={isLoading || !response}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save this Lesson Plan
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
          onClick={handleProceedToNextStep}
          disabled={isLoading || !response}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Proceed to Next Step
        </Button>
      </div>
    </>
  );
};
