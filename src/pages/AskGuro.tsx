
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/subscription/Header";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send } from "lucide-react";

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
      <div className="max-w-3xl mx-auto mt-12 px-4">
        <Card className="shadow-xl">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#023d54] flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Ask GuroAI
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !question.trim()}
                    className="bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54]"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>

              {answer && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap text-gray-700">{answer}</p>
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
