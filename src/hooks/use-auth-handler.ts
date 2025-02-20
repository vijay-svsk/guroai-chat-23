
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

  const getDeviceId = () => {
    // Get or create a unique device identifier
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  };

  const checkDeviceAuthorization = async (userId: string) => {
    const currentDeviceId = getDeviceId();
    
    // Check if this device is already registered
    const { data: existingDevice } = await supabase
      .from('user_devices')
      .select('device_id')
      .eq('user_id', userId)
      .eq('device_id', currentDeviceId)
      .single();

    if (existingDevice) {
      return true;
    }

    // Count existing devices
    const { data: devices } = await supabase
      .from('user_devices')
      .select('device_id')
      .eq('user_id', userId);

    // If user has less than 3 devices, register this one
    if (devices && devices.length < 3) {
      await supabase
        .from('user_devices')
        .insert({
          user_id: userId,
          device_id: currentDeviceId
        });
      return true;
    }

    return false;
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
            // Check device authorization
            const isDeviceAuthorized = await checkDeviceAuthorization(data.user.id);
            if (!isDeviceAuthorized) {
              navigate('/device-restricted');
              return;
            }

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

        // Create an initial subscription record with 'expired' status
        if (data.user) {
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: data.user.id,
              status: 'expired',
              start_date: new Date().toISOString(),
            });

          if (subscriptionError) {
            console.error('Error creating subscription record:', subscriptionError);
          }

          // Register the device
          await supabase
            .from('user_devices')
            .insert({
              user_id: data.user.id,
              device_id: getDeviceId(),
            });

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
