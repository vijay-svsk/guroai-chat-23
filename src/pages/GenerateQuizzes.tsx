
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, Table, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizForm } from "@/components/quiz/QuizForm";
import { QuizDisplay } from "@/components/quiz/QuizDisplay";
import { TableOfSpecificationDisplay } from "@/components/quiz/TableOfSpecification";
import { useQuizGeneration } from "@/hooks/use-quiz-generation";
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
  const [lastFormData, setLastFormData] = useState<QuizFormData | null>(null);

  const handleSubmit = (data: QuizFormData) => {
    setLastFormData(data);
    generateQuiz(data);
  };

  const handleGenerateTOS = () => {
    if (lastFormData) {
      generateTOS(lastFormData);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1d2c]">
      <header className="bg-[#0a1d2c] border-b border-white/10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/lovable-uploads/24e7e402-845e-4126-b717-af2167b4ef23.png"
                alt="GuroAI Logo"
                className="h-12 w-12 rounded-md"
                loading="eager"
              />
              <h1 className="text-2xl font-semibold text-white">Generate Quizzes</h1>
            </div>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/10"
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
            <h2 className="text-xl text-white font-semibold mb-4">
              Quiz Input
            </h2>
            <QuizForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <Card className="bg-white/5 backdrop-blur">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8cd09b] mb-4"></div>
                <p className="text-lg text-white text-center">
                  Generating Quizzes, Please Wait for a While...
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quiz Display */}
          {quiz && <QuizDisplay quiz={quiz} />}

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
            <Card className="bg-white/5 backdrop-blur">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8cd09b] mb-4"></div>
                <p className="text-lg text-white text-center">
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
