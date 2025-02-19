
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: subscription, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        // Check if subscription exists and is active and not expired
        const isActive = subscription && 
          subscription.status === 'active' && 
          new Date(subscription.end_date) > new Date();

        setIsSubscribed(isActive);

        // If subscription is expired, show message and redirect to payment
        if (subscription && !isActive) {
          toast({
            title: "Subscription Expired",
            description: "Please renew your subscription to continue using GuroAI",
            duration: 5000,
          });
          navigate('/payment');
        }
      } catch (error: any) {
        console.error('Error checking subscription:', error);
        toast({
          title: "Error",
          description: "Failed to check subscription status",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [navigate, toast]);

  return { isSubscribed, loading };
};
