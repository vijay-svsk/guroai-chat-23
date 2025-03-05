
import React from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SavedQuiz } from "@/types/quiz-types";
import { formatDate } from "@/utils/date-utils";

interface QuizCardProps {
  quiz: SavedQuiz;
  onView: (quiz: SavedQuiz) => void;
}

export const QuizCard = ({ quiz, onView }: QuizCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-[#023d54] p-2 rounded-md">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="text-sm text-gray-500">
            {formatDate(quiz.created_at)}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
            {quiz.topic}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {quiz.subject} | {quiz.grade_level}
          </p>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8cd09b]/20 text-[#023d54]">
            {quiz.exam_type.replace(/-/g, ' ')}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3">
        <Button
          variant="ghost"
          className="w-full text-[#023d54] hover:text-[#023d54] hover:bg-[#8cd09b]/20"
          onClick={() => onView(quiz)}
        >
          View Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};
