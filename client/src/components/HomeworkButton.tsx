import { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

export const HomeworkButton = forwardRef<{ reset: () => void }, {}>(({}, ref) => {
  const [isChecked, setIsChecked] = useState(false);
  const triggerHaptic = useHapticFeedback();

  useImperativeHandle(ref, () => ({
    reset: () => setIsChecked(false)
  }));

  const handleToggle = () => {
    triggerHaptic();
    setIsChecked(!isChecked);
  };

  return (
    <Button
      variant="outline"
      className={`
        w-full h-14 relative transition-all duration-300 overflow-hidden
        ${isChecked ? 'bg-[#45d054] hover:bg-[#3cbd49]' : 'bg-[#FF5252] hover:bg-[#ff4040]'}
        text-white border-2 border-white/20
      `}
      onClick={handleToggle}
    >
      <div className="flex items-center justify-center gap-3">
        {isChecked && (
          <div className="animate-wubble order-first">
            <div className="w-9 h-9 relative pixel-art drop-shadow-lg">
              {/* Pixel art thumb - 8x8 grid */}
              <div className="absolute bg-white w-1.5 h-1.5" style={{ top: '2px', left: '4px' }} />
              <div className="absolute bg-white w-2.5 h-1.5" style={{ top: '2px', left: '5px' }} />
              <div className="absolute bg-white w-1.5 h-3.5" style={{ top: '3px', left: '7px' }} />
              <div className="absolute bg-white w-1.5 h-4.5" style={{ top: '3px', left: '4px' }} />
              <div className="absolute bg-white w-3.5 h-1.5" style={{ top: '6px', left: '3px' }} />
              <div className="absolute bg-white w-1.5 h-2.5" style={{ top: '5px', left: '3px' }} />
              {/* Add outline */}
              <div className="absolute bg-black/20 w-1.5 h-7" style={{ top: '2px', left: '3px' }} />
              <div className="absolute bg-black/20 w-6 h-1.5" style={{ top: '1px', left: '4px' }} />
              <div className="absolute bg-black/20 w-1.5 h-5" style={{ top: '3px', left: '8px' }} />
              <div className="absolute bg-black/20 w-3.5 h-1.5" style={{ top: '7px', left: '2px' }} />
              {/* Add glow effect */}
              <div className="absolute inset-0 bg-white/20 blur-sm rounded-full animate-pulse" />
            </div>
          </div>
        )}
        <span className="font-pixel text-lg tracking-wide">
          Homework
        </span>
      </div>

      <style>{`
        .pixel-art * {
          transform-origin: center;
          image-rendering: pixelated;
        }
        .font-pixel {
          font-family: 'Press Start 2P', system-ui, sans-serif;
        }
      `}</style>
    </Button>
  );
});

HomeworkButton.displayName = 'HomeworkButton';
