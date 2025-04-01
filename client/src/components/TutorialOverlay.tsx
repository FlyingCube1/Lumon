import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowUp, BarChart } from "lucide-react";
import { useState } from "react";

interface TutorialOverlayProps {
  onClose: () => void;
  isFirstVisit: boolean;
}

export default function TutorialOverlay({ onClose, isFirstVisit }: TutorialOverlayProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };
  
  const handleSkip = () => {
    onClose();
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 1 && <Sparkles className="h-5 w-5 text-primary" />}
            {step === 2 && <ArrowUp className="h-5 w-5 text-primary" />}
            {step === 3 && <BarChart className="h-5 w-5 text-primary" />}
            {step === 1 && "Welcome to Idle Resource Empire"}
            {step === 2 && "Upgrade Your Empire"}
            {step === 3 && "Track Your Progress"}
          </DialogTitle>
          <DialogDescription>
            {isFirstVisit ? "Let's learn how to play!" : "Need a refresher? Here's how to play!"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          {step === 1 && (
            <div className="space-y-2">
              <div className="border rounded-lg p-4 flex items-center justify-center bg-muted/50">
                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <p className="text-sm">
                Tap the collection button to gather resources manually. Your resources 
                will also generate automatically over time, even when you're not playing!
              </p>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-2">
              <div className="border rounded-lg p-4 flex items-center justify-center bg-muted/50">
                <ArrowUp className="h-10 w-10 text-primary" />
              </div>
              <p className="text-sm">
                Spend your resources on upgrades to increase your resource generation rate.
                Each upgrade becomes more expensive but also more powerful as you level it up.
              </p>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-2">
              <div className="border rounded-lg p-4 flex items-center justify-center bg-muted/50">
                <BarChart className="h-10 w-10 text-primary" />
              </div>
              <p className="text-sm">
                Check your statistics to see how much you've earned and track your progress.
                Your game is automatically saved, and you'll earn resources even when you're offline!
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex sm:justify-between gap-2">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Tutorial
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">{step}/{totalSteps}</span>
            <Button onClick={handleNext}>
              {step < totalSteps ? "Next" : "Start Playing"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
