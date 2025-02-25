
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/subscription/Header";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Bot } from "lucide-react";

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
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="max-w-3xl mx-auto w-full px-4 py-8 flex-1">
        <Card className="shadow-xl border-[#023d54]/10">
          <CardContent className="pt-6">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-[#023d54]">
                <Bot className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Ask GuroAI</h1>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What can I help you with?"
                    disabled={isLoading}
                    className="flex-1 border-[#023d54]/20 focus-visible:ring-[#023d54] text-[#023d54]"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !question.trim()}
                    className="bg-[#8cd09b] hover:bg-[#8cd09b]/90 text-[#023d54] font-semibold"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>

              {answer && (
                <div className="mt-6 p-6 bg-[#023d54]/5 rounded-lg border border-[#023d54]/10">
                  <div className="flex gap-3 mb-3">
                    <MessageSquare className="w-5 h-5 text-[#023d54]" />
                    <span className="font-medium text-[#023d54]">GuroAI's Response</span>
                  </div>
                  <p className="text-[#023d54]/90 whitespace-pre-wrap">{answer}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AskGuro;
