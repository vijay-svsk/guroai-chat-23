
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-guro-blue mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Card>
);
