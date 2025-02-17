
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, RefreshCw, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    const methodDescription = data.method === "7es" 
      ? "using the 7Es method (Elicit, Engage, Explore, Explain, Elaborate, Evaluate, Extend)"
      : "using the 4As method (Activity, Analysis, Abstraction, Application)";

    return `Create a detailed lesson plan for ${data.subject} at ${data.gradeLevel} level, 
    focusing on the topic: ${data.topic}. The lesson should be conducted in ${data.language} 
    ${methodDescription}. Please provide a comprehensive breakdown of each stage with specific 
    activities and instructions.`;
  };

  const generateLessonPlan = async () => {
    if (!formData) return;
    
    setIsLoading(true);
    try {
      // For now, we'll simulate AI response with a timeout
      // This should be replaced with actual AI API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      const sampleResponse = `
        Lesson Plan for ${formData.subject}
        Grade Level: ${formData.gradeLevel}
        Topic: ${formData.topic}
        Language: ${formData.language}
        Method: ${formData.method.toUpperCase()}

        ${formData.method === "7es" ? `
        1. Elicit:
        - Begin by asking students about their prior knowledge...
        
        2. Engage:
        - Present a real-world problem related to ${formData.topic}...
        
        3. Explore:
        - Students work in groups to investigate...
        
        4. Explain:
        - Facilitate class discussion about findings...
        
        5. Elaborate:
        - Connect concepts to new situations...
        
        6. Evaluate:
        - Assess understanding through...
        
        7. Extend:
        - Provide additional challenges...
        ` : `
        1. Activity:
        - Start with a hands-on activity about ${formData.topic}...
        
        2. Analysis:
        - Guide students to analyze their observations...
        
        3. Abstraction:
        - Help students form general concepts...
        
        4. Application:
        - Students apply their learning to new situations...
        `}
      `;
      
      setResponse(sampleResponse);
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
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Generated Prompt:</h3>
              <p className="text-gray-600">{generatePrompt(formData)}</p>
            </div>
            
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
