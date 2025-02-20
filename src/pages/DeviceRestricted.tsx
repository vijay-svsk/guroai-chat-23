
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const DeviceRestricted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Ban className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-500">
            Device Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              For security reasons, your GuroAI account can only be accessed from one device.
            </p>
            <p className="text-gray-600">
              You are currently trying to access your account from a different device than the one originally registered.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">What does this mean?</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Each GuroAI account is limited to one device</li>
                <li>• This helps protect your account and data</li>
                <li>• You'll need to use your registered device to access your account</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate('/auth')}
                variant="outline"
                className="w-full"
              >
                Try Different Account
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-guro-blue hover:bg-guro-blue/90"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceRestricted;
