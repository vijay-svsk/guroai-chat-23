
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatAuthProps {
  onSubscribe: () => void;
  isSubscribed?: boolean;
}

export const ChatAuth = ({ onSubscribe, isSubscribed = false }: ChatAuthProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already authenticated with Supabase
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    
    getSession();
    
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSubscribeClick = () => {
    setError(null);
    setLoading(true);
    
    try {
      // Directly redirect to Xendit payment page
      window.location.href = 'https://checkout.xendit.co/od/guroai.online';
    } catch (err) {
      setError("Failed to redirect to payment page. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/newuseraccountlogin');
  };

  const handleStartChat = () => {
    navigate('/ask-guro');
  };

  // If already authenticated and subscribed
  if (session || isSubscribed) {
    return (
      <div className="max-w-md w-full mx-auto p-4">
        <Card className="shadow-lg border-[#023d54]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#023d54]">
              Welcome to GuroAI Chat
            </CardTitle>
            <CardDescription className="text-[#023d54]/70 text-base">
              You have an active subscription. Start chatting now!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-center text-green-600 font-medium">
                Thank you for subscribing to GuroAI Chat!
              </p>
              
              <Button 
                onClick={handleStartChat}
                className="w-full bg-[#023d54] hover:bg-[#023d54]/90" 
              >
                Start Chatting Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <Card className="shadow-lg border-[#023d54]/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#023d54]">
            GuroAI Chat
          </CardTitle>
          <CardDescription className="text-[#023d54]/70 text-base">
            Subscribe or login to start chatting with GuroAI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#023d54] mb-2">Subscribe to GuroAI Chat</h3>
              <p className="text-sm text-gray-600">
                Get instant access to GuroAI Chat for just ₱299/month. Your subscription includes:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>Unlimited AI-powered conversations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>Teaching advice and lesson plan assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>24/7 access to GuroAI</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleSubscribeClick}
                className="w-full bg-[#023d54] hover:bg-[#023d54]/90" 
                disabled={loading}
              >
                {loading ? "Redirecting..." : "Subscribe Now - ₱299/month"}
                <CreditCard className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                onClick={handleLoginClick}
                className="w-full bg-white text-[#023d54] border border-[#023d54] hover:bg-gray-50" 
              >
                Account Login
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {error && (
              <div className="text-sm text-red-500 font-medium">{error}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
