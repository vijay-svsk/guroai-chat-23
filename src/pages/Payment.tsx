
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Payment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscription = async () => {
    try {
      setIsLoading(true);
      // Redirect to Stripe subscription link
      window.location.href = 'https://buy.stripe.com/bIY29h7YR1n63JK4gs';
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-guro-blue mb-4">
            Start Your Free Trial
          </h1>
          <p className="text-xl text-gray-600">
            Try GuroAI free for 7 days, then just $4.99/month
          </p>
        </div>

        <Card className="p-8 bg-white shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b">
              <div>
                <h2 className="text-2xl font-semibold text-guro-blue">
                  7-Day Free Trial
                </h2>
                <p className="text-gray-600 mt-1">
                  Full access to all features
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-guro-blue">
                  $0
                </div>
                <div className="text-sm text-gray-500">
                  then $4.99/month
                </div>
              </div>
            </div>

            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-guro-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Unlimited AI-powered lesson plans
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-guro-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                All subject areas covered
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-guro-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Customizable templates
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-guro-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Priority support included
              </li>
            </ul>

            <div className="space-y-4 pt-6">
              <Button
                onClick={handleSubscription}
                disabled={isLoading}
                className="w-full bg-guro-blue hover:bg-guro-blue/90 text-white py-6 text-lg"
              >
                {isLoading ? "Processing..." : "Start Free Trial"}
              </Button>
              <p className="text-sm text-center text-gray-500">
                Cancel anytime during your trial. No obligation.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center space-y-4">
          <div className="flex justify-center space-x-8">
            <img alt="Visa" className="h-8" src="/lovable-uploads/afda616f-d25e-42ac-ac77-a8d7d67c6750.png" />
            <img alt="Mastercard" className="h-8" src="/lovable-uploads/4d8f87fa-3f3d-4a33-8914-c2a1d7ff8cc2.png" />
            <img alt="PayPal" className="h-8" src="/lovable-uploads/347eba73-8f1f-4c36-83c9-4d70ce224517.png" />
          </div>
          <p className="text-sm text-gray-500">
            Secure payment processing by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
