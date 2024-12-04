import { useState, useEffect, useRef } from 'react';
import { CloudBackground } from '../components/CloudBackground';
import { PlaceholderGrid } from '../components/PlaceholderGrid';
import { EmojiPicker } from '../components/EmojiPicker';
import { HomeworkButton } from '../components/HomeworkButton';
import { TutorialOverlay } from '../components/TutorialOverlay';
import { Button } from '@/components/ui/button';
import { Loader2, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { useToast } from '@/hooks/use-toast';

type GridRef = { 
  reset: () => void;
  setEmojis?: (emojis: (string | null)[]) => void;
  getEmojis?: () => (string | null)[];
};

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [lastSaveAttempt, setLastSaveAttempt] = useState<Date | null>(null);
  const triggerHaptic = useHapticFeedback();
  const { toast } = useToast();

  const morningGridRef = useRef<GridRef>(null);
  const middayGridRef = useRef<GridRef>(null);
  const eveningGridRef = useRef<GridRef>(null);
  const homeworkButtonRef = useRef<GridRef>(null);

  const { saveData, loadData, isLoading: isStorageLoading, isSaving, error } = useOfflineStorage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Show error toast when storage error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: "Storage Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

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

    // Load saved data
    const loadSavedData = async () => {
      try {
        const savedData = await loadData();
        if (savedData) {
          morningGridRef.current?.setEmojis?.(savedData.morningEmojis);
          middayGridRef.current?.setEmojis?.(savedData.middayEmojis);
          eveningGridRef.current?.setEmojis?.(savedData.eveningEmojis);
          homeworkButtonRef.current?.setChecked?.(savedData.homeworkCompleted);
          toast({
            title: "Data Loaded",
            description: "Your planner data has been restored",
          });
        }
      } catch (err) {
        console.error('Error loading data:', err);
        toast({
          title: "Load Error",
          description: "Failed to load your saved data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSavedData();

    // Setup online/offline detection
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        toast({
          title: "Back Online",
          description: "Your changes will be saved automatically",
        });
      } else {
        toast({
          title: "Offline Mode",
          description: "Changes will be saved when you're back online",
          variant: "warning",
        });
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [loadData, toast]);

  // Save data when it changes with debounce
  const handleDataChange = async () => {
    // Prevent too frequent saves (minimum 2 seconds between saves)
    if (lastSaveAttempt && Date.now() - lastSaveAttempt.getTime() < 2000) {
      return;
    }

    setLastSaveAttempt(new Date());
    
    const success = await saveData({
      morningEmojis: morningGridRef.current?.getEmojis?.() || [],
      middayEmojis: middayGridRef.current?.getEmojis?.() || [],
      eveningEmojis: eveningGridRef.current?.getEmojis?.() || [],
      homeworkCompleted: homeworkButtonRef.current?.isChecked?.() || false,
    });

    if (success) {
      toast({
        title: "Changes Saved",
        description: "Your planner has been updated",
      });
    }
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  if (loading || isStorageLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#87CEEB]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-8 w-8 text-white" />
          <p className="text-white">Loading your planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#87CEEB] font-nunito relative overflow-hidden">
      {showTutorial && <TutorialOverlay onClose={handleCloseTutorial} />}
      <CloudBackground />
      
      <main className="container mx-auto px-1.5 sm:px-3 lg:px-4 flex-1 overflow-hidden relative z-10 pb-0">
        <header className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Emoji Dagplanner
            </h1>
            {!isOnline && (
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                <WifiOff className="w-4 h-4 text-white" />
                <span className="text-sm text-white">Offline</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isSaving && (
              <div className="flex items-center gap-1 text-white">
                <Loader2 className="animate-spin w-4 h-4" />
                <span className="text-sm">Saving...</span>
              </div>
            )}
            <time className="text-white">
              {currentTime.toLocaleTimeString()}
            </time>
            {isOnline && <Wifi className="w-4 h-4 text-white" />}
          </div>
        </header>

        <div className="space-y-2 sm:space-y-3">
          <PlaceholderGrid ref={morningGridRef} title="Morning" onDataChange={handleDataChange} />
          <PlaceholderGrid ref={middayGridRef} title="Midday" onDataChange={handleDataChange} />
          <PlaceholderGrid ref={eveningGridRef} title="Evening" onDataChange={handleDataChange} />
          <HomeworkButton ref={homeworkButtonRef} onDataChange={handleDataChange} />
        </div>
        
        <div className="mt-4 sm:mt-6 space-y-4">
          <EmojiPicker />
        </div>
        <div className="h-[133px] w-full" aria-hidden="true" />
      </main>
    </div>
  );
}
