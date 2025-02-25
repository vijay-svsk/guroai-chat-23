
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Presentation, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const SlidePresentation = () => {
  const [file, setFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      toast({
        title: "File uploaded successfully",
        description: uploadedFile.name,
      });
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('instructions', instructions);

      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'generate-slides',
        {
          body: formData,
        }
      );

      if (functionError) throw functionError;

      toast({
        title: "Success!",
        description: "Your slides have been generated successfully.",
      });

      // Handle the generated slides (e.g., download or preview)
    } catch (error) {
      console.error('Error generating slides:', error);
      toast({
        title: "Error",
        description: "Failed to generate slides. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
            {/* File Upload Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white">Upload Your Content</h2>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-[#8cd09b] border-dashed rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-3 text-[#8cd09b]" />
                    <p className="mb-2 text-sm text-white">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      DOCX, PDF, or TXT (MAX. 10MB)
                    </p>
                  </div>
                  <Input
                    type="file"
                    className="hidden"
                    accept=".docx,.pdf,.txt"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              {file && (
                <p className="text-sm text-[#8cd09b]">
                  Selected file: {file.name}
                </p>
              )}
            </div>

            {/* Instructions Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-white">Custom Instructions</h2>
              <Textarea
                placeholder="Enter any specific instructions for generating your slides (optional)"
                className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            {/* Generate Button */}
            <Button
              className="w-full bg-[#8cd09b] hover:bg-[#8cd09b]/90 text-[#0a1d2c] font-medium"
              onClick={handleGenerate}
              disabled={isGenerating || !file}
            >
              {isGenerating ? (
                <>
                  <Play className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Presentation className="w-4 h-4 mr-2" />
                  Generate Slides
                </>
              )}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default SlidePresentation;
