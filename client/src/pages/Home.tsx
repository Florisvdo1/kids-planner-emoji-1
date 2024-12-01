import { useState, useEffect, useRef } from 'react';
import { CloudBackground } from '../components/CloudBackground';
import { PlaceholderGrid } from '../components/PlaceholderGrid';
import { EmojiPicker } from '../components/EmojiPicker';
import { HomeworkButton } from '../components/HomeworkButton';
import { TutorialOverlay } from '../components/TutorialOverlay';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useHapticFeedback } from '../hooks/useHapticFeedback';

type GridRef = { reset: () => void };

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const triggerHaptic = useHapticFeedback();

  const morningGridRef = useRef<GridRef>(null);
  const middayGridRef = useRef<GridRef>(null);
  const eveningGridRef = useRef<GridRef>(null);
  const homeworkButtonRef = useRef<GridRef>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Check if it's the first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setShowTutorial(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }

    // Simulate loading
    setTimeout(() => setLoading(false), 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  const handleReset = () => {
    triggerHaptic();
    // Reset all grid components
    morningGridRef.current?.reset();
    middayGridRef.current?.reset();
    eveningGridRef.current?.reset();
    homeworkButtonRef.current?.reset();
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#87CEEB]">
        <Loader2 className="animate-spin h-8 w-8 text-white" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#87CEEB] font-nunito relative overflow-hidden">
      {showTutorial && <TutorialOverlay onClose={handleCloseTutorial} />}
      <CloudBackground />
      
      <main className="container mx-auto px-1.5 sm:px-3 lg:px-4 flex-1 overflow-hidden relative z-10 pb-0">
        <header className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Emoji Dagplanner
          </h1>
          <div className="flex items-center gap-4">
            <time className="text-white">
              {currentTime.toLocaleTimeString()}
            </time>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowResetDialog(true)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label="Reset planner"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all your planned activities for the day. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="space-y-2 sm:space-y-3">
          <PlaceholderGrid ref={morningGridRef} title="Morning" />
          <PlaceholderGrid ref={middayGridRef} title="Midday" />
          <PlaceholderGrid ref={eveningGridRef} title="Evening" />
          <HomeworkButton ref={homeworkButtonRef} />
        </div>
        
        <div className="mt-4 sm:mt-6 space-y-4">
          <EmojiPicker />
          
          {/* Reset button moved to header */}
        </div>
        <div className="h-[133px] w-full" aria-hidden="true" />
      </main>
    </div>
  );
}
