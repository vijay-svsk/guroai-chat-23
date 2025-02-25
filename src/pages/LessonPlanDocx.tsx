
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LessonPlanDocx = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);
  const content = location.state?.content;

  useEffect(() => {
    if (!content) return;

    const generateDocx = async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "generate-lesson-plan-docx",
          {
            body: { content },
          }
        );

        if (error) throw error;

        if (data?.docxBase64) {
          const blob = new Blob(
            [Uint8Array.from(atob(data.docxBase64), c => c.charCodeAt(0))],
            { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
          );
          const url = URL.createObjectURL(blob);
          setDocxUrl(url);
        }
      } catch (error) {
        console.error("Error generating DOCX:", error);
        toast({
          title: "Error",
          description: "Failed to generate the document. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateDocx();
  }, [content]);

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              No lesson plan content provided. Please generate a lesson plan first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-xl">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Generating your lesson plan document...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-green-600 font-medium">
                  Your document has been generated successfully!
                </p>
                {docxUrl && (
                  <div className="text-center">
                    <a
                      href={docxUrl}
                      download="lesson-plan.docx"
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      Download Document
                    </a>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonPlanDocx;
