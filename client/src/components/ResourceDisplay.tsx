import { Resource } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, TrendingUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResourceDisplayProps {
  resources: Resource;
  onTap: (amount: number) => void;
}

export default function ResourceDisplay({ resources, onTap }: ResourceDisplayProps) {
  const [taps, setTaps] = useState<{id: number, x: number, y: number, value: number}[]>([]);
  const [animatedAmount, setAnimatedAmount] = useState(resources.amount);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tapBaseValue = 1;
  
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
  
  // Animate resource counter
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      if (Math.abs(animatedAmount - resources.amount) > 0.1) {
        setAnimatedAmount(prev => prev + (resources.amount - prev) * 0.1);
      } else {
        setAnimatedAmount(resources.amount);
      }
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [resources.amount, animatedAmount]);

  const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Get tap position relative to the button
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Add a new tap animation
      const newTap = {
        id: Date.now(),
        x,
        y,
        value: tapBaseValue
      };
      
      setTaps(prev => [...prev, newTap]);
      
      // Remove the tap after animation completes
      setTimeout(() => {
        setTaps(prev => prev.filter(tap => tap.id !== newTap.id));
      }, 1000);
      
      // Call the onTap callback
      onTap(tapBaseValue);
    }
  };

  return (
    <div className="p-4">
      <Card className="relative overflow-hidden">
        <CardContent className="pt-6 pb-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-1 text-primary tracking-tight">
              {formatNumber(Math.floor(animatedAmount))}
            </h2>
            <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {formatNumber(resources.perSecond)} per second
            </p>
            
            <Button 
              ref={buttonRef}
              className="w-full h-24 mt-2 relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={handleTap}
            >
              <Sparkles className="h-8 w-8 absolute" />
              <span className="font-bold text-xl">TAP TO COLLECT</span>
              
              {/* Tap animations */}
              <AnimatePresence>
                {taps.map(tap => (
                  <motion.div 
                    key={tap.id}
                    initial={{ opacity: 1, y: 0, x: 0 }}
                    animate={{ opacity: 0, y: -50, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute text-yellow-300 font-bold pointer-events-none"
                    style={{ left: `${tap.x}px`, top: `${tap.y}px` }}
                  >
                    +{tap.value}
                  </motion.div>
                ))}
              </AnimatePresence>
            </Button>
            
            <div className="mt-4">
              <Progress value={100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
