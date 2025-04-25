
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Plus, BarChart, Menu } from "lucide-react";

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-puppy-purple/20 text-puppy-purple font-medium" : "";
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐶</span>
            <h1 className="text-xl font-bold">Puppy Tracker</h1>
          </div>
          <button onClick={toggleMenu} className="p-2">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b">
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
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus size={20} />
                    <span>Neuer Eintrag</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/calendar" 
                    className={`flex items-center px-5 py-3 space-x-3 ${isActive('/calendar')}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Calendar size={20} />
                    <span>Kalender</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/statistics" 
                    className={`flex items-center px-5 py-3 space-x-3 ${isActive('/statistics')}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <BarChart size={20} />
                    <span>Statistiken</span>
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="p-5 border-t mt-6">
              <h2 className="font-semibold mb-2">Welpen</h2>
              <ul className="space-y-1">
                <li className="flex items-center space-x-2 py-1">
                  <div className="w-8 h-8 bg-puppy-purple rounded-full flex items-center justify-center text-white">B</div>
                  <span>Bruno</span>
                </li>
                <li className="flex items-center space-x-2 py-1">
                  <div className="w-8 h-8 bg-puppy-blue rounded-full flex items-center justify-center text-white">L</div>
                  <span>Luna</span>
                </li>
                <li>
                  <button className="w-full flex items-center space-x-2 py-1 text-gray-500 hover:text-gray-700">
                    <Plus size={16} />
                    <span>Neuen Welpen</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around z-10">
        <Link to="/" className={`flex-1 py-3 flex flex-col items-center ${isActive('/')}`}>
          <Plus size={20} />
          <span className="text-xs mt-1">Eintrag</span>
        </Link>
        <Link to="/calendar" className={`flex-1 py-3 flex flex-col items-center ${isActive('/calendar')}`}>
          <Calendar size={20} />
          <span className="text-xs mt-1">Kalender</span>
        </Link>
        <Link to="/statistics" className={`flex-1 py-3 flex flex-col items-center ${isActive('/statistics')}`}>
          <BarChart size={20} />
          <span className="text-xs mt-1">Statistik</span>
        </Link>
      </div>
    </>
  );
};

export default MobileNav;
