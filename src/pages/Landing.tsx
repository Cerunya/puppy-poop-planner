
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

const Landing = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && !loading) {
      navigate("/dashboard");
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Laden...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 flex justify-between items-center border-b backdrop-blur-md bg-white/80 dark:bg-gray-900/80 sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <span className="text-2xl animate-bounce">🐶</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Puppy Tracker
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {!session && (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Kostenlos starten
                </Button>
              </Link>
            </>
          )}
          {session && (
            <Link to="/dashboard">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Zum Dashboard
              </Button>
            </Link>
          )}
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20 px-6 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-8">
              <div className="inline-block animate-bounce text-6xl mb-6 p-4 rounded-full bg-white/50 dark:bg-gray-800/50 shadow-xl">
                🐶
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Puppy Tracker
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Behalten Sie spielend leicht den Überblick über die Stubenreinheit Ihres Welpen
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Jetzt kostenlos starten
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-white dark:bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-purple-50 dark:bg-gray-800 shadow-sm">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Detaillierte Statistiken</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Verfolgen Sie die Fortschritte Ihres Welpen mit übersichtlichen Grafiken und Analysen.
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-purple-50 dark:bg-gray-800 shadow-sm">
                <div className="text-3xl mb-4">📅</div>
                <h3 className="text-xl font-semibold mb-2">Tagesübersicht</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Behalten Sie den Überblick über die täglichen Aktivitäten Ihres Welpen.
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-purple-50 dark:bg-gray-800 shadow-sm">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-2">Einfache Bedienung</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Intuitiv und schnell - erfassen Sie Ereignisse mit wenigen Klicks.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 px-6 border-t bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Puppy Tracker. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
