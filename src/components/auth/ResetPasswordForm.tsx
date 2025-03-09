
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ResetPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  resetSent: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBackToLogin: () => void;
}

export const ResetPasswordForm = ({
  email,
  setEmail,
  loading,
  resetSent,
  onSubmit,
  onBackToLogin,
}: ResetPasswordFormProps) => {
  if (resetSent) {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 mb-4">
          If your email is registered, you'll receive a reset link shortly.
          Please check your inbox and spam folder.
        </p>
        <Button 
          onClick={onBackToLogin}
          className="mt-4 w-full"
        >
          Back to Login
        </Button>
      </div>
    );
  }

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
          onClick={onBackToLogin}
          className="text-sm text-guro-blue hover:underline"
        >
          Back to login
        </button>
      </div>
    </form>
  );
};
