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
        ${isChecked ? 'bg-[#4CAF50] hover:bg-[#45a049]' : 'bg-[#FF5252] hover:bg-[#ff4040]'}
        text-white border-2 border-white/20
      `}
      onClick={handleToggle}
    >
      <div className="flex items-center justify-center gap-3">
        {isChecked && (
          <div className="animate-wubble">
            <div className="w-8 h-8 relative pixel-art">
              {/* Pixel art thumb - 8x8 grid */}
              <div className="absolute bg-white w-1 h-1" style={{ top: '1px', left: '3px' }} />
              <div className="absolute bg-white w-2 h-1" style={{ top: '1px', left: '4px' }} />
              <div className="absolute bg-white w-1 h-3" style={{ top: '2px', left: '6px' }} />
              <div className="absolute bg-white w-1 h-4" style={{ top: '2px', left: '3px' }} />
              <div className="absolute bg-white w-3 h-1" style={{ top: '5px', left: '2px' }} />
              <div className="absolute bg-white w-1 h-2" style={{ top: '4px', left: '2px' }} />
              {/* Add outline */}
              <div className="absolute bg-black/20 w-1 h-6" style={{ top: '1px', left: '2px' }} />
              <div className="absolute bg-black/20 w-5 h-1" style={{ top: '0px', left: '3px' }} />
              <div className="absolute bg-black/20 w-1 h-4" style={{ top: '2px', left: '7px' }} />
              <div className="absolute bg-black/20 w-3 h-1" style={{ top: '6px', left: '1px' }} />
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
