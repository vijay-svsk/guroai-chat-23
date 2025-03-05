import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, Table, ArrowLeft, Download, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizForm } from "@/components/quiz/QuizForm";
import { QuizDisplay } from "@/components/quiz/QuizDisplay";
import { TableOfSpecificationDisplay } from "@/components/quiz/TableOfSpecification";
import { useQuizGeneration } from "@/hooks/use-quiz-generation";
import { useQuizDownload } from "@/hooks/use-quiz-download";
import { useSaveQuiz } from "@/hooks/use-save-quiz";
import { useToast } from "@/hooks/use-toast";
import type { QuizFormData } from "@/types/quiz-types";

const GenerateQuizzes = () => {
  const navigate = useNavigate();
  const { 
    isLoading, 
    isTosLoading, 
    quiz, 
    tableOfSpecification, 
    generateQuiz, 
    generateTOS 
  } = useQuizGeneration();
  const { downloadQuizDocx } = useQuizDownload();
  const { saveQuiz, isSaving } = useSaveQuiz();
  const [lastFormData, setLastFormData] = useState<QuizFormData | null>(null);
  const { toast } = useToast();

  const handleSubmit = (data: QuizFormData) => {
    setLastFormData(data);
    generateQuiz(data);
  };

  const handleGenerateTOS = () => {
    if (lastFormData) {
      generateTOS(lastFormData);
    }
  };

  const handleDownloadQuiz = () => {
    if (lastFormData && quiz) {
      downloadQuizDocx(quiz, lastFormData.subject, lastFormData.topic);
    }
  };

  const handleSaveQuiz = async () => {
    if (lastFormData && quiz) {
      await saveQuiz({
        gradeLevel: lastFormData.gradeLevel,
        subject: lastFormData.subject,
        topic: lastFormData.topic,
        examType: lastFormData.examType,
        quizData: JSON.stringify(quiz),
        tosData: tableOfSpecification ? JSON.stringify(tableOfSpecification) : null
      });
      toast({
        title: "Success!",
        description: "Quiz saved to your account. View it in My Account.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#023d54] border-b border-white/10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/lovable-uploads/cedd3880-b258-4398-af1c-f973e092aac4.png"
                alt="GuroAI Logo"
                className="h-12 w-12"
                loading="eager"
              />
              <h1 className="text-2xl font-semibold text-white">Generate Quizzes</h1>
            </div>
            <Button
              variant="outline"
              className="text-white border-[#8cd09b] bg-[#8cd09b] hover:bg-[#7bc08b] hover:text-white"
              onClick={() => navigate("/monthlysubscription")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 gap-8">
          {/* Quiz Generator Form */}
          <div>
            <h2 className="text-xl text-[#023d54] font-semibold mb-4">
              Quiz Input
            </h2>
            <QuizForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <Card className="bg-white shadow-md border border-gray-100">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8cd09b] mb-4"></div>
                <p className="text-lg text-[#023d54] text-center">
                  Generating Quizzes, Please Wait for a While...
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quiz Display */}
          {quiz && (
            <>
              <QuizDisplay quiz={quiz} />
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={handleDownloadQuiz}
                  className="bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54] font-semibold px-6 py-3 rounded-lg transition-all"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Quiz as DOCX
                </Button>
                
                <Button
                  onClick={handleSaveQuiz}
                  className="bg-[#023d54] hover:bg-[#01283a] text-white font-semibold px-6 py-3 rounded-lg transition-all"
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isSaving ? "Saving..." : "Save this Quiz"}
                </Button>
              </div>
            </>
          )}

          {/* Generate TOS Button */}
          {quiz && !tableOfSpecification && (
            <div className="flex justify-center">
              <Button
                onClick={handleGenerateTOS}
                className="bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54] font-semibold px-6 py-3 rounded-lg transition-all"
                disabled={isTosLoading}
              >
                <Table className="mr-2 h-5 w-5" />
                {isTosLoading ? "Generating..." : "Generate Table of Specification (TOS)"}
              </Button>
            </div>
          )}

          {/* TOS Loading State */}
          {isTosLoading && (
            <Card className="bg-white shadow-md border border-gray-100">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8cd09b] mb-4"></div>
                <p className="text-lg text-[#023d54] text-center">
                  Generating Table of Specification...
                </p>
              </CardContent>
            </Card>
          )}

          {/* TOS Display */}
          {tableOfSpecification && (
            <TableOfSpecificationDisplay tos={tableOfSpecification} />
          )}
        </div>
      </main>
    </div>
  );
};

export default GenerateQuizzes;
