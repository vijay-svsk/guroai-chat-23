import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
const calculateTimeRemaining = (daysRemaining: number): TimeRemaining => {
  const totalSeconds = daysRemaining * 24 * 60 * 60;
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor(totalSeconds % (24 * 60 * 60) / (60 * 60));
  const minutes = Math.floor(totalSeconds % (60 * 60) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return {
    days,
    hours,
    minutes,
    seconds
  };
};
const MonthlySubscription = () => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setEmail(user.email || "");

      // Get subscription status
      const {
        data: subscription
      } = await supabase.from('subscriptions').select('end_date, status').eq('user_id', user.id).single();
      if (subscription) {
        const endDate = new Date(subscription.end_date);
        const now = new Date();
        const diffTime = Math.max(0, endDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 10 && diffDays > 0) {
          toast({
            title: "Subscription Ending Soon",
            description: `Your subscription will expire in ${diffDays} days. Please renew to maintain access.`,
            duration: 5000
          });
        }
        setTimeRemaining(calculateTimeRemaining(diffDays));
      }
    };
    checkAuth();

    // Update countdown every second
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const totalSeconds = prev.days * 24 * 60 * 60 + prev.hours * 60 * 60 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) {
          clearInterval(timer);
          navigate('/payment');
          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          };
        }
        return calculateTimeRemaining(totalSeconds / (24 * 60 * 60));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate, toast]);
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-guro-blue p-4 flex justify-center items-center">
        <img alt="GuroAI Logo" className="w-40 h-auto" src="/lovable-uploads/885e1cea-e151-4401-a75b-92d7877ab168.jpg" />
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto mt-12 px-4">
        <Card className="shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-8">
              <h2 className="text-lg font-medium text-[#023d54] truncate">
                {email}
              </h2>

              {/* Animated Timer */}
              <div className="relative mx-auto w-48 h-48">
                <div className="absolute inset-0 rounded-full transition-all duration-1000 ease-in-out" style={{
                background: `conic-gradient(#8cd09b ${(timeRemaining.days * 24 * 60 * 60 + timeRemaining.hours * 60 * 60 + timeRemaining.minutes * 60 + timeRemaining.seconds) / (30 * 24 * 60 * 60) * 100}%, #e5e7eb ${(timeRemaining.days * 24 * 60 * 60 + timeRemaining.hours * 60 * 60 + timeRemaining.minutes * 60 + timeRemaining.seconds) / (30 * 24 * 60 * 60) * 100}%)`,
                transform: 'rotate(-90deg)'
              }} />
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-1 text-[#8cd09b]" />
                    <div className="space-y-1">
                      <p className="text-xl font-bold text-[#023d54]">
                        {timeRemaining.days}d {timeRemaining.hours}h
                      </p>
                      <p className="text-sm text-[#023d54]">
                        {timeRemaining.minutes}m {timeRemaining.seconds}s
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => navigate('/dashboard')} className="w-full bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54] font-semibold py-3 px-6 rounded-lg transition-all">
                Generate Lesson Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default MonthlySubscription;