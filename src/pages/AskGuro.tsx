
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/subscription/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bot } from "lucide-react";

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
      setAnswer(data.answer);
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
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center text-[#023d54] mb-8">
          Hi, I'm GuroAI. How can I help you today?
        </h1>
        
        <div className="relative">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything"
              disabled={isLoading}
              className="w-full pl-4 pr-14 py-6 text-lg rounded-full border-2 border-[#023d54]/10 focus-visible:ring-[#023d54] text-[#023d54] shadow-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !question.trim()}
                className="h-10 w-10 rounded-full bg-[#023d54] hover:bg-[#023d54]/90"
              >
                <Bot className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>

        {answer && (
          <div className="mt-8 p-6 bg-[#023d54]/5 rounded-lg border border-[#023d54]/10">
            <p className="text-[#023d54]/90 whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AskGuro;
