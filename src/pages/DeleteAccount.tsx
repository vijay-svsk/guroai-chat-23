
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDeleteRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to delete your account",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Send delete account request
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      // Sign out the user after deletion
      await supabase.auth.signOut();
      
      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted. Your data will be permanently deleted within 30 days.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="container mx-auto max-w-3xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Delete Your GuroAI Account</h1>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Before You Delete Your Account</h2>
              <p className="text-gray-600 mb-4">
                Please note that deleting your account will:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Permanently remove all your lesson plans and teaching preferences</li>
                <li>Cancel any active subscriptions</li>
                <li>Delete your profile information</li>
                <li>Remove access to all GuroAI services</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Data Retention</h2>
              <p className="text-gray-600">
                When you request account deletion:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                <li>Your account and personal data will be permanently deleted within 30 days</li>
                <li>Anonymized usage statistics may be retained for analytical purposes</li>
                <li>Any data required by law will be retained for the minimum required period</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Alternative Options</h2>
              <p className="text-gray-600 mb-4">
                If you're experiencing issues with GuroAI, consider these alternatives before deleting your account:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Contact our support team at support@guroai.com</li>
                <li>Update your notification preferences in account settings</li>
                <li>Temporarily pause your subscription</li>
              </ul>
            </div>

            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Delete Account</h2>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <Button 
                variant="destructive"
                onClick={handleDeleteRequest}
                className="w-full sm:w-auto"
              >
                Request Account Deletion
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeleteAccount;
