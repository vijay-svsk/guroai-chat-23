
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLessonPlanDownload = () => {
  const { toast } = useToast();

  const downloadTxt = (response: string, subject: string, method: string) => {
    const element = document.createElement("a");
    const file = new Blob([response], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `lesson_plan_${subject.toLowerCase()}_${method}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Downloaded!",
      description: "Your lesson plan has been downloaded as a text file.",
      duration: 3000,
    });
  };

  const downloadDocx = async (response: string, subject: string, method: string) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-lesson-plan-docx",
        {
          body: { content: response },
        }
      );

      if (error) throw error;

      const element = document.createElement("a");
      element.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.docxBase64}`;
      element.download = `lesson_plan_${subject.toLowerCase()}_${method}.docx`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: "Downloaded!",
        description: "Your lesson plan has been downloaded as a Word document.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating DOCX:", error);
      toast({
        title: "Error",
        description: "Failed to generate Word document. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return { downloadTxt, downloadDocx };
};
