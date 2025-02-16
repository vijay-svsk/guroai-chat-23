import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
const Dashboard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match"
      });
      return;
    }
    try {
      setIsLoading(true);
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
      if (data.user) {
        toast({
          title: "Success!",
          description: "Your account has been created successfully. You can now start using GuroAI!"
        });
        // No need to navigate since we're already on dashboard
        // Just refresh the page to show the dashboard content
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a1d2c]">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <img src="/lovable-uploads/24e7e402-845e-4126-b717-af2167b4ef23.png" alt="GuroAI Logo" className="h-24 w-24 mb-4 rounded-md" />
            <h1 className="text-3xl font-bold text-white">Welcome to GuroAI!</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md mx-auto p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Create Your Account</h2>
            <p className="mt-2 text-gray-600">Set up your account to start using GuroAI</p>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full" placeholder="Enter your email" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full" placeholder="Create a password" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full" placeholder="Confirm your password" />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-guro-blue hover:bg-guro-blue/90">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Card>
      </main>
    </div>;
};
export default Dashboard;