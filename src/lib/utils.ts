
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const GURO_AVATAR_URL = "/lovable-uploads/641de1f1-9eb3-4d5f-a22f-4a35daa7f0a4.png";

export function GuroAvatar({ className }: { className?: string }) {
  return (
    <div className={cn("flex-shrink-0", className)}>
      <img 
        src={GURO_AVATAR_URL}
        alt="GuroAI"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
