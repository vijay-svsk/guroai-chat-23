
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check, Star } from "lucide-react";

interface PricingSectionProps {
  onStartTrial: () => void;
}

export const PricingSection = ({ onStartTrial }: PricingSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-guro-blue mb-4">
          Affordable Professional Solution
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Access all features for a single low monthly price - no hidden fees, no complicated tiers
        </p>
        
        <Card className="p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-[#e0e9ed] hover:border-[#8cd09b] relative overflow-hidden">
          <div className="absolute -right-12 top-8 bg-[#8cd09b] text-guro-blue font-bold py-1 px-10 transform rotate-45">
            Best Value
          </div>
          
          <div className="space-y-4">
            <div className="text-guro-green font-semibold text-xl">
              Complete Teaching Toolkit
            </div>
            <div className="text-4xl font-bold text-guro-blue">
              ₱299<span className="text-xl text-gray-500">/month</span>
            </div>
            <p className="text-gray-600 max-w-lg mx-auto">
              Everything you need to streamline your teaching preparation and deliver outstanding lessons
            </p>
            
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl mx-auto mt-8 text-left">
              <div className="col-span-2 mb-2">
                <h4 className="font-semibold text-guro-blue text-lg flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  All Features Included
                </h4>
              </div>
              
              {[
                "Unlimited Lesson Plans (7Es & 4As)",
                "PowerPoint Presentations",
                "Quiz Generation with Answer Keys",
                "PMES Annotation Generator",
                "Customizable Templates",
                "Cross-Curriculum Integration",
                "Differentiated Instruction",
                "HOTs Integration",
                "Unlimited Downloads",
                "Mobile & Desktop Access",
                "Ask GuroAI Assistant",
                "Priority Support"
              ].map((feature, i) => (
                <div key={i} className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-guro-green flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={onStartTrial}
              className="group relative overflow-hidden w-full md:w-2/3 mx-auto bg-guro-blue hover:bg-guro-blue/90 text-white py-6 rounded-lg text-lg transition-all duration-300 hover:shadow-lg mt-8"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="flex items-center justify-center">
                Subscribe Now - Start Creating in Minutes
                <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </span>
              <span className={`absolute bottom-0 left-0 h-1 bg-[#8cd09b] transition-all duration-300 ${isHovered ? 'w-full' : 'w-0'}`}></span>
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              30-day satisfaction guarantee. Cancel anytime.
            </p>
          </div>
        </Card>
        
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg text-guro-blue mb-3">Did You Know?</h3>
          <p className="text-gray-600">
            Teachers using GuroAI save an average of 15 hours per month on lesson planning and material preparation. 
            At ₱299/month, that's less than ₱20 per hour saved!
          </p>
        </div>
      </div>
    </section>
  );
};
