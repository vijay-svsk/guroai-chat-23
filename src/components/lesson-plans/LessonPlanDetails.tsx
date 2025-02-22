
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { formatDate } from "@/utils/date-utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LessonPlan } from "@/types/lesson-plan";

interface LessonPlanDetailsProps {
  plan: LessonPlan;
}

export const LessonPlanDetails = ({ plan }: LessonPlanDetailsProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([plan.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `lesson_plan_${plan.subject.toLowerCase()}_${plan.method}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded!",
      description: "Your lesson plan has been downloaded as a text file.",
      duration: 3000
    });
  };

  const handleDownloadDocx = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-lesson-plan-docx', {
        body: { content: plan.content }
      });

      if (error) throw error;

      const element = document.createElement("a");
      element.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.docxBase64}`;
      element.download = `lesson_plan_${plan.subject.toLowerCase()}_${plan.method}.docx`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: "Downloaded!",
        description: "Your lesson plan has been downloaded as a Word document.",
        duration: 3000
      });
    } catch (error) {
      console.error("Error generating DOCX:", error);
      toast({
        title: "Error",
        description: "Failed to generate Word document. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-1">{plan.subject}</h3>
        <p className="text-sm text-gray-500">{formatDate(plan.created_at)}</p>
      </div>
      <div className="grid gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium mb-2">Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <p className="text-sm text-gray-600">Topic: {plan.topic}</p>
            <p className="text-sm text-gray-600">Method: {plan.method.toUpperCase()}</p>
            {plan.grade_level && (
              <p className="text-sm text-gray-600">Grade Level: {plan.grade_level}</p>
            )}
            {plan.language && (
              <p className="text-sm text-gray-600">Language: {plan.language}</p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white border rounded-md p-4">
        <pre className="whitespace-pre-wrap font-sans text-gray-800">
          {plan.content}
        </pre>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={handleDownload}
          className="w-full sm:w-auto bg-[#0a1d2c] text-white hover:bg-[#0a1d2c]/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Download TXT
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDownloadDocx}
          className="w-full sm:w-auto bg-[#0a1d2c] text-white hover:bg-[#0a1d2c]/90"
        >
          <FileText className="w-4 h-4 mr-2" />
          Download DOCX
        </Button>
      </div>
    </div>
  );
};
