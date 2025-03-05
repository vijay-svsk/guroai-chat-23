
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReviewFilterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const ReviewFilterTabs = ({ activeTab, onTabChange }: ReviewFilterTabsProps) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="mb-12">
      <TabsList className="mx-auto flex flex-wrap justify-center">
        <TabsTrigger value="all" className="px-3 py-2 text-sm">All Reviews</TabsTrigger>
        <TabsTrigger value="filipino" className="px-3 py-2 text-sm">Filipino Teachers</TabsTrigger>
        <TabsTrigger value="international" className="px-3 py-2 text-sm">International</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
