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
  method: "7es" | "4as";
  previousTopic?: string; // Added for continuity
}

interface GeneratedContent {
  reviewImage: string;
  motivationImage: string;
  content: {
    reviewQuestions: string[];
    hotsQuestions: string[];
    integration: {
      connectedSubject: string;
      discussion: string[];
    };
  };
}

const LessonPlanAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state as FormData;
  const { toast } = useToast();

  const generatePrompt = (data: FormData) => {
    if (data.method === "4as") {
      return `Create a detailed lesson plan using the 4As method (Activity, Analysis, Abstraction, Application) for ${data.subject} at ${data.gradeLevel} level, focusing on the topic: ${data.topic}. The lesson should be conducted in ${data.language}. Please provide a comprehensive breakdown of each stage with specific activities and instructions.`;
    }
    
    let prompt = `Create a full lesson plan for ${data.subject} at ${data.gradeLevel} level, focusing on the topic: ${data.topic}, to be conducted in ${data.language}. The response should have 5,000 words. Only generate what is asked.

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
1. REVIEWING PREVIOUS LESSON OR PRESENTING THE NEW LESSON
{REVIEW_SECTION}

2. ESTABLISHING THE PURPOSE OF THE NEW LESSON (MOTIVATION)
{MOTIVATION_SECTION}

B. PRESENTING EXAMPLES/INSTANCES OF THE NEW LESSON
INTEGRATION OF CONTENT WITHIN AND ACROSS THE CURRICULUM TEACHING AREAS
{INTEGRATION_SECTION}

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

    return prompt;
  };

  const generateLessonImages = async (data: FormData) => {
    try {
      const { data: imageData, error } = await supabase.functions.invoke('generate-lesson-images', {
        body: {
          subject: data.subject,
          topic: data.topic,
          previousTopic: data.previousTopic || data.topic // fallback to current topic if no previous topic
        }
      });

      if (error) throw error;
      setGeneratedContent(imageData);
      
      return imageData;
    } catch (error) {
      console.error("Error generating images:", error);
      toast({
        title: "Error",
        description: "Failed to generate lesson images. Please try again.",
        variant: "destructive",
        duration: 3000
      });
      return null;
    }
  };

  const generateLessonPlan = async () => {
    if (!formData) return;
    setIsLoading(true);
    
    try {
      // First generate images and content
      const imageContent = await generateLessonImages(formData);
      
      if (!imageContent) throw new Error("Failed to generate images and content");

      // Replace placeholders in the prompt with generated content
      let prompt = generatePrompt(formData);
      
      const reviewSection = `
Observe the image below:
[Image URL: ${imageContent.reviewImage}]

Let's review our previous lesson with these questions:
${imageContent.content.reviewQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}
`;

      const motivationSection = `
Now, let's look at this image that introduces our new lesson:
[Image URL: ${imageContent.motivationImage}]

Let's explore this image with some higher-order thinking questions:
${imageContent.content.hotsQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}
`;

      const integrationSection = `
Integration with ${imageContent.content.integration.connectedSubject}:

${imageContent.content.integration.discussion.join("\n\n")}
`;

      prompt = prompt
        .replace("{REVIEW_SECTION}", reviewSection)
        .replace("{MOTIVATION_SECTION}", motivationSection)
        .replace("{INTEGRATION_SECTION}", integrationSection);

      // Generate the full lesson plan
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-lesson-plan', {
        body: { prompt }
      });

      if (error) throw error;
      setResponse(cleanResponse(data.generatedText));
      toast({
        title: "Success!",
        description: "Your lesson plan has been generated.",
        duration: 3000
      });
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate lesson plan. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cleanResponse = (text: string) => {
    return text.replace(/[#*]/g, '').replace(/\n\s*\n/g, '\n\n').trim();
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
          method: formData.method
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
    element.download = `lesson_plan_${formData.subject.toLowerCase()}_${formData.method}.txt`;
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

      // Create a link to download the base64 docx file
      const element = document.createElement("a");
      element.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.docxBase64}`;
      element.download = `lesson_plan_${formData.subject.toLowerCase()}_${formData.method}.docx`;
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
                    GuroAI
                  </span>
                </div>
                <p className="text-sm text-[#0a1d2c] mt-1 font-normal">
                  Empowering educators, simplifying teaching—GuroAI, your partner in effortless lesson planning.
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
                    <Button variant="outline" size="icon" onClick={handleDownload} disabled={isLoading || !response} className="h-10 w-10">
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

export default LessonPlanAI;
