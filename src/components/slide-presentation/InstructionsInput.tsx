
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface InstructionsInputProps {
  instructions: string;
  setInstructions: (instructions: string) => void;
}

export const InstructionsInput = ({ instructions, setInstructions }: InstructionsInputProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-white">Custom Instructions</h2>
      <Textarea
        placeholder="Enter any specific instructions for generating your slides (optional)"
        className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-gray-400"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />
    </div>
  );
};

export default InstructionsInput;
