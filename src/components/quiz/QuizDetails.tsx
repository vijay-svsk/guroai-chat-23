
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { SavedQuiz, Quiz, TableOfSpecification } from "@/types/quiz-types";
import { useQuizDownload } from "@/hooks/use-quiz-download";

interface QuizDetailsProps {
  quiz: SavedQuiz;
}

export const QuizDetails = ({ quiz }: QuizDetailsProps) => {
  const { downloadQuizDocx } = useQuizDownload();
  
  // Parse the saved quiz data
  const quizData: Quiz = JSON.parse(quiz.quiz_data);
  let tosData: TableOfSpecification | null = null;
  
  if (quiz.tos_data) {
    tosData = JSON.parse(quiz.tos_data);
  }

  const handleDownload = () => {
    downloadQuizDocx(quizData, quiz.subject, quiz.topic);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{quiz.topic}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-sm text-gray-600">{quiz.subject}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">{quiz.grade_level}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600 capitalize">{quiz.exam_type.replace(/-/g, ' ')}</span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Created on {format(new Date(quiz.created_at), 'MMMM d, yyyy')}
          </div>
        </div>
        
        <Button 
          onClick={handleDownload}
          className="bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54]"
        >
          <Download className="mr-2 h-4 w-4" />
          Download as DOCX
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <p>{quizData.instructions}</p>
          </div>

          <div className="space-y-4">
            {quizData.questions.map((question, index) => (
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

      {tosData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Table of Specification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Cognitive Domain</th>
                    <th className="border px-4 py-2 text-left">Number of Items</th>
                    <th className="border px-4 py-2 text-left">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {tosData.domains.map((domain, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="border px-4 py-2">{domain.level}</td>
                      <td className="border px-4 py-2">{domain.numberOfItems}</td>
                      <td className="border px-4 py-2">{domain.percentage}%</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-semibold">
                    <td className="border px-4 py-2">Total</td>
                    <td className="border px-4 py-2">{tosData.totalItems}</td>
                    <td className="border px-4 py-2">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
