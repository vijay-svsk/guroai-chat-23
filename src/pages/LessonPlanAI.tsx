
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, RefreshCw, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  subject: string;
  gradeLevel: string;
  topic: string;
  language: string;
  method: "7es" | "4as";
}

const LessonPlanAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const formData = location.state as FormData;
  const { toast } = useToast();

  const generatePrompt = (data: FormData) => {
    if (data.method === "4as") {
      return `Create a detailed lesson plan using the 4As method (Activity, Analysis, Abstraction, Application) for ${data.subject} at ${data.gradeLevel} level, focusing on the topic: ${data.topic}. The lesson should be conducted in ${data.language}. Please provide a comprehensive breakdown of each stage with specific activities and instructions.`;
    }

    return `Create a full lesson plan for ${data.subject} at ${data.gradeLevel} level, focusing on the topic: ${data.topic}, to be conducted in ${data.language}. The response should have 5,000 words. Only generate what is asked.

A. Content Standard
B. Performance Standard
C. Learning Competencies
D. MELC-Based Competency
E. Objectives
1. Cognitive
2. Psychomotor
3. Affective

II. SUBJECT MATTER
A. TOPIC
B. REFERENCES
C. MATERIALS

III. Procedure
A. PRELIMINARIES
1. (Reviewing previous lesson or presenting the new lesson)
Instruction: Provide a search prompt for a Google image related to the topic, then ask 3 questions about that image.

2. Establishing the purpose of the new lesson (Motivation)
Instruction: Provide a search prompt for a Google image related to the new lesson, then ask 8 Higher Order Thinking Skills (HOTS) questions about that image.

B. PRESENTING EXAMPLES/INSTANCES OF THE NEW LESSON
Instruction: In reviewing the previous lesson, ensure it connects to the new lesson. The motivation section should have images or clear prompts for what to include. When presenting examples, integrate a concept from another subject.
Example: Word problem.

C. DISCUSSING NEW CONCEPT AND PRACTICING NEW SKILLS #1
Instruction: Provide an instruction and 5 multiple-choice questions with 3 options each.

D. DISCUSSING NEW CONCEPT AND PRACTICING NEW SKILLS #2
Instruction: Provide an instruction and 5 multiple-choice questions with 3 options each.

E. DEVELOPING MASTERY (LEADS TO FORMATIVE ASSESSMENT)
Instruction: Create a rubric for a group activity. Divide the class into 3 groups:
1. Group 1 will perform a role-play.
2. Group 2 will give a report.
3. Group 3 will sing a song related to the lesson.
Provide clear, concise instructions (1-2 sentences) for each group. For the song, create a short rhyming song about the lesson using a popular kids' tune.

F. FINDING PRACTICAL APPLICATION OF CONCEPTS AND SKILLS IN DAILY LIVING
Instruction: Provide an instruction and 5 multiple-choice questions that show how the lesson can be applied in daily life.

G. GENERALIZATION
Instruction: Write 3 generalization questions to help the class summarize what they learned.

IV. EVALUATION
Instruction: Provide an instruction and 10 multiple-choice questions related to the lesson with clear instructions.

V. ASSIGNMENT
Instruction: Create 2 assignment questions that reinforce the lesson.`;
  };

  const generateLessonPlan = async () => {
    if (!formData) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-lesson-plan', {
        body: { prompt: generatePrompt(formData) }
      });

      if (error) throw error;
      
      setResponse(data.generatedText);
      toast({
        title: "Success!",
        description: "Your lesson plan has been generated.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate lesson plan. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateLessonPlan();
  }, [formData]);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([response], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `lesson_plan_${formData.subject.toLowerCase()}_${formData.method}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded!",
      description: "Your lesson plan has been downloaded.",
      duration: 3000,
    });
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
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-guro-blue flex justify-between items-center">
              <span>AI Lesson Plan Generator</span>
              <div className="flex gap-2">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRegenerateClick}
                      disabled={isLoading}
                      className="h-10 w-10"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleEdit}
                      disabled={isLoading}
                      className="h-10 w-10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDownload}
                      disabled={isLoading || !response}
                      className="h-10 w-10"
                    >
                      <Download className="h-4 w-4" />
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
                <p className="text-gray-600">Generating your lesson plan...</p>
              </div>
            ) : (
              <div className="bg-white border rounded-md p-4">
                {isEditing ? (
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="w-full h-[500px] p-4 border rounded-md font-mono text-sm"
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-gray-800">
                    {response}
                  </pre>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonPlanAI;
