
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { loginUser, signUpUser } from "@/services/auth-service";
import { checkSubscriptionStatus, createInitialSubscription } from "@/services/subscription-service";
import { checkDeviceAuthorization } from "@/utils/device-utils";

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
        return;
      }

      if (isLogin) {
        const { user } = await loginUser(email, password);
        
        if (user) {
          const isDeviceAuthorized = await checkDeviceAuthorization(user.id);
          if (!isDeviceAuthorized) {
            navigate('/device-restricted');
            return;
          }

          const hasActiveSubscription = await checkSubscriptionStatus(user.id);

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
        }
      } else {
        // For signup, redirect to login page after successful registration
        const { user } = await signUpUser(email, password);

        if (user) {
          await createInitialSubscription(user.id);
          toast({
            title: "Account Created",
            description: "Please sign in with your new account",
            duration: 3000,
          });
          navigate("/newuseraccountlogin");
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
