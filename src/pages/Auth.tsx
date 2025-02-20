
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ReactConfetti from "react-confetti";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { useAuthHandler } from "@/hooks/use-auth-handler";

const Auth = () => {
  const navigate = useNavigate();
  const {
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
  } = useAuthHandler();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!subscription || subscription.status !== 'active') {
        navigate('/payment');
      } else {
        navigate('/dashboard');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {showConfetti && (
        <ReactConfetti
          recycle={false}
          numberOfPieces={200}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      <div className="max-w-md w-full space-y-8">
        <AuthHeader />

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? "Sign In" : "Sign Up"}</CardTitle>
          </CardHeader>
          <CardContent>
            <AuthForm
              isLogin={isLogin}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              loading={loading}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
              onSubmit={handleAuth}
              onToggleMode={() => setIsLogin(!isLogin)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
