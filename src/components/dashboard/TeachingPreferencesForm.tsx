
import { Input } from "@/components/ui/input";
import { BookOpen, GraduationCap, BookType, Languages, Settings } from "lucide-react";

interface TeachingPreferencesFormProps {
  formData: {
    subject: string;
    gradeLevel: string;
    topic: string;
    language: string;
    customInstructions: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TeachingPreferencesForm = ({ formData, onInputChange }: TeachingPreferencesFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <BookOpen className="text-guro-blue w-6 h-6" />
        <Input 
          name="subject" 
          placeholder="Subject (e.g., Mathematics, Science)" 
          value={formData.subject} 
          onChange={onInputChange} 
          className="flex-1" 
        />
      </div>

      <div className="flex items-center space-x-4">
        <GraduationCap className="text-guro-blue w-6 h-6" />
        <Input 
          name="gradeLevel" 
          placeholder="Grade Level (e.g., Grade 7, High School)" 
          value={formData.gradeLevel} 
          onChange={onInputChange} 
          className="flex-1" 
        />
      </div>

      <div className="flex items-center space-x-4">
        <BookType className="text-guro-blue w-6 h-6" />
        <Input 
          name="topic" 
          placeholder="Topic (e.g., Algebra, Chemical Bonds)" 
          value={formData.topic} 
          onChange={onInputChange} 
          className="flex-1" 
        />
      </div>

      <div className="flex items-center space-x-4">
        <Languages className="text-guro-blue w-6 h-6" />
        <Input 
          name="language" 
          placeholder="Language Used (e.g., English, Filipino)" 
          value={formData.language} 
          onChange={onInputChange} 
          className="flex-1" 
        />
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
  );
};
