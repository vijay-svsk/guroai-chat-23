
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Download, FileText, Edit } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LessonPlanContentProps {
  isLoading: boolean;
  isEditing: boolean;
  response: string;
  reviewImage?: string;
  motivationImage?: string;
  usedFallback?: boolean;
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
  usedFallback = false,
  onResponseChange,
  onSave,
  onDownloadTxt,
  onDownloadDocx,
}: LessonPlanContentProps) => {
  const { toast } = useToast();

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
          placeholder="Your lesson plan content will appear here for editing"
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
        {usedFallback && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <p className="font-medium text-amber-800">
              This is a template lesson plan. AI-generated content is currently unavailable.
              Please edit this template to customize it for your needs.
            </p>
          </div>
        )}
        {processedContent}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white border rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        {renderContent()}
      </div>
      <div className="flex flex-wrap gap-4 mt-6">
        <Button
          onClick={onSave}
          disabled={isLoading || !response}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save this Lesson Plan
        </Button>
        {usedFallback && (
          <Button
            variant="outline"
            onClick={() => onResponseChange(response)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Template
          </Button>
        )}
        <Button
          onClick={onDownloadTxt}
          disabled={isLoading || !response}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download as TXT
        </Button>
        <Button
          onClick={onDownloadDocx}
          disabled={isLoading || !response}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Download as DOCX
        </Button>
      </div>
    </>
  );
};
