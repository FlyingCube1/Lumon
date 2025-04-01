import { Stats, Resource } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Activity, Timer, TrendingUp } from "lucide-react";

interface StatisticsPanelProps {
  stats: Stats;
  resources: Resource;
}

export default function StatisticsPanel({ stats, resources }: StatisticsPanelProps) {
  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return Math.floor(num);
    }
  };
  
  // Format time in hh:mm:ss
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    return [
      h > 0 ? h.toString().padStart(2, '0') : '00',
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <div className="p-2 space-y-2">
      <Card className="mb-2">
        <CardHeader className="py-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Statistics
          </CardTitle>
          <CardDescription>Track your progress and achievements</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <Activity className="h-8 w-8 mb-2 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">Total Resources</p>
              <p className="font-bold text-xl">{formatNumber(stats.totalResourcesEarned)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="h-8 w-8 mb-2 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">Per Second</p>
              <p className="font-bold text-xl">{formatNumber(resources.perSecond)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <Timer className="h-8 w-8 mb-2 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">Time Played</p>
              <p className="font-bold text-lg">{formatTime(stats.totalTimePlayed)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <svg className="h-8 w-8 mb-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm text-muted-foreground mb-1">Upgrades Bought</p>
              <p className="font-bold text-xl">{stats.totalUpgradesPurchased}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-4">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Achievements</h3>
          <p className="text-sm text-muted-foreground">
            Coming soon! Keep playing to unlock achievements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
