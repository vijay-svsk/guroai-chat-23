
import React from "react";
import { cn } from "@/lib/utils";
import { GURO_AVATAR_URL } from "@/lib/utils";

interface GuroAvatarProps {
  className?: string;
}

export function GuroAvatar({ className }: GuroAvatarProps) {
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
