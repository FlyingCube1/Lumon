import { useState, useEffect, useCallback } from "react";
import { GameState, Resource, Upgrade, Stats } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Initial upgrades configuration
const initialUpgrades: Upgrade[] = [
  {
    id: 1,
    name: "Basic Collector",
    description: "Enhances your resource collection rate",
    cost: 10,
    level: 0,
    baseEffect: 0.5,
    multiplier: 1.5,
    unlocked: true
  },
  {
    id: 2,
    name: "Automated Harvester",
    description: "Automatically harvests resources for you",
    cost: 50,
    level: 0,
    baseEffect: 2,
    multiplier: 1.6,
    unlocked: false
  },
  {
    id: 3,
    name: "Resource Amplifier",
    description: "Amplifies the value of collected resources",
    cost: 250,
    level: 0,
    baseEffect: 5,
    multiplier: 1.7,
    unlocked: false
  },
  {
    id: 4,
    name: "Quantum Extractor",
    description: "Extracts resources from parallel dimensions",
    cost: 1000,
    level: 0,
    baseEffect: 15,
    multiplier: 1.8,
    unlocked: false
  },
  {
    id: 5,
    name: "Galactic Network",
    description: "Collects resources from throughout the galaxy",
    cost: 5000,
    level: 0,
    baseEffect: 50,
    multiplier: 2.0,
    unlocked: false
  }
];

