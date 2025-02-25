
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Presentation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeRemaining = (endDate: Date): TimeRemaining => {
  const now = new Date();
  const diffTime = Math.max(0, endDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffTime / 1000);
  
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  return { days, hours, minutes, seconds };
};

const MonthlySubscription = () => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [email, setEmail] = useState<string>("");
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }
        setEmail(user.email || "");

        // Get subscription status
        const { data: subscription, error } = await supabase
          .from('subscriptions')
          .select('end_date, status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;

        if (!subscription) {
          // Create new subscription if none exists
          const startDate = new Date();
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30); // 30 days from now

          const { data: newSubscription, error: createError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: user.id,
              status: 'active',
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
            })
            .select()
            .single();

          if (createError) throw createError;

          if (newSubscription) {
            const newEndDate = new Date(newSubscription.end_date);
            setSubscriptionEndDate(newEndDate);
            setTimeRemaining(calculateTimeRemaining(newEndDate));
          }
        } else {
          const endDate = new Date(subscription.end_date);
          setSubscriptionEndDate(endDate);
          
          const timeLeft = calculateTimeRemaining(endDate);
          setTimeRemaining(timeLeft);
          
          if (timeLeft.days <= 10 && timeLeft.days > 0) {
            toast({
              title: "Subscription Ending Soon",
              description: `Your subscription will expire in ${timeLeft.days} days. Please renew to maintain access.`,
              duration: 5000
            });
          }
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
        toast({
          title: "Error",
          description: "Failed to load subscription status",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate, toast]);

  useEffect(() => {
    if (!subscriptionEndDate) return;

    const timer = setInterval(() => {
      const timeLeft = calculateTimeRemaining(subscriptionEndDate);
      setTimeRemaining(timeLeft);

      if (timeLeft.days === 0 && timeLeft.hours === 0 && 
          timeLeft.minutes === 0 && timeLeft.seconds === 0) {
        clearInterval(timer);
        navigate('/payment');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [subscriptionEndDate, navigate]);

  // Calculate the progress percentage for the conic gradient
  const totalSeconds = timeRemaining.days * 24 * 60 * 60 + 
                      timeRemaining.hours * 60 * 60 + 
                      timeRemaining.minutes * 60 + 
                      timeRemaining.seconds;
  const maxSeconds = 30 * 24 * 60 * 60; // 30 days in seconds
  const progressPercentage = (totalSeconds / maxSeconds) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-[#0a1d2c] p-4 flex justify-center items-center">
          <img 
            alt="GuroAI Logo" 
            className="w-40 h-auto" 
            src="/lovable-uploads/885e1cea-e151-4401-a75b-92d7877ab168.jpg" 
          />
        </div>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse">
            <Clock className="w-16 h-16 text-[#8cd09b]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0a1d2c] p-4 flex justify-center items-center">
        <img 
          alt="GuroAI Logo" 
          className="w-40 h-auto" 
          src="/lovable-uploads/885e1cea-e151-4401-a75b-92d7877ab168.jpg" 
        />
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
                <div 
                  className="absolute inset-0 rounded-full transition-all duration-1000 ease-in-out"
                  style={{
                    background: `conic-gradient(#8cd09b ${progressPercentage}%, #e5e7eb ${progressPercentage}%)`,
                    transform: 'rotate(-90deg)',
                    transition: 'all 1s linear'
                  }}
                />
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="w-8 h-8 mx-auto mb-1 text-[#8cd09b] animate-pulse" />
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

              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  className="w-full bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54] font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  Generate Lesson Plan
                </Button>
                <Button 
                  onClick={() => navigate('/slidepresentation')} 
                  className="w-full bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54] font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  <Presentation className="mr-2" />
                  Generate Slide Presentation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlySubscription;
