import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useGameState } from "@/lib/useGameState";
import ResourceDisplay from "@/components/ResourceDisplay";
import UpgradesList from "@/components/UpgradesList";
import StatisticsPanel from "@/components/StatisticsPanel";
import TutorialOverlay from "@/components/TutorialOverlay";

export default function Game() {
  const { toast } = useToast();
  const { 
    gameState, 
    initialized,
    addResources,
    purchaseUpgrade,
    calculateOfflineProgress,
    saveGame
  } = useGameState();
  
  const [showTutorial, setShowTutorial] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const visited = localStorage.getItem('visited');
    if (!visited) {
      setFirstVisit(true);
      setShowTutorial(true);
      localStorage.setItem('visited', 'true');
    }
    
    // Check for offline progress
    const offlineTime = localStorage.getItem('offlineTime');
    if (offlineTime && initialized) {
      const time = parseInt(offlineTime);
      const { resources, message } = calculateOfflineProgress(time);
      
      toast({
        title: "Welcome back!",
        description: message,
        duration: 5000
      });
      
      // Clear offline time
      localStorage.removeItem('offlineTime');
    }
    
    // Autosave every minute
    const saveInterval = setInterval(() => {
      if (initialized) {
        saveGame();
        toast({
          title: "Game saved",
          description: "Your progress has been saved automatically.",
          duration: 3000
        });
      }
    }, 60000);
    
    return () => {
      clearInterval(saveInterval);
      // Save on exit
      if (initialized) {
        saveGame();
      }
    };
  }, [initialized, calculateOfflineProgress, saveGame, toast]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary rounded-full mb-4"></div>
          <p className="text-lg font-medium">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground max-w-md mx-auto relative">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b sticky top-0 bg-background z-10">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Idle Resource Empire</h1>
        <Button variant="ghost" size="icon" onClick={() => saveGame()}>
          <Home className="h-5 w-5" />
        </Button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <ResourceDisplay 
          resources={gameState.resources} 
          onTap={addResources} 
        />

        <Tabs defaultValue="upgrades" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upgrades" className="pt-2">
            <UpgradesList 
              upgrades={gameState.upgrades}
              resources={gameState.resources.amount}
              onPurchase={purchaseUpgrade}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="pt-2">
            <StatisticsPanel stats={gameState.stats} resources={gameState.resources} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay onClose={() => setShowTutorial(false)} isFirstVisit={firstVisit} />
      )}
    </div>
  );
}
