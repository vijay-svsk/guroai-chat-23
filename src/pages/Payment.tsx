
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Immediately redirect to Stripe
    window.location.href = 'https://buy.stripe.com/bIY29h7YR1n63JK4gs';
  }, []); // Empty dependency array ensures this runs once on mount

  // This content will only be shown briefly before redirect
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-guro-blue mb-4">
          Redirecting to payment...
        </h2>
        <p className="text-gray-600">
          Please wait while we redirect you to our secure payment page.
        </p>
      </Card>
    </div>
  );
};

export default Payment;
