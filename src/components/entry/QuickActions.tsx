
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface QuickActionsProps {
  onQuickAdd: (type: "pee" | "poop" | "both") => void;
}

export const QuickActions = ({ onQuickAdd }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <Card className="bg-puppy-blue border-0">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <button 
            onClick={() => onQuickAdd("pee")}
            className="text-5xl event-button hover:scale-110 transition-transform"
            aria-label="Jetzt hat er gepullert"
            type="button"
          >
            💧
          </button>
          <span className="mt-2 font-medium">Schnell: Urin</span>
        </CardContent>
      </Card>
      
      <Card className="bg-puppy-brown border-0">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <button 
            onClick={() => onQuickAdd("poop")}
            className="text-5xl event-button hover:scale-110 transition-transform"
            aria-label="Jetzt hat er gekackt"
            type="button"
          >
            💩
          </button>
          <span className="mt-2 font-medium">Schnell: Kot</span>
        </CardContent>
      </Card>
      
      <Card className="bg-puppy-peach border-0">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <button 
            onClick={() => onQuickAdd("both")}
            className="text-5xl event-button hover:scale-110 transition-transform"
            aria-label="Jetzt hat er beides gemacht"
            type="button"
          >
            💧💩
          </button>
          <span className="mt-2 font-medium">Schnell: Beides</span>
        </CardContent>
      </Card>
    </div>
  );
};
