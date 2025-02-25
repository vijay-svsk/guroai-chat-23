
import { cn } from "@/lib/utils";

export const LoadingState = () => {
  return (
    <div className="flex items-center justify-start space-x-2 pl-4">
      <div className="flex space-x-1">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "animate-pulse h-2 w-2 rounded-full bg-[#023d54]/40",
              {
                "animation-delay-200": i === 1,
                "animation-delay-400": i === 2,
                "animation-delay-600": i === 3,
              }
            )}
          />
        ))}
      </div>
    </div>
  );
};
