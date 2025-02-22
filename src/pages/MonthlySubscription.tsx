
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MonthlySubscription = () => {
  const [daysRemaining, setDaysRemaining] = useState<number>(30);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setEmail(user.email || "");

      // Get subscription status
      const { data: subscription } = await supabase
        .from('subscription_status')
        .select('days_remaining')
        .eq('user_id', user.id)
        .single();

      if (subscription) {
        setDaysRemaining(Math.max(0, subscription.days_remaining));
        
        // Show notification if 10 or fewer days remaining
        if (subscription.days_remaining <= 10 && subscription.days_remaining > 0) {
          toast({
            title: "Subscription Ending Soon",
            description: `Your subscription will expire in ${subscription.days_remaining} days. Please renew to maintain access.`,
            duration: 5000,
          });
        }
        
        // Redirect to payment if subscription has expired
        if (subscription.days_remaining <= 0) {
          navigate('/payment');
        }
      }
    };

    checkAuth();
    
    // Check subscription status every hour
    const interval = setInterval(checkAuth, 3600000);
    return () => clearInterval(interval);
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-guro-blue p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">GuroAI</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto mt-12 px-4">
        <Card className="shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-8">
              <h2 className="text-2xl font-semibold text-[#023d54]">
                {email}
              </h2>

              {/* Animated Timer */}
              <div className="relative mx-auto w-48 h-48">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#8cd09b ${(daysRemaining / 30) * 100}%, #e5e7eb ${(daysRemaining / 30) * 100}%)`,
                    animation: "rotate 2s linear infinite"
                  }}
                />
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="w-12 h-12 mx-auto mb-2 text-[#8cd09b]" />
                    <p className="text-2xl font-bold text-[#023d54]">
                      {daysRemaining}
                    </p>
                    <p className="text-sm text-[#023d54]">Days Left</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54] font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Generate Lesson Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlySubscription;
