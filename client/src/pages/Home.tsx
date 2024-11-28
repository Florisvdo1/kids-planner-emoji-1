import { useState, useEffect } from 'react';
import { CloudBackground } from '../components/CloudBackground';
import { PlaceholderGrid } from '../components/PlaceholderGrid';
import { EmojiPicker } from '../components/EmojiPicker';
import { DayRating } from '../components/DayRating';
import { HuiswerkButton } from '../components/HuiswerkButton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const triggerHaptic = useHapticFeedback();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);

    return () => clearInterval(timer);
  }, []);

  const handleReset = () => {
    triggerHaptic();
    // Reset logic here
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
      <CloudBackground />
      
      <main className="container mx-auto px-4 py-6 relative z-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            Emoji Dagplanner
          </h1>
          <time className="text-white">
            {currentTime.toLocaleTimeString()}
          </time>
        </header>

        <PlaceholderGrid />
        
        <div className="mt-8 space-y-6">
          <HuiswerkButton />
          <DayRating />
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
