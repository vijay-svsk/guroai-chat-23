
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-center bg-[#0a1d2c] py-8">
        <img 
          src="/lovable-uploads/6156f2f7-e911-43ea-be05-99f13995bd26.png" 
          alt="GuroAI Logo" 
          className="h-24 w-auto"
          loading="eager"
        />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Subscription Required
            </h2>
            <p className="mt-2 text-gray-600">
              Your trial period has ended or payment was declined. To continue using GuroAI and access your saved lesson plans, please update your payment information.
            </p>
          </div>
          <div className="mt-8">
            <Button
              onClick={() => navigate("/payment")}
              className="w-full bg-guro-blue hover:bg-guro-blue/90 text-white py-6 text-lg"
            >
              Update Payment Method
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="w-full mt-4"
            >
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
