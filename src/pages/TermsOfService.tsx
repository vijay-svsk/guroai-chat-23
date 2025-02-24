
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
        
        <h1 className="text-3xl font-bold text-guro-blue mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using GuroAI's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            GuroAI provides AI-powered lesson planning tools and resources for educators. Our services are subject to change and may be modified at any time.
          </p>

          <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
          <p className="mb-4">
            Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
          </p>

          <h2 className="text-xl font-semibold mb-4">4. Subscription and Payments</h2>
          <p className="mb-4">
            Our service requires a monthly subscription. Users agree to pay all fees associated with their subscription plan.
          </p>

          <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
          <p className="mb-4">
            All content and materials available through GuroAI are protected by intellectual property rights and remain the property of GuroAI or its licensors.
          </p>

          <h2 className="text-xl font-semibold mb-4">6. Privacy</h2>
          <p className="mb-4">
            Your use of GuroAI is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
