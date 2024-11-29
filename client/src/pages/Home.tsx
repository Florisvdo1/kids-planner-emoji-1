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
    <div className="min-h-screen bg-[#87CEEB] font-nunito relative overflow-hidden">
      {showTutorial && <TutorialOverlay onClose={handleCloseTutorial} />}
      <CloudBackground />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Emoji Dagplanner
          </h1>
          <time className="text-white">
            {currentTime.toLocaleTimeString()}
          </time>
        </header>

        <div className="space-y-4">
          <PlaceholderGrid ref={morningGridRef} title="Morning" />
          <PlaceholderGrid ref={middayGridRef} title="Midday" />
          <HomeworkButton ref={homeworkButtonRef} />
          <PlaceholderGrid ref={eveningGridRef} title="Evening" />
        </div>
        
        <div className="mt-8 space-y-6">
          <EmojiPicker />
          
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={handleReset}
          >
            Reset Day
          </Button>
        </div>
      </main>
    </div>
  );
}
