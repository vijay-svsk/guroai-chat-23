
import React from 'react';
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

export const FileUpload = ({ file, setFile }: FileUploadProps) => {
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

  return (
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
  );
};

export default FileUpload;
