
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onForgotPassword: () => void;
}

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          onClick={onForgotPassword}
          className="text-sm text-guro-blue hover:underline"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
};
