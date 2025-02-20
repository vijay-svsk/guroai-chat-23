
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthHandler = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkSubscriptionStatus = async (userId: string) => {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error checking subscription:', error);
      throw new Error('Unable to verify subscription status');
    }

    return subscription?.status === 'active';
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (isLogin) {
        // Handle existing user login
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Login Error",
            description: error.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (data.user) {
          try {
            const hasActiveSubscription = await checkSubscriptionStatus(data.user.id);

            if (hasActiveSubscription) {
              setShowConfetti(true);
              toast({
                title: "Welcome back!",
                description: "Successfully logged in",
                duration: 3000,
              });
              navigate("/dashboard");
            } else {
              toast({
                title: "Subscription Required",
                description: "Please complete your subscription to access the dashboard",
                duration: 5000,
              });
              navigate("/payment");
            }
          } catch (error) {
            toast({
              title: "Error",
              description: "Unable to verify subscription status",
              variant: "destructive",
            });
            setLoading(false);
          }
        }
      } else {
        // Handle new user signup
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          toast({
            title: "Sign Up Error",
            description: signUpError.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Create an initial subscription record with 'pending' status
        if (data.user) {
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .insert([
              {
                user_id: data.user.id,
                status: 'pending',
                start_date: new Date().toISOString(),
              }
            ]);

          if (subscriptionError) {
            console.error('Error creating subscription record:', subscriptionError);
          }

          setShowConfetti(true);
          toast({
            title: "Account Created",
            description: "Please complete your subscription to access GuroAI!",
            duration: 3000,
          });
          // Always redirect new users to payment page
          navigate("/payment");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isLogin,
    email,
    password,
    confirmPassword,
    loading,
    showConfetti,
    setIsLogin,
    setEmail,
    setPassword,
    setConfirmPassword,
    setShowConfetti,
    handleAuth,
  };
};
