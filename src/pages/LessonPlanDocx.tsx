
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Columns2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LessonPlanDocx = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);
  
  // Get the content from navigation state
  const content = location.state?.content;

  // Define the section headers for Column 1
  const sectionHeaders = [
    "A. Content Standard",
    "B. Performance Standard",
    "C. Learning Competencies",
    "D. MELC-Based Competency",
    "E. Objectives",
    "1. Cognitive",
    "2. Psychomotor",
    "3. Affective",
    "II. SUBJECT MATTER",
    "A. TOPIC",
    "B. REFERENCES",
    "C. MATERIALS",
    "III. Procedure",
    "A. PRELIMINARIES",
    "1. Reviewing previous lesson",
    "2. Establishing purpose (Motivation)",
    "B. PRESENTING EXAMPLES/INSTANCES",
    "C. DISCUSSING NEW CONCEPT AND SKILLS #1",
    "D. DISCUSSING NEW CONCEPT AND SKILLS #2",
    "E. DEVELOPING MASTERY",
    "F. PRACTICAL APPLICATION",
    "G. GENERALIZATION",
    "IV. EVALUATION",
    "V. ASSIGNMENT"
  ];

  useEffect(() => {
    // If no content is provided, redirect back to lesson plan creation
    if (!content) {
      navigate("/lesson-plan-ai");
      toast({
        title: "No Content Found",
        description: "Please generate a lesson plan first.",
        variant: "destructive",
      });
      return;
    }

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
  }, [content, navigate, toast]);

  // Parse content into sections
  const parseSections = (content: string) => {
    const sections: { [key: string]: string } = {};
    let currentSection = "";
    let currentContent = "";
    
    content.split('\n').forEach((line) => {
      const trimmedLine = line.trim();
      if (sectionHeaders.some(header => 
        trimmedLine.toLowerCase().includes(header.toLowerCase().replace(/[^a-zA-Z\s]/g, '')))) {
        if (currentSection) {
          sections[currentSection] = currentContent.trim();
        }
        currentSection = trimmedLine;
        currentContent = "";
      } else {
        currentContent += line + "\n";
      }
    });
    if (currentSection) {
      sections[currentSection] = currentContent.trim();
    }
    return sections;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white shadow-xl">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Generating your lesson plan document...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary mb-6">
                  <Columns2 className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Two-Column Lesson Plan Preview</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
                  {/* Column 1: Section Headers */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 mb-4">Sections</h3>
                    {sectionHeaders.map((header, index) => (
                      <div
                        key={index}
                        className="p-2 bg-gray-50 rounded-md font-medium text-gray-700"
                      >
                        {header}
                      </div>
                    ))}
                  </div>
                  
                  {/* Column 2: Content */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 mb-4">Content</h3>
                    {content && sectionHeaders.map((header, index) => {
                      const sections = parseSections(content);
                      const sectionContent = Object.entries(sections)
                        .find(([key]) => key.toLowerCase().includes(header.toLowerCase().replace(/[^a-zA-Z\s]/g, '')))
                        ?.[1] || "";
                      
                      return (
                        <div key={index} className="p-2 bg-white border rounded-md">
                          <p className="whitespace-pre-wrap text-gray-600">{sectionContent}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {docxUrl && (
                  <div className="text-center mt-6">
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
