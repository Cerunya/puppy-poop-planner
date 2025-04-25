
import React from "react";
import { usePuppy } from "@/context/PuppyContext";

interface StatisticsHeaderProps {
  selectedPuppyId: string | null;
  setSelectedPuppyId: (id: string | null) => void;
}

export const StatisticsHeader = ({ 
  selectedPuppyId, 
  setSelectedPuppyId 
}: StatisticsHeaderProps) => {
  const { puppies } = usePuppy();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Statistiken</h1>
      
      <div className="flex space-x-2">
        <select 
          className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700" 
          value={selectedPuppyId || ""}
          onChange={(e) => setSelectedPuppyId(e.target.value || null)}
        >
          <option value="">Alle Welpen</option>
          {puppies.map((puppy) => (
            <option key={puppy.id} value={puppy.id}>
              {puppy.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
