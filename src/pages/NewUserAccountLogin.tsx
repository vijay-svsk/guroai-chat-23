
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/services/auth-service";

const NewUserAccountLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await loginUser(email, password);

      if (user) {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
          duration: 3000,
        });
        navigate("/monthlysubscription");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message || "Invalid login credentials. Please check your email and password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First, check if the email exists in the auth system
      const { data, error: signInError } = await supabase.auth.signInWithOtp({
        email: resetPasswordEmail,
        options: {
          shouldCreateUser: false, // This will fail if user doesn't exist
        }
      });

      if (signInError) {
        if (signInError.message.includes("does not exist")) {
          toast({
            title: "Account not found",
            description: "This email is not registered in our system. Please sign up to create a new account.",
            variant: "destructive",
            duration: 5000,
          });
          return;
        }
        throw signInError;
      }

      // If we get here, the user exists, so send the reset email
      const { error } = await supabase.auth.resetPasswordForEmail(resetPasswordEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetSent(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
              resetSent ? (
                <div className="text-center py-4">
                  <p className="text-green-600 mb-4">Reset link sent to your email!</p>
                  <Button 
                    onClick={() => {
                      setIsResetMode(false);
                      setResetSent(false);
                    }}
                    className="mt-4 w-full"
                  >
                    Back to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <Input
                        type="email"
                        value={resetPasswordEmail}
                        onChange={(e) => setResetPasswordEmail(e.target.value)}
                        placeholder="Email address"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-guro-blue hover:bg-guro-blue/90"
                    disabled={loading}
                  >
                    {loading ? "Checking..." : "Send Reset Link"}
                  </Button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => setIsResetMode(false)}
                      className="text-sm text-guro-blue hover:underline"
                    >
                      Back to login
                    </button>
                  </div>
                </form>
              )
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-guro-blue hover:bg-guro-blue/90"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-sm text-guro-blue hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
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
