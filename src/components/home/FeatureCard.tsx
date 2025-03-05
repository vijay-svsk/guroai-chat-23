
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-t-2 border-t-guro-blue">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-guro-blue mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Card>
);
