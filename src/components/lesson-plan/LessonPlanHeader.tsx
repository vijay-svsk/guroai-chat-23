
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Edit, Download } from "lucide-react";

interface LessonPlanHeaderProps {
  isLoading: boolean;
  onRegenerate: () => void;
  onEdit: () => void;
  onDownload: () => void;
}

export const LessonPlanHeader = ({
  isLoading,
  onRegenerate,
  onEdit,
  onDownload,
}: LessonPlanHeaderProps) => {
  return (
    <CardHeader className="space-y-2">
      <CardTitle className="flex justify-between items-start">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/455a23fe-17a6-4eba-92d1-fc732a28b3e7.png"
              alt="GuroAI Logo"
              className="h-12 w-auto"
              loading="eager"
            />
            <span className="text-[#0a1d2c] text-2xl font-bold">GuroAI</span>
          </div>
          <p className="text-sm text-[#0a1d2c] mt-1 font-normal">
            Empowering educators, simplifying teaching—GuroAI, your partner in
            effortless lesson planning.
          </p>
        </div>
        <div className="flex gap-2">
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={onRegenerate}
                disabled={isLoading}
                className="h-10 w-10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onEdit}
                disabled={isLoading}
                className="h-10 w-10"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onDownload}
                disabled={isLoading}
                className="h-10 w-10"
              >
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardTitle>
    </CardHeader>
  );
};
