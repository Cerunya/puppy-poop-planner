
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TimeframeOption = "7days" | "30days" | "90days" | "custom";

interface TimeframeSelectorProps {
  timeframe: TimeframeOption;
  setTimeframe: (timeframe: TimeframeOption) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
}

export const TimeframeSelector = ({
  timeframe,
  setTimeframe,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}: TimeframeSelectorProps) => {
  return (
    <div className="mb-6">
      <Tabs defaultValue="7days" onValueChange={(v) => setTimeframe(v as TimeframeOption)}>
        <TabsList className="mb-4">
          <TabsTrigger value="7days">7 Tage</TabsTrigger>
          <TabsTrigger value="30days">30 Tage</TabsTrigger>
          <TabsTrigger value="90days">90 Tage</TabsTrigger>
          <TabsTrigger value="custom">Benutzerdefiniert</TabsTrigger>
        </TabsList>
        
        {timeframe === "custom" && (
          <div className="flex gap-4 mt-4">
            <div>
              <Label htmlFor="startDate">Von</Label>
              <Input
                id="startDate"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Bis</Label>
              <Input
                id="endDate"
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
};
