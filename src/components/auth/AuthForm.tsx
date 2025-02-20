
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail } from "lucide-react";

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
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
        disabled={loading}
      >
        {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
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
