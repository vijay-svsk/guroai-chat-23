
export interface LessonPlan {
  id: string;
  created_at: string;
  subject: string;
  topic: string;
  method: string;
  grade_level: string | null;
  language: string | null;
  content: string;
}
