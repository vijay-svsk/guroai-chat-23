
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Quiz } from "@/types/quiz-types";

interface QuizDisplayProps {
  quiz: Quiz | null;
}

export const QuizDisplay = ({ quiz }: QuizDisplayProps) => {
  if (!quiz) return null;

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-xl text-center">Generated Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <p>{quiz.instructions}</p>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((question, index) => (
            <div key={index} className="border rounded-md p-4">
              <p className="font-medium mb-2">
                {index + 1}. {question.question}
              </p>
              
              {question.options && (
                <div className="ml-4 mt-2 space-y-1">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-start">
                      <span className="mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
