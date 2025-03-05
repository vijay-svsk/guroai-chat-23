
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";

interface PricingSectionProps {
  onStartTrial: () => void;
}

export const PricingSection = ({ onStartTrial }: PricingSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-guro-blue mb-12">
          Simple, Transparent Pricing
        </h2>
        <Card className="p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-[#e0e9ed] hover:border-[#8cd09b]">
          <div className="space-y-4">
            <div className="text-guro-green font-semibold text-xl">
              Get Started with GuroAI
            </div>
            <div className="text-4xl font-bold text-guro-blue">
              ₱299<span className="text-xl text-gray-500">/month</span>
            </div>
            <ul className="space-y-3 text-gray-600 mt-6">
              {["Unlimited Lesson Plans", "All Subject Areas", "Customizable Templates", "Priority Support"].map((feature, i) => (
                <li key={i} className="flex items-center justify-center">
                  <span className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-guro-green" />
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              onClick={onStartTrial}
              className="group relative overflow-hidden w-full bg-guro-blue hover:bg-guro-blue/90 text-white py-6 rounded-lg text-lg transition-all duration-300 hover:shadow-lg mt-6"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="flex items-center justify-center">
                Subscribe Now
                <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </span>
              <span className={`absolute bottom-0 left-0 h-1 bg-[#8cd09b] transition-all duration-300 ${isHovered ? 'w-full' : 'w-0'}`}></span>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};
