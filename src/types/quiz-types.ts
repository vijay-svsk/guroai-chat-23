
export type ExamType = 
  | "identification" 
  | "multiple-choice" 
  | "true-false" 
  | "matching-type" 
  | "fill-in-the-blanks";

export interface QuizFormData {
  gradeLevel: string;
  subject: string;
  topic: string;
  instructions?: string;
  numberOfItems: number;
  examType: ExamType;
}

export interface CognitiveDomain {
  level: string;
  numberOfItems: number;
  percentage: number;
}

export interface TableOfSpecification {
  domains: CognitiveDomain[];
  totalItems: number;
}

export interface QuizQuestion {
  question: string;
  answer?: string;
  options?: string[];
}

export interface Quiz {
  instructions: string;
  questions: QuizQuestion[];
}

export interface SavedQuiz {
  id: string;
  user_id: string;
  grade_level: string;
  subject: string;
  topic: string;
  exam_type: ExamType;
  quiz_data: string;
  tos_data: string | null;
  created_at: string;
}
