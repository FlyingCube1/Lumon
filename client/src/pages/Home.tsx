import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Play, Settings, Info } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [hasSavedGame, setHasSavedGame] = useState(false);
  
  useEffect(() => {
    // Check if there's a saved game in local storage
    const savedGameState = localStorage.getItem('gameState');
    setHasSavedGame(!!savedGameState);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-lg border-t-4 border-t-primary">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Idle Resource Empire</CardTitle>
            <CardDescription>Build your resource empire with just a tap!</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4">
              <Link href="/game">
                <Button 
                  className="w-full h-14 text-lg font-semibold flex items-center justify-center gap-2" 
                  size="lg"
                >
                  {hasSavedGame ? (
                    <>
                      <Play className="h-5 w-5" /> Continue Game
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" /> New Game
                    </>
                  )}
                </Button>
              </Link>
              
              {hasSavedGame && (
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => {
                    if (confirm("Are you sure you want to start a new game? Your current progress will be lost.")) {
                      localStorage.removeItem('gameState');
                      window.location.href = '/game';
                    }
                  }}
                >
                  Start New Game
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button variant="secondary">
                <Settings className="h-5 w-5 mr-2" /> Settings
              </Button>
              <Button variant="secondary">
                <Info className="h-5 w-5 mr-2" /> How to Play
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="text-xs text-center text-muted-foreground flex justify-center">
            <p>Tap to generate resources, upgrade to earn more!</p>
          </CardFooter>
        </Card>
        
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>v1.0.0 • Made with ❤️</p>
        </div>
      </div>
    </div>
  );
}
