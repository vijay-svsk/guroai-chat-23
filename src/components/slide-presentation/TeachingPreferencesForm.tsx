
import React from 'react';
import { Input } from "@/components/ui/input";
import { BookOpen, GraduationCap, BookType } from "lucide-react";

interface TeachingPreferencesFormProps {
  subject: string;
  setSubject: (subject: string) => void;
  gradeLevel: string;
  setGradeLevel: (gradeLevel: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
}

export const TeachingPreferencesForm = ({ 
  subject,
  setSubject,
  gradeLevel,
  setGradeLevel,
  topic,
  setTopic,
}: TeachingPreferencesFormProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-white">Presentation Details</h2>
      <div className="flex items-center space-x-4">
        <BookOpen className="w-6 h-6 text-[#8cd09b]" />
        <Input 
          placeholder="Subject (e.g., Mathematics, Science)" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center space-x-4">
        <GraduationCap className="w-6 h-6 text-[#8cd09b]" />
        <Input 
          placeholder="Grade Level (e.g., Grade 7, High School)" 
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center space-x-4">
        <BookType className="w-6 h-6 text-[#8cd09b]" />
        <Input 
          placeholder="Topic (e.g., Algebra, Chemical Bonds)" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default TeachingPreferencesForm;
