
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/subscription/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bot } from "lucide-react";
import { LoadingState } from "@/components/subscription/LoadingState";

const AskGuro = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ask-guro', {
        body: { question: question.trim() }
      });

      if (error) throw error;
      if (!data?.answer) throw new Error('No answer received');
      
      setAnswer(data.answer);
      setQuestion(""); // Clear input after successful response
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get an answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f8fafc]">
      <Header />
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#023d54] tracking-tight mb-2">
              Hi, I'm GuroAI.
            </h1>
            <p className="text-2xl text-[#023d54]/80 tracking-tight">
              How can I help you today?
            </p>
          </div>
          
          <div className="relative w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything"
                disabled={isLoading}
                className="w-full pl-4 pr-14 py-6 text-lg rounded-full border-2 border-[#023d54]/10 focus-visible:ring-[#023d54] text-[#023d54] shadow-lg transition-shadow duration-200 hover:shadow-xl"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !question.trim()}
                  className="h-10 w-10 rounded-full bg-[#023d54] hover:bg-[#023d54]/90 transition-transform duration-200 hover:scale-105"
                >
                  <Bot className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>

          {isLoading && (
            <div className="mt-8 w-full max-w-2xl">
              <LoadingState />
            </div>
          )}

          {answer && !isLoading && (
            <div className="mt-8 w-full max-w-2xl p-6 bg-white rounded-lg border border-[#023d54]/10 shadow-lg">
              <p className="text-[#023d54]/90 whitespace-pre-wrap leading-relaxed">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AskGuro;
