import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Plus, BarChart } from "lucide-react";
import { usePuppy } from "@/context/PuppyContext";
import PuppyDiary from "./PuppyDiary";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { puppies } = usePuppy();
  const [selectedPuppyId, setSelectedPuppyId] = useState<string | null>(null);
  
  const isActive = (path: string) => {
    return location.pathname === path ? "bg-puppy-purple/20 text-puppy-purple font-medium" : "hover:bg-gray-100";
  };

  return (
    <>
      <aside className="w-64 border-r bg-sidebar fixed h-full">
        <div className="p-5">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐶</span>
            <h1 className="text-xl font-bold">Puppy Tracker</h1>
          </div>
        </div>

        <nav className="mt-6">
          <ul>
            <li>
              <Link 
                to="/" 
                className={`flex items-center px-5 py-3 space-x-3 ${isActive('/')}`}
              >
                <Plus size={20} />
                <span>Neuer Eintrag</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/calendar" 
                className={`flex items-center px-5 py-3 space-x-3 ${isActive('/calendar')}`}
              >
                <Calendar size={20} />
                <span>Kalender</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/statistics" 
                className={`flex items-center px-5 py-3 space-x-3 ${isActive('/statistics')}`}
              >
                <BarChart size={20} />
                <span>Statistiken</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Welpen</h2>
            <ul className="space-y-1">
              {puppies.map((puppy) => (
                <li key={puppy.id} className="flex items-center space-x-2 py-1">
                  <button
                    onClick={() => setSelectedPuppyId(puppy.id)}
                    className="flex items-center space-x-2 w-full hover:bg-gray-100 p-2 rounded"
                  >
                    <div className="w-8 h-8 bg-puppy-purple rounded-full flex items-center justify-center text-white">
                      {puppy.name[0]}
                    </div>
                    <span>{puppy.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button className="w-full flex items-center space-x-2 py-1 text-gray-500 hover:text-gray-700">
                  <Plus size={16} />
                  <span>Neuen Welpen</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <PuppyDiary
        puppyId={selectedPuppyId}
        isOpen={selectedPuppyId !== null}
        onClose={() => setSelectedPuppyId(null)}
      />
    </>
  );
};

export default Sidebar;
