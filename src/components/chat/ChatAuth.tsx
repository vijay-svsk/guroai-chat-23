
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, CreditCard } from "lucide-react";

interface ChatAuthProps {
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onRegister: (email: string, password: string) => Promise<boolean>;
}

export const ChatAuth = ({ onSignIn, onRegister }: ChatAuthProps) => {
  const [activeTab, setActiveTab] = useState<string>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await onSignIn(email, password);
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    
    try {
      // This will redirect to payment page
      await onRegister(email, password);
    } catch (err) {
      setError("Failed to redirect to payment page. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeClick = () => {
    // Directly redirect to Xendit payment page
    window.location.href = 'https://checkout.xendit.co/od/guroai.online';
  };

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <Card className="shadow-lg border-[#023d54]/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#023d54]">
            GuroAI Chat
          </CardTitle>
          <CardDescription className="text-[#023d54]/70 text-base">
            Sign in or subscribe to start chatting with GuroAI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="register">Subscribe</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="text-sm text-red-500 font-medium">{error}</div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#023d54] hover:bg-[#023d54]/90" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-[#023d54] mb-2">Subscribe to GuroAI Chat</h3>
                  <p className="text-sm text-gray-600">
                    Get instant access to GuroAI Chat for just ₱299/month. Your subscription includes:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      <span>Unlimited AI-powered conversations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      <span>Teaching advice and lesson plan assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      <span>24/7 access to GuroAI</span>
                    </li>
                  </ul>
                </div>
                
                <Button 
                  onClick={handleSubscribeClick}
                  className="w-full bg-[#023d54] hover:bg-[#023d54]/90" 
                  disabled={loading}
                >
                  {loading ? "Redirecting..." : "Subscribe Now - ₱299/month"}
                  <CreditCard className="ml-2 h-4 w-4" />
                </Button>
                
                {error && (
                  <div className="text-sm text-red-500 font-medium">{error}</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
