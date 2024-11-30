import { useState, useEffect, useRef } from 'react';
import { CloudBackground } from '../components/CloudBackground';
import { PlaceholderGrid } from '../components/PlaceholderGrid';
import { EmojiPicker } from '../components/EmojiPicker';
import { HomeworkButton } from '../components/HomeworkButton';
import { TutorialOverlay } from '../components/TutorialOverlay';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

type GridRef = { reset: () => void };

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
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
          <time className="text-white">
            {currentTime.toLocaleTimeString()}
          </time>
        </header>

        <div className="space-y-2 sm:space-y-3">
          <PlaceholderGrid ref={morningGridRef} title="Morning" />
          <PlaceholderGrid ref={middayGridRef} title="Midday" />
          <PlaceholderGrid ref={eveningGridRef} title="Evening" />
          <HomeworkButton ref={homeworkButtonRef} />
        </div>
        
        <div className="mt-4 sm:mt-6 space-y-4">
          <EmojiPicker />
          
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={handleReset}
          >
            Reset Day
          </Button>
        </div>
        <div className="h-[133px] w-full" aria-hidden="true" />
      </main>
    </div>
  );
}
