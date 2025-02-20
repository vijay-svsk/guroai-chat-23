
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthHandler } from "@/hooks/use-auth-handler";
import ReactConfetti from "react-confetti";

const SignUpNewAccount = () => {
  const {
    email,
    password,
    confirmPassword,
    loading,
    showConfetti,
    setEmail,
    setPassword,
    setConfirmPassword,
    setShowConfetti,
    handleAuth,
  } = useAuthHandler();

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
            <CardTitle>Create New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <AuthForm
              isLogin={false}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              loading={loading}
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
              onSubmit={handleAuth}
              onToggleMode={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpNewAccount;
