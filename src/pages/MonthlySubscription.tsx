
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/subscription/Header";
import { Timer } from "@/components/subscription/Timer";
import { ActionButtons } from "@/components/subscription/ActionButtons";
import { LoadingState } from "@/components/subscription/LoadingState";
import { TimeRemaining, calculateTimeRemaining } from "@/utils/time-utils";

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

  if (loading) {
    return <LoadingState />;
  }

  // Calculate the progress percentage for the conic gradient
  const totalSeconds = timeRemaining.days * 24 * 60 * 60 + 
                      timeRemaining.hours * 60 * 60 + 
                      timeRemaining.minutes * 60 + 
                      timeRemaining.seconds;
  const maxSeconds = 30 * 24 * 60 * 60; // 30 days in seconds
  const progressPercentage = (totalSeconds / maxSeconds) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f5f8f9]">
      <Header />
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <Card className="shadow-xl overflow-hidden animate-fade-in border-[#e0e9ed] hover:border-[#8cd09b] transition-all duration-300">
          <div className="bg-[#023d54]/5 px-6 py-4 border-b border-[#e0e9ed]">
            <h2 className="text-xl font-medium text-[#023d54] flex items-center justify-center">
              <span className="bg-[#023d54] text-white p-2 rounded-full mr-2 inline-flex items-center justify-center w-8 h-8">
                {email.charAt(0).toUpperCase()}
              </span>
              <span className="truncate">{email}</span>
            </h2>
          </div>
          <CardContent className="pt-8 pb-10 px-8">
            <div className="text-center space-y-10">
              <div className="mb-12">
                <Timer 
                  timeRemaining={timeRemaining} 
                  progressPercentage={progressPercentage} 
                />
                <div className="mt-6 text-sm text-gray-600 max-w-md mx-auto">
                  Your GuroAI subscription gives you full access to all features. Enjoy creating lesson plans, quizzes, and more!
                </div>
              </div>
              <ActionButtons />
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help? Contact us at <a href="mailto:support@guroai.com" className="text-[#023d54] hover:underline">support@guroai.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default MonthlySubscription;
