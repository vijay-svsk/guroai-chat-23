
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/auth/LoginForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useLoginAuth } from "@/hooks/use-login-auth";

const NewUserAccountLogin = () => {
  const navigate = useNavigate();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    resetPasswordEmail,
    setResetPasswordEmail,
    isResetMode,
    setIsResetMode,
    resetSent,
    setResetSent,
    handleLogin,
    handleResetPassword,
  } = useLoginAuth();

  // Clear any chat auth when accessing the main login page
  useEffect(() => {
    localStorage.removeItem("guro_chat_auth");
  }, []);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/monthlysubscription');
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-guro-blue">
            {isResetMode ? "Reset Your Password" : "Welcome Back!"}
          </h2>
          <p className="mt-2 text-gray-600">
            {isResetMode 
              ? "Enter your email to receive a password reset link" 
              : "Please sign in to your account"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isResetMode ? "Reset Password" : "Sign In"}</CardTitle>
          </CardHeader>
          <CardContent>
            {isResetMode ? (
              <ResetPasswordForm 
                email={resetPasswordEmail}
                setEmail={setResetPasswordEmail}
                loading={loading}
                resetSent={resetSent}
                onSubmit={handleResetPassword}
                onBackToLogin={() => {
                  setIsResetMode(false);
                  setResetSent(false);
                }}
              />
            ) : (
              <LoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                onSubmit={handleLogin}
                onForgotPassword={() => setIsResetMode(true)}
              />
            )}
          </CardContent>
        </Card>

        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Button>
      </div>
    </div>
  );
};

export default NewUserAccountLogin;
