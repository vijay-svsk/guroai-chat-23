
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Languages, BookType, Settings, Award } from "lucide-react";

interface FormData {
  subject: string;
  gradeLevel: string;
  topic: string;
  language: string;
  customInstructions: string;
}

interface LessonPlanFormProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMethodSelect: (method: "7es" | "4as") => void;
}

export const LessonPlanForm = ({ formData, onInputChange, onMethodSelect }: LessonPlanFormProps) => {
  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-guro-blue mb-4">
          Create New Lesson Plan
        </h1>
        <p className="text-xl text-gray-600">
          Help us understand your teaching needs
        </p>
      </div>

      <Card className="bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-guro-blue">
            Teaching Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="text-guro-blue w-6 h-6" />
              <Input name="subject" placeholder="Subject (e.g., Mathematics, Science)" value={formData.subject} onChange={onInputChange} className="flex-1" />
            </div>

            <div className="flex items-center space-x-4">
              <GraduationCap className="text-guro-blue w-6 h-6" />
              <Input name="gradeLevel" placeholder="Grade Level (e.g., Grade 7, High School)" value={formData.gradeLevel} onChange={onInputChange} className="flex-1" />
            </div>

            <div className="flex items-center space-x-4">
              <BookType className="text-guro-blue w-6 h-6" />
              <Input name="topic" placeholder="Topic (e.g., Algebra, Chemical Bonds)" value={formData.topic} onChange={onInputChange} className="flex-1" />
            </div>

            <div className="flex items-center space-x-4">
              <Languages className="text-guro-blue w-6 h-6" />
              <Input name="language" placeholder="Language Used (e.g., English, Filipino)" value={formData.language} onChange={onInputChange} className="flex-1" />
            </div>

            <div className="flex items-center space-x-4">
              <Settings className="text-guro-blue w-6 h-6" />
              <Input 
                name="customInstructions" 
                placeholder="Custom Instructions (e.g., Include more group activities, Focus on visual learning)" 
                value={formData.customInstructions} 
                onChange={onInputChange} 
                className="flex-1"
              />
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-medium text-guro-blue mb-4">
              Select Your Teaching Method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => onMethodSelect("7es")} 
                className="h-auto p-6 bg-guro-blue hover:bg-guro-blue/90 flex flex-col items-center space-y-2 px-[24px]"
              >
                <Award className="w-8 h-8" />
                <span className="text-lg font-semibold">7Es Method</span>
                <div className="opacity-90 text-sm text-center">
                  <div>Elicit, Engage, Explore, Explain</div>
                  <div>Elaborate, Evaluate, Extend</div>
                </div>
              </Button>

              <Button 
                onClick={() => onMethodSelect("4as")} 
                variant="secondary" 
                className="h-auto p-6 flex flex-col items-center space-y-2"
              >
                <Award className="w-8 h-8" />
                <span className="text-lg font-semibold">4As Method</span>
                <span className="text-sm opacity-90">
                  Activity, Analysis, Abstraction, Application
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
