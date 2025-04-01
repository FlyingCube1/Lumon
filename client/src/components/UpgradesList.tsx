import { Upgrade } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronUp, LockIcon } from "lucide-react";
import { motion } from "framer-motion";

interface UpgradesListProps {
  upgrades: Upgrade[];
  resources: number;
  onPurchase: (upgradeId: number) => void;
}

export default function UpgradesList({ upgrades, resources, onPurchase }: UpgradesListProps) {
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

  // Filter to show only unlocked upgrades and the next one that's locked
  const visibleUpgrades = upgrades.filter(upgrade => 
    upgrade.unlocked || 
    (upgrades.find(u => u.id === upgrade.id - 1)?.unlocked)
  );

  return (
    <div className="p-2 space-y-2">
      <Card className="mb-2">
        <CardHeader className="py-3">
          <CardTitle className="text-lg">Upgrades</CardTitle>
          <CardDescription>Purchase upgrades to increase resource generation</CardDescription>
        </CardHeader>
      </Card>
      
      {visibleUpgrades.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Tap to collect resources and unlock upgrades!
            </p>
          </CardContent>
        </Card>
      ) : (
        visibleUpgrades.map(upgrade => (
          <motion.div
            key={upgrade.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={upgrade.unlocked ? "" : "border-dashed bg-muted/50"}>
              <CardHeader className="py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base flex items-center">
                      {!upgrade.unlocked && <LockIcon className="h-4 w-4 mr-2 text-muted-foreground" />}
                      {upgrade.name}
                      {upgrade.level > 0 && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Lvl {upgrade.level}</span>}
                    </CardTitle>
                    <CardDescription>{upgrade.description}</CardDescription>
                  </div>
                  {upgrade.unlocked && (
                    <div className="text-xs text-right">
                      <span className="text-emerald-600 flex items-center">
                        <ChevronUp className="h-3 w-3" /> 
                        +{formatNumber(upgrade.baseEffect * Math.pow(upgrade.multiplier, upgrade.level))} /sec
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              {upgrade.unlocked && (
                <>
                  <Separator />
                  <CardFooter className="py-3 flex justify-between items-center">
                    <div className="font-medium">
                      Cost: {formatNumber(upgrade.cost)} resources
                    </div>
                    <Button
                      variant={resources >= upgrade.cost ? "default" : "outline"}
                      disabled={resources < upgrade.cost}
                      onClick={() => onPurchase(upgrade.id)}
                      className="relative overflow-hidden"
                    >
                      {resources >= upgrade.cost && (
                        <motion.div
                          className="absolute inset-0 bg-primary/20"
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                          }}
                        />
                      )}
                      {upgrade.level === 0 ? "Purchase" : "Upgrade"}
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );
}
