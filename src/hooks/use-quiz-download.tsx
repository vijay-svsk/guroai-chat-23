
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Quiz } from "@/types/quiz-types";

export const useQuizDownload = () => {
  const { toast } = useToast();

  const downloadQuizDocx = async (quiz: Quiz, subject: string, topic: string) => {
    try {
      // Convert quiz to formatted content for DOCX
      const formattedContent = formatQuizForDocx(quiz);

      const { data, error } = await supabase.functions.invoke(
        "generate-quiz-docx",
        {
          body: { content: formattedContent },
        }
      );

      if (error) throw error;

      const element = document.createElement("a");
      element.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.docxBase64}`;
      element.download = `quiz_${subject.toLowerCase()}_${topic.toLowerCase().replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: "Downloaded!",
        description: "Your quiz has been downloaded as a Word document.",
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

  // Format quiz for DOCX conversion
  const formatQuizForDocx = (quiz: Quiz): string => {
    let content = `Instructions:\n${quiz.instructions}\n\n`;

    quiz.questions.forEach((question, index) => {
      content += `${index + 1}. ${question.question}\n`;
      
      if (question.options) {
        question.options.forEach((option, optIndex) => {
          content += `   ${String.fromCharCode(65 + optIndex)}. ${option}\n`;
        });
      }
      
      content += "\n";
    });

    return content;
  };

  return { downloadQuizDocx };
};
