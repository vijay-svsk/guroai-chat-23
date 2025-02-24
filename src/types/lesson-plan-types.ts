
export interface FormData {
  subject: string;
  gradeLevel: string;
  topic: string;
  language: string;
  method: "7es" | "4as";
  previousTopic?: string;
}

export interface GeneratedContent {
  reviewImage: string;
  motivationImage: string;
  content: {
    reviewQuestions: string[];
    hotsQuestions: string[];
    integration: {
      connectedSubject: string;
      discussion: string[];
    };
  };
}
