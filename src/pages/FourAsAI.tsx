import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, RefreshCw, Edit, FileText, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  subject: string;
  gradeLevel: string;
  topic: string;
  language: string;
  method: "4as";
}

const FourAsAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state as FormData;
  const { toast } = useToast();

  const generatePrompt = (data: FormData) => {
    return `Create a comprehensive 12,000-word lesson plan for ${data.subject} at ${data.gradeLevel} level, focusing on the topic: ${data.topic}. The lesson should be conducted in ${data.language}. Please follow this exact structure:

I. LEARNING OBJECTIVES
- Content Standards
- Performance Standards
- Learning Competencies/Code
- Objectives
  - Knowledge
  - Skills
  - Attitude

II. CONTENT
A. References
1. Teacher's Guide pages
2. Learner's Materials pages
3. Textbook pages
4. Additional Materials from Learning Resource (LR) portal
B. Other Learning Resources
C. Supplies, Equipment, Tools, etc.

IV. PROCEDURES
A. Review/Introductory Activity
- Provide a search prompt for a Google image related to the topic
- Ask 3 specific questions about that image

B. Activity/Motivation
- Provide 3 motivating questions that will transition to the new lesson

C. Analysis
- Present examples of the new lesson where the concepts are clarified
- Provide a clear introduction to the lesson

D. Abstraction
- Provide 2 paragraph discussion about the lesson
- Include 5 Higher Order Thinking Skills (HOTS) questions

E. Valuing
- Finding Practical Applications of Concepts and Skills in Daily Living

F. Generalization
- Provide an instruction and 5 multiple-choice questions showing practical applications in daily life

G. Assessment
- Provide an instruction and 10 multiple-choice questions aligned with the lesson objectives
- Ensure questions directly relate to the lesson content

H. Assignment
- Create 2 assignment questions that reinforce the lesson

III. REMARKS

V. REFLECTIONS
A. No. of learners who learned 80% on the formative assessment
B. No. of learners who require additional activities for remediation
C. Did the remedial lessons work? No. of learners who have caught up with the lesson
D. No. of learners who continue to require remediation
E. Which of my teaching strategies worked well? Why did these work?
F. What difficulties did I encounter which my principal or supervisor can help me solve?
G. What innovation or localized materials did I use/discover which I wish to share with other teachers?

Please provide a detailed response following this structure exactly, emphasizing practical examples and clear instructions throughout the lesson plan.`;
  };

  const cleanResponse = (text: string) => {
    return text.replace(/[#*]/g, '').replace(/\n\s*\n/g, '\n\n').trim();
  };

  const generateLessonPlan = async () => {
    if (!formData) return;
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-lesson-plan', {
        body: {
          prompt: generatePrompt(formData)
        }
      });
      if (error) throw error;
      setResponse(cleanResponse(data.generatedText));
      toast({
        title: "Success!",
        description: "Your 4As lesson plan has been generated.",
        duration: 3000
      });
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate lesson plan. Please try again.",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateLessonPlan();
  }, [formData]);

  const handleSaveLessonPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to save lesson plans.",
          variant: "destructive",
          duration: 3000
        });
        return;
      }

      const { error } = await supabase
        .from('lesson_plans')
        .insert({
          user_id: user.id,
          content: response,
          subject: formData.subject,
          grade_level: formData.gradeLevel,
          topic: formData.topic,
          language: formData.language,
          method: "4as"
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Lesson plan saved successfully.",
        duration: 3000
      });
      navigate('/my-account');
    } catch (error) {
      console.error("Error saving lesson plan:", error);
      toast({
        title: "Error",
        description: "Failed to save lesson plan. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([response], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = `4as_lesson_plan_${formData.subject.toLowerCase()}.txt`;
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
        body: { content: response }
      });

      if (error) throw error;

      const element = document.createElement("a");
      element.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.docxBase64}`;
      element.download = `4as_lesson_plan_${formData.subject.toLowerCase()}.docx`;
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

  const handleRegenerateClick = () => {
    generateLessonPlan();
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              No lesson plan parameters provided. Please return to the dashboard and fill in the required information.
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
          <CardHeader className="space-y-2">
            <CardTitle className="flex justify-between items-start">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/455a23fe-17a6-4eba-92d1-fc732a28b3e7.png" 
                    alt="GuroAI Logo" 
                    className="h-12 w-auto"
                    loading="eager"
                  />
                  <span className="text-[#0a1d2c] text-2xl font-bold">
                    GuroAI - 4As Method
                  </span>
                </div>
                <p className="text-sm text-[#0a1d2c] mt-1 font-normal">
                  Creating structured lesson plans using Activity, Analysis, Abstraction, and Application.
                </p>
              </div>
              <div className="flex gap-2">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Button variant="outline" size="icon" onClick={handleRegenerateClick} disabled={isLoading} className="h-10 w-10">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={toggleEdit} disabled={isLoading} className="h-10 w-10">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Generating your 4As lesson plan...</p>
              </div>
            ) : (
              <>
                <div className="bg-white border rounded-md p-4">
                  {isEditing ? (
                    <textarea
                      value={response}
                      onChange={e => setResponse(cleanResponse(e.target.value))}
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
                    onClick={handleSaveLessonPlan}
                    disabled={isLoading || !response}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save this Lesson Plan
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={isLoading || !response}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download as TXT
                  </Button>
                  <Button
                    onClick={handleDownloadDocx}
                    disabled={isLoading || !response}
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Download as DOCX
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FourAsAI;
