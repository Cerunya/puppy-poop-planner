
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface DailyStatsProps {
  peeCount: number;
  poopCount: number;
}

export const DailyStats = ({ peeCount, poopCount }: DailyStatsProps) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-3">Heute</h2>
        <div className="flex justify-around">
          <div className="text-center">
            <span className="text-3xl">💧</span>
            <p className="text-2xl font-bold mt-2">{peeCount}</p>
            <p className="text-sm text-muted-foreground">Urin</p>
          </div>
          
          <div className="text-center">
            <span className="text-3xl">💩</span>
            <p className="text-2xl font-bold mt-2">{poopCount}</p>
            <p className="text-sm text-muted-foreground">Kot</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
