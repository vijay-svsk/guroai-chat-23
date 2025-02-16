
import { useState, useEffect } from "react";
import { BookOpen, CheckCircle, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Logo Animation */}
      <div className={`fixed inset-0 flex items-center justify-center bg-white transition-opacity duration-1000 ${showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <h1 className="text-guro-blue text-6xl font-bold animate-scale-in">
          GuroAI
        </h1>
      </div>

      {/* Main Content */}
      <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero Section */}
        <section className="relative h-screen flex flex-col items-center justify-center space-y-8 px-4">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-20 w-64 h-64 bg-guro-green/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-20 w-64 h-64 bg-guro-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-guro-blue text-center animate-fade-in">
            Teaching Made Easy with AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 text-center max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Generate personalized lesson plans in seconds with our AI-powered platform
          </p>
          <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button className="bg-guro-blue hover:bg-guro-blue/90 text-white px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-105">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-guro-blue text-guro-blue hover:bg-guro-blue/5 px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-105">
              Learn More
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-guro-blue text-center mb-12">
              Why Choose GuroAI?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<BookOpen className="w-12 h-12 text-guro-blue" />}
                title="Smart Lesson Planning"
                description="AI-powered system that creates custom lesson plans based on your needs"
              />
              <FeatureCard 
                icon={<PenTool className="w-12 h-12 text-guro-blue" />}
                title="Customizable Templates"
                description="Easily modify and adapt lesson plans to fit your teaching style"
              />
              <FeatureCard 
                icon={<CheckCircle className="w-12 h-12 text-guro-blue" />}
                title="Time-Saving Solution"
                description="Create comprehensive lesson plans in minutes, not hours"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-guro-blue mb-12">
              Simple, Transparent Pricing
            </h2>
            <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-4">
                <div className="text-guro-green font-semibold text-xl">
                  Try GuroAI Free for 7 Days
                </div>
                <div className="text-4xl font-bold text-guro-blue">
                  $4.99<span className="text-xl text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 text-gray-600 mt-6">
                  <li>✓ Unlimited Lesson Plans</li>
                  <li>✓ All Subject Areas</li>
                  <li>✓ Customizable Templates</li>
                  <li>✓ Priority Support</li>
                </ul>
                <Button className="w-full bg-guro-blue hover:bg-guro-blue/90 text-white py-6 rounded-lg text-lg transition-all duration-300 hover:scale-105 mt-6">
                  Start Your Free Trial
                </Button>
                <p className="text-sm text-gray-500">No credit card required</p>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-guro-blue mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Card>
);

export default Index;
