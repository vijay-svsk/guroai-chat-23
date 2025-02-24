
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Edit, FileText, Save } from "lucide-react";

interface LessonPlanActionsProps {
  isLoading: boolean;
  hasResponse: boolean;
  onRegenerateClick: () => void;
  onEditClick: () => void;
  onDownloadTxt: () => void;
  onDownloadDocx: () => void;
  onSave: () => void;
}

export const LessonPlanActions: React.FC<LessonPlanActionsProps> = ({
  isLoading,
  hasResponse,
  onRegenerateClick,
  onEditClick,
  onDownloadTxt,
  onDownloadDocx,
  onSave,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={onSave}
        disabled={isLoading || !hasResponse}
        className="w-full sm:w-auto flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Save this Lesson Plan
      </Button>
      <Button
        onClick={onDownloadTxt}
        disabled={isLoading || !hasResponse}
        className="w-full sm:w-auto flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download as TXT
      </Button>
      <Button
        onClick={onDownloadDocx}
        disabled={isLoading || !hasResponse}
        className="w-full sm:w-auto flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Download as DOCX
      </Button>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={onRegenerateClick} disabled={isLoading} className="h-10 w-10">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onEditClick} disabled={isLoading} className="h-10 w-10">
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
