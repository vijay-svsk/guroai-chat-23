
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PricingSectionProps {
  onStartTrial: () => void;
}

export const PricingSection = ({ onStartTrial }: PricingSectionProps) => (
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

          <Button
            onClick={onStartTrial}
            className="w-full bg-guro-blue hover:bg-guro-blue/90 text-white py-6 rounded-lg text-lg transition-all duration-300 hover:scale-105 mt-6"
          >
            Start Your Free Trial
          </Button>
          <p className="text-sm text-center text-gray-500">No credit card required</p>
        </div>
      </Card>
    </div>
  </section>
);
