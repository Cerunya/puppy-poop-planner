
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AveragesCardProps {
  peePerDay: string;
  poopPerDay: string;
}

export const AveragesCard = ({ peePerDay, poopPerDay }: AveragesCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Durchschnitt pro Tag</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around">
          <div className="text-center">
            <span className="text-3xl">💧</span>
            <p className="text-2xl font-bold mt-2">{peePerDay}</p>
            <p className="text-sm text-gray-500">Urin</p>
          </div>
          
          <div className="text-center">
            <span className="text-3xl">💩</span>
            <p className="text-2xl font-bold mt-2">{poopPerDay}</p>
            <p className="text-sm text-gray-500">Kot</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
