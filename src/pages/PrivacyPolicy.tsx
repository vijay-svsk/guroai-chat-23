
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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
        
        <h1 className="text-3xl font-bold text-guro-blue mb-8">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information that you provide directly to us, including personal information such as your name, email address, and school information.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services, to process your subscriptions, and to communicate with you.
          </p>

          <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
          <p className="mb-4">
            We do not share your personal information with third parties except as described in this privacy policy or with your consent.
          </p>

          <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.
          </p>

          <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
          <p className="mb-4">
            You have the right to access, correct, or delete your personal information. Contact us if you wish to exercise these rights.
          </p>

          <h2 className="text-xl font-semibold mb-4">6. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
