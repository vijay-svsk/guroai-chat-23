
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Payment Failed
          </h2>
          <p className="mt-2 text-gray-600">
            We were unable to process your payment. Please try again later.
          </p>
        </div>
        <div className="mt-8">
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-guro-blue hover:bg-guro-blue/90 text-white py-6 text-lg"
          >
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
