
import { Button } from "@/components/ui/button";
import { Save, Download, FileText } from "lucide-react";
import { Loader2 } from "lucide-react";

interface LessonPlanContentProps {
  isLoading: boolean;
  isEditing: boolean;
  response: string;
  onResponseChange: (value: string) => void;
  onSave: () => void;
  onDownloadTxt: () => void;
  onDownloadDocx: () => void;
}

export const LessonPlanContent = ({
  isLoading,
  isEditing,
  response,
  onResponseChange,
  onSave,
  onDownloadTxt,
  onDownloadDocx,
}: LessonPlanContentProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Generating your lesson plan...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border rounded-md p-4">
        {isEditing ? (
          <textarea
            value={response}
            onChange={(e) => onResponseChange(e.target.value)}
            className="w-full h-[500px] p-4 border rounded-md font-mono text-sm"
          />
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-gray-800">
            {response}
          </pre>
        )}
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
