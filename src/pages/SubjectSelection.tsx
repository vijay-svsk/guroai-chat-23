
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReactConfetti from "react-confetti";
import { GraduationCap, BookOpen, Languages, BookType, Award } from "lucide-react";

const SubjectSelection = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: "",
    gradeLevel: "",
    topic: "",
    language: "",
  });

  // Show success toast on mount
  useState(() => {
    toast({
      title: "Account Created Successfully! 🎉",
      description: "Welcome to GuroAI! Let's set up your preferences.",
      duration: 5000,
    });
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMethodSelect = (method: "7es" | "4as") => {
    // Handle the selection of teaching method
    toast({
      title: "Teaching Method Selected",
      description: `You've selected the ${method.toUpperCase()} method`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {showConfetti && (
        <ReactConfetti
          recycle={false}
          numberOfPieces={200}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-guro-blue mb-4">
            Let's Personalize Your Experience
          </h1>
          <p className="text-xl text-gray-600">
            Help us understand your teaching needs
          </p>
        </div>

        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-guro-blue">
              Teaching Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <BookOpen className="text-guro-blue w-6 h-6" />
                <Input
                  name="subject"
                  placeholder="Subject (e.g., Mathematics, Science)"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center space-x-4">
                <GraduationCap className="text-guro-blue w-6 h-6" />
                <Input
                  name="gradeLevel"
                  placeholder="Grade Level (e.g., Grade 7, High School)"
                  value={formData.gradeLevel}
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center space-x-4">
                <BookType className="text-guro-blue w-6 h-6" />
                <Input
                  name="topic"
                  placeholder="Topic (e.g., Algebra, Chemical Bonds)"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Languages className="text-guro-blue w-6 h-6" />
                <Input
                  name="language"
                  placeholder="Language Used (e.g., English, Filipino)"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="pt-6">
              <h3 className="text-lg font-medium text-guro-blue mb-4">
                Select Your Teaching Method
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleMethodSelect("7es")}
                  className="h-auto p-6 bg-guro-blue hover:bg-guro-blue/90 flex flex-col items-center space-y-2"
                >
                  <Award className="w-8 h-8" />
                  <span className="text-lg font-semibold">7Es Method</span>
                  <span className="text-sm opacity-90">
                    Elicit, Engage, Explore, Explain, Elaborate, Evaluate, Extend
                  </span>
                </Button>

                <Button
                  onClick={() => handleMethodSelect("4as")}
                  variant="secondary"
                  className="h-auto p-6 flex flex-col items-center space-y-2"
                >
                  <Award className="w-8 h-8" />
                  <span className="text-lg font-semibold">4As Method</span>
                  <span className="text-sm opacity-90">
                    Activity, Analysis, Abstraction, Application
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubjectSelection;
