
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type LessonPlan = Database['public']['Tables']['lesson_plans']['Row'];

interface PreviousLessonPlansProps {
  lessonPlans: LessonPlan[];
  onViewPlan: (plan: LessonPlan) => void;
}

export const PreviousLessonPlans = ({ lessonPlans, onViewPlan }: PreviousLessonPlansProps) => {
  if (lessonPlans.length === 0) return null;

  return (
    <Card className="bg-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-guro-blue flex items-center gap-2">
          <History className="w-6 h-6" />
          Previous Lesson Plans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessonPlans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onViewPlan(plan)}
            >
              <div>
                <h3 className="font-medium">{plan.subject}: {plan.topic}</h3>
                <p className="text-sm text-gray-500">
                  Created on {new Date(plan.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                View Plan
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
