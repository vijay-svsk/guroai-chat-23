
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
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-3xl mx-auto mt-12 px-4">
        <Card className="shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-8">
              <h2 className="text-lg font-medium text-[#023d54] truncate">
                {email}
              </h2>
              <Timer 
                timeRemaining={timeRemaining} 
                progressPercentage={progressPercentage} 
              />
              <ActionButtons />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlySubscription;
