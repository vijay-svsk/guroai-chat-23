
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/services/auth-service";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

export const AuthForm = ({
  isLogin,
  email,
  password,
  confirmPassword,
  loading,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onToggleMode,
}: AuthFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signingUp, setSigningUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setSigningUp(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success!",
          description: "Account created successfully. Please sign in to continue.",
          duration: 5000,
        });
        navigate("/newuseraccountlogin");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSigningUp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast({
        title: "Error",
        description: error.message || "Invalid login credentials",
        variant: "destructive",
      });
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

    setResetLoading(true);
    try {
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
      setResetLoading(false);
    }
  };

  if (isResetMode) {
    return (
      <div className="space-y-6">
        {resetSent ? (
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
              disabled={resetLoading}
            >
              {resetLoading ? "Sending..." : "Send Reset Link"}
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
        )}
      </div>
    );
  }

  return (
    <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-6">
      {!isLogin && (
        <div className="bg-blue-50 p-4 rounded-md mb-4 border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Important:</strong> Please double-check your email and password before creating your account. 
            Make sure to use a valid email address and remember your password exactly as entered.
          </p>
        </div>
      )}
      
      <div>
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-gray-500" />
          <Input
            type="email"
            value={email}
            onChange={onEmailChange}
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
            onChange={onPasswordChange}
            placeholder="Password"
            required
          />
        </div>
      </div>

      {!isLogin && (
        <div>
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <Input
              type="password"
              value={confirmPassword}
              onChange={onConfirmPasswordChange}
              placeholder="Confirm password"
              required
            />
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-guro-blue hover:bg-guro-blue/90"
        disabled={loading || signingUp}
      >
        {loading || signingUp ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
      </Button>

      {isLogin && (
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => setIsResetMode(true)}
            className="text-sm text-guro-blue hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-sm text-guro-blue hover:underline"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </form>
  );
};
