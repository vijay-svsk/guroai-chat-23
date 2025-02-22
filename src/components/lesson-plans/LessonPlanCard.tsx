
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { formatDate } from "@/utils/date-utils";
import { LessonPlan } from "@/types/lesson-plan";

interface LessonPlanCardProps {
  plan: LessonPlan;
  onView: (plan: LessonPlan) => void;
}

export const LessonPlanCard = ({ plan, onView }: LessonPlanCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg text-gray-900">{plan.subject}</h3>
          </div>
          <span className="text-xs text-gray-500 mt-1">{formatDate(plan.created_at)}</span>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">Topic: {plan.topic}</p>
          <p className="text-sm text-gray-600">Method: {plan.method.toUpperCase()}</p>
          {plan.grade_level && (
            <p className="text-sm text-gray-600">Grade Level: {plan.grade_level}</p>
          )}
          {plan.language && (
            <p className="text-sm text-gray-600">Language: {plan.language}</p>
          )}
        </div>
        <Button
          className="w-full mt-4"
          onClick={() => onView(plan)}
        >
          View Lesson Plan
        </Button>
      </CardContent>
    </Card>
  );
};
