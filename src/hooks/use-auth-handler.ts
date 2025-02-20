
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
          const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', data.user.id)
            .single();

          if (subError) {
            console.error('Error checking subscription:', subError);
          }

          if (!subscription || subscription.status !== 'active' || new Date(subscription.end_date) <= new Date()) {
            toast({
              title: "Subscription Required",
              description: "Please subscribe to access GuroAI",
              duration: 3000,
            });
            navigate("/payment");
            return;
          }

          setShowConfetti(true);
          toast({
            title: "Welcome back!",
            description: "Successfully logged in",
            duration: 3000,
          });
          navigate("/dashboard");
        }
      } else {
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

        if (data.user) {
          setShowConfetti(true);
          toast({
            title: "Account Created",
            description: "Welcome to GuroAI!",
            duration: 3000,
          });
          navigate("/dashboard");
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
