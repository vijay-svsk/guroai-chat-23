
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
