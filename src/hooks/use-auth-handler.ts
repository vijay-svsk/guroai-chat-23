
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { loginUser, signUpUser } from "@/services/auth-service";
import { createInitialSubscription } from "@/services/subscription-service";
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

  // Ensure we're not using chat auth
  const cleanupChatAuth = () => {
    localStorage.removeItem("guro_chat_auth");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Make sure we're not using chat auth
    cleanupChatAuth();

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

          setShowConfetti(true);
          toast({
            title: "Welcome back!",
            description: "Successfully logged in",
            duration: 3000,
          });
          navigate("/monthlysubscription");
        }
      } else {
        // For signup, create subscription and redirect to monthlysubscription
        const { user } = await signUpUser(email, password);

        if (user) {
          await createInitialSubscription(user.id);
          setShowConfetti(true);
          toast({
            title: "Welcome to GuroAI!",
            description: "Your account has been created successfully.",
            duration: 3000,
          });
          navigate("/monthlysubscription");
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
