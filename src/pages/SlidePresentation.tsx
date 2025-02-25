
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import FileUpload from "@/components/slide-presentation/FileUpload";
import InstructionsInput from "@/components/slide-presentation/InstructionsInput";
import ActionButtons from "@/components/slide-presentation/ActionButtons";

export const SlidePresentation = () => {
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#0a1d2c]">
      {/* Header */}
      <header className="bg-[#0a1d2c] border-b border-white/10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/24e7e402-845e-4126-b717-af2167b4ef23.png" 
              alt="GuroAI Logo" 
              className="h-12 w-12 rounded-md"
              loading="eager"
            />
            <h1 className="text-2xl font-semibold text-white">Generate Slide Presentation</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <div className="p-6 space-y-6">
            <FileUpload file={file} setFile={setFile} />
            <InstructionsInput 
              instructions={instructions} 
              setInstructions={setInstructions} 
            />
            <ActionButtons 
              file={file}
              instructions={instructions}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              generatedSlides={generatedSlides}
              setGeneratedSlides={setGeneratedSlides}
            />
          </div>
        </Card>
      </main>
    </div>
  );
};

export default SlidePresentation;
