
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePuppy } from "@/context/PuppyContext";

const Landing = () => {
  const { session } = usePuppy();

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🐶</span>
          <h1 className="text-xl font-bold">Puppy Tracker</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 text-6xl">🐶</div>
          <h1 className="text-4xl font-bold mb-4">Puppy Tracker</h1>
          <p className="text-xl mb-8">
            Behalten Sie den Überblick über die Stubenreinheit Ihres Welpen mit unserer einfach zu bedienenden App.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">Jetzt registrieren</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Login</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Puppy Tracker. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default Landing;
