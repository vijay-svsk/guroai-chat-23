
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  console.log("Privacy Policy component rendering");
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
          <p className="mb-8 text-gray-700 leading-relaxed">
            At GuroAI, we are committed to protecting your privacy and ensuring the security of your personal information. We collect and process various types of data to provide you with our AI-powered lesson planning services, including but not limited to your name, email address, school information, and teaching preferences. This information is essential for personalizing your experience and delivering tailored lesson plans that meet your specific needs. We implement industry-standard security measures to protect your data from unauthorized access, maintain data accuracy, and ensure the appropriate use of information. Your data is stored on secure servers, and we regularly update our security protocols to adapt to emerging threats and technological advances.
          </p>

          <p className="mb-8 text-gray-700 leading-relaxed">
            We understand the importance of transparency in data handling practices. Your personal information is never sold to third parties, and we only share your data with trusted service providers who assist us in operating our website, conducting our business, or serving you, subject to strict confidentiality agreements. These service providers are obligated to use your information solely for the purpose of providing the services we've requested. You have complete control over your personal information - you can access, update, or request the deletion of your data at any time through your account settings or by contacting our support team. We may occasionally send you important updates about our services, administrative emails, and newsletters, from which you can opt out at any time. By using GuroAI, you consent to the collection and use of your information as described in this Privacy Policy.
          </p>

          <h2 className="text-xl font-semibold mb-4">Additional Privacy Information</h2>
          
          <h3 className="text-lg font-semibold mb-3">1. Information Collection</h3>
          <p className="mb-4">
            We collect information that you provide directly to us, including personal information such as your name, email address, and school information.
          </p>

          <h3 className="text-lg font-semibold mb-3">2. Use of Information</h3>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services, to process your subscriptions, and to communicate with you.
          </p>

          <h3 className="text-lg font-semibold mb-3">3. Information Sharing</h3>
          <p className="mb-4">
            We do not share your personal information with third parties except as described in this privacy policy or with your consent.
          </p>

          <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.
          </p>

          <h3 className="text-lg font-semibold mb-3">5. Your Rights</h3>
          <p className="mb-4">
            You have the right to access, correct, or delete your personal information. Contact us if you wish to exercise these rights.
          </p>

          <h3 className="text-lg font-semibold mb-3">6. Policy Updates</h3>
          <p className="mb-4">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
