import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/game" component={Game} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Handle app installation prompt
  useEffect(() => {
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
    });

    // Check if we should calculate offline progress
    const lastTimestamp = localStorage.getItem('lastTimestamp');
    if (lastTimestamp) {
      const offlineTime = Date.now() - parseInt(lastTimestamp);
      if (offlineTime > 5000) { // More than 5 seconds offline
        // We'll handle the calculation in the Game component
        localStorage.setItem('offlineTime', offlineTime.toString());
      }
    }

    // Update last timestamp for offline calculation next time
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('lastTimestamp', Date.now().toString());
    });

    return () => {
      window.removeEventListener('beforeunload', () => {});
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
