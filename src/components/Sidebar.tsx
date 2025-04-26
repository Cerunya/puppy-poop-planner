
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Plus, BarChart, LogOut } from "lucide-react";
import { usePuppy } from "@/context/PuppyContext";
import { ThemeToggle } from "./ThemeToggle";
import PuppyDiary from "./PuppyDiary";
import NewPuppyDialog from "./NewPuppyDialog";
import EditPuppyDialog from "./EditPuppyDialog";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { puppies } = usePuppy();
  const [selectedPuppyId, setSelectedPuppyId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "bg-puppy-purple/20 text-puppy-purple font-medium" : "hover:bg-gray-100 dark:hover:bg-gray-800";
  };

  const handleLogout = () => {
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
    });
    navigate("/");
  };

  return (
    <>
      <aside className="w-64 border-r bg-sidebar fixed h-full dark:bg-gray-900 dark:border-gray-800">
        <div className="p-5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐶</span>
            <h1 className="text-xl font-bold">Puppy Tracker</h1>
          </div>
          <ThemeToggle />
        </div>

        <nav className="mt-6">
          <ul>
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center px-5 py-3 space-x-3 ${isActive('/dashboard')}`}
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
          <div className="border-t pt-4 space-y-4">
            <h2 className="font-semibold mb-2">Welpen</h2>
            <ul className="space-y-1">
              {puppies.map((puppy) => (
                <li key={puppy.id} className="flex items-center justify-between py-1">
                  <button
                    onClick={() => setSelectedPuppyId(puppy.id)}
                    className="flex items-center space-x-2 flex-1 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded"
                  >
                    <Avatar className="w-8 h-8">
                      {puppy.image_url ? (
                        <AvatarImage src={puppy.image_url} alt={puppy.name} />
                      ) : (
                        <AvatarFallback>{puppy.name[0]}</AvatarFallback>
                      )}
                    </Avatar>
                    <span>{puppy.name}</span>
                  </button>
                  <EditPuppyDialog 
                    puppy={puppy}
                    trigger={<Button variant="ghost" size="sm">Bearbeiten</Button>}
                  />
                </li>
              ))}
              <li>
                <NewPuppyDialog />
              </li>
            </ul>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center" 
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Abmelden
            </Button>
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
