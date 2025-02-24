
export interface FormData {
  subject: string;
  gradeLevel: string;
  topic: string;
  language: string;
  method: "7es" | "4as";
}

export interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}
