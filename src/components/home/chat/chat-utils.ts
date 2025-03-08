
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

// Verify payment reference number in Supabase
export const verifyPaymentReference = async (refNumber: string): Promise<boolean> => {
  if (refNumber && refNumber.length >= 5) {
    try {
      // Check if this is a valid payment reference
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('stripe_subscription_id', refNumber)
        .maybeSingle();
        
      if (data) {
        return true;
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  }
  return false;
};

// Get special responses based on user message content
export const getSpecialResponse = async (userMessage: string): Promise<string | null> => {
  const paidUserResponse = await handlePaidUserClaim(userMessage);
  const featuresInquiryResponse = handleFeaturesInquiry(userMessage);
  
  return paidUserResponse || featuresInquiryResponse;
};

// Check if message contains payment reference claim
export const handlePaidUserClaim = async (userMessage: string): Promise<string | null> => {
  // Check if user is claiming they've paid
  const paidClaim = /paid|subscribed|payment|reference number|ref number|subscription/i.test(userMessage.toLowerCase());
  
  if (paidClaim) {
    // First, check if they're just saying they paid without providing a reference
    if (!userMessage.match(/([A-Za-z0-9_-]{5,})/)) {
      return `I see you're mentioning a payment. Could you please share your payment reference number so I can verify your account? 😊 This helps me provide you with the right access to your GuroAI subscription.`;
    }
    
    // If they included what looks like a reference number
    const refNumberMatch = userMessage.match(/([A-Za-z0-9_-]{5,})/);
    
    if (refNumberMatch) {
      const refNumber = refNumberMatch[0];
      const isValid = await verifyPaymentReference(refNumber);
      
      if (isValid) {
        return `Great news! I've verified your payment with reference number "${refNumber}". ✅ 

You can now access your full account at: https://guroai.lovable.app/auth

Please log in with the email you used during registration. If you have any issues accessing your account, feel free to contact our support team at guroai.online@gmail.com.`;
      } else {
        return `I couldn't verify the payment reference "${refNumber}" in our system. 🤔

Could you please double-check and provide your complete payment reference number? If you continue to have issues, our support team is ready to help at guroai.online@gmail.com.`;
      }
    }
  }
  
  return null;
};

// Check if message is about upcoming features
export const handleFeaturesInquiry = (userMessage: string): string | null => {
  const featuresKeywords = /features|coming soon|new tools|interactive|games|upcoming|what's new/i.test(userMessage.toLowerCase());
  
  if (featuresKeywords) {
    return `I'm excited to tell you about our upcoming features at GuroAI! 🎮✨

📱 **Create Interactive Games**:
✅ Teachers can create engaging games like matching, quizzes, and spin-the-wheel activities
✅ Fully customizable to adapt to your specific lesson content
✅ Designed to increase student engagement and participation

🚀 **And Many More Features Coming Soon!**
✅ GuroAI is constantly evolving with new tools to simplify your teaching tasks
✅ All new features will be included in your regular subscription of ₱299/month

Would you like to know more about our subscription plans or have questions about any specific feature? I'm here to help! 😊`;
  }
  
  return null;
};

// Initial welcome message
export const getWelcomeMessage = (): ChatMessage => {
  return {
    role: 'assistant',
    content: `Hello! I'm GuroAI's assistant. How can I help you today? 😊

Need assistance with:
• Creating lesson plans with GuroAI
• Subscription information
• Payment verification
• Our newest upcoming features`
  };
};