// Initial game state
const initialGameState: GameState = {
  resources: {
    amount: 0,
    perSecond: 0,
    lastUpdated: Date.now()
  },
  upgrades: initialUpgrades,
  stats: {
    totalResourcesEarned: 0,
    totalUpgradesPurchased: 0,
    totalTimePlayed: 0,
    lastPlayedTimestamp: Date.now()
  }
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [initialized, setInitialized] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const { toast } = useToast();

  // Load game state from localStorage
  useEffect(() => {
    const loadGame = () => {
      try {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
          const parsedState = JSON.parse(savedState) as GameState;
          
          // Calculate resources earned while away
          const now = Date.now();
          const timeDiff = (now - parsedState.resources.lastUpdated) / 1000; // in seconds
          
          if (timeDiff > 0) {
            const resourcesEarned = parsedState.resources.perSecond * timeDiff;
            parsedState.resources.amount += resourcesEarned;
            parsedState.stats.totalResourcesEarned += resourcesEarned;
            parsedState.resources.lastUpdated = now;
          }
          
          // Update total time played
          if (parsedState.stats.lastPlayedTimestamp) {
            parsedState.stats.totalTimePlayed += (now - parsedState.stats.lastPlayedTimestamp);
          }
          
          parsedState.stats.lastPlayedTimestamp = now;
          
          setGameState(parsedState);
        } else {
          // Initialize new game
          setGameState({
            ...initialGameState,
            resources: {
              ...initialGameState.resources,
              lastUpdated: Date.now()
            },
            stats: {
              ...initialGameState.stats,
              lastPlayedTimestamp: Date.now()
            }
          });
        }
        
        setInitialized(true);
      } catch (error) {
        console.error("Failed to load game state:", error);
        // Fallback to new game
        setGameState({
          ...initialGameState,
          resources: {
            ...initialGameState.resources,
            lastUpdated: Date.now()
          }
        });
        setInitialized(true);
      }
    };
    
    loadGame();
  }, []);

  // Update resources every second
  useEffect(() => {
    if (!initialized) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const timeDiff = (now - lastUpdateTime) / 1000; // in seconds
      
      setGameState(prev => {
        const resourcesEarned = prev.resources.perSecond * timeDiff;
        
        return {
          ...prev,
          resources: {
            ...prev.resources,
            amount: prev.resources.amount + resourcesEarned,
            lastUpdated: now
          },
          stats: {
            ...prev.stats,
            totalResourcesEarned: prev.stats.totalResourcesEarned + resourcesEarned,
            totalTimePlayed: prev.stats.totalTimePlayed + (now - (prev.stats.lastPlayedTimestamp || now))
          }
        };
      });
      
      setLastUpdateTime(now);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [initialized, lastUpdateTime]);

  // Add resources manually (tap)
  const addResources = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        amount: prev.resources.amount + amount
      },
      stats: {
        ...prev.stats,
        totalResourcesEarned: prev.stats.totalResourcesEarned + amount
      }
    }));
  }, []);

  // Calculate resource generation rate based on upgrades
  const calculateResourcesPerSecond = useCallback((upgrades: Upgrade[]) => {
    return upgrades.reduce((total, upgrade) => {
      if (upgrade.level > 0) {
        return total + (upgrade.baseEffect * Math.pow(upgrade.multiplier, upgrade.level - 1));
      }
      return total;
    }, 0);
  }, []);

  // Purchase an upgrade
  const purchaseUpgrade = useCallback((upgradeId: number) => {
    setGameState(prev => {
      const upgrades = [...prev.upgrades];
      const upgradeIndex = upgrades.findIndex(u => u.id === upgradeId);
      
      if (upgradeIndex === -1) return prev;
      
      const upgrade = upgrades[upgradeIndex];
      
      // Check if player has enough resources
      if (prev.resources.amount < upgrade.cost) return prev;
      
      // Upgrade purchased
      const newLevel = upgrade.level + 1;
      const newCost = Math.floor(upgrade.cost * Math.pow(upgrade.multiplier, 0.5));
      
      // Update the upgrade
      upgrades[upgradeIndex] = {
        ...upgrade,
        level: newLevel,
        cost: newCost
      };
      
      // Unlock next upgrade if applicable
      if (upgradeId < upgrades.length) {
        const nextUpgradeIndex = upgrades.findIndex(u => u.id === upgradeId + 1);
        if (nextUpgradeIndex !== -1) {
          upgrades[nextUpgradeIndex] = {
            ...upgrades[nextUpgradeIndex],
            unlocked: true
          };
        }
      }
      
      // Calculate new resource generation rate
      const newPerSecond = calculateResourcesPerSecond(upgrades);
      
      // Show toast notification
      toast({
        title: `Upgrade Purchased: ${upgrade.name}`,
        description: `Now at level ${newLevel}!`,
        duration: 3000
      });
      
      return {
        ...prev,
        resources: {
          ...prev.resources,
          amount: prev.resources.amount - upgrade.cost,
          perSecond: newPerSecond
        },
        upgrades,
        stats: {
          ...prev.stats,
          totalUpgradesPurchased: prev.stats.totalUpgradesPurchased + 1
        }
      };
    });
  }, [calculateResourcesPerSecond, toast]);

  // Calculate offline progress
  const calculateOfflineProgress = useCallback((offlineTime: number) => {
    const seconds = offlineTime / 1000;
    const resources = gameState.resources.perSecond * seconds;
    
    setGameState(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        amount: prev.resources.amount + resources
      },
      stats: {
        ...prev.stats,
        totalResourcesEarned: prev.stats.totalResourcesEarned + resources
      }
    }));
    
    let message = "";
    
    if (seconds < 60) {
      message = `You earned ${Math.floor(resources)} resources while away for ${Math.floor(seconds)} seconds.`;
    } else if (seconds < 3600) {
      message = `You earned ${Math.floor(resources)} resources while away for ${Math.floor(seconds / 60)} minutes.`;
    } else {
      message = `You earned ${Math.floor(resources)} resources while away for ${Math.floor(seconds / 3600)} hours.`;
    }
    
    return { resources, message };
  }, [gameState.resources.perSecond]);

  // Save game state to localStorage
  const saveGame = useCallback(() => {
    if (!initialized) return;
    
    try {
      localStorage.setItem('gameState', JSON.stringify(gameState));
    } catch (error) {
      console.error("Failed to save game state:", error);
      toast({
        title: "Error",
        description: "Failed to save your game progress",
        variant: "destructive"
      });
    }
  }, [gameState, initialized, toast]);

  return {
    gameState,
    initialized,
    addResources,
    purchaseUpgrade,
    calculateOfflineProgress,
    saveGame
  };
}
