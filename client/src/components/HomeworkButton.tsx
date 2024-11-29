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
        w-full h-12 relative transition-all duration-300
        ${isChecked ? 'bg-[#4CAF50] text-white' : 'bg-[#FF5252] text-white'}
      `}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-2">
        {isChecked && (
          <div className="animate-wubble">
            <div className="w-6 h-6 relative">
              <div className="absolute w-2 h-4 bg-current" style={{ top: '0px', left: '2px' }} />
              <div className="absolute w-4 h-2 bg-current" style={{ top: '0px', left: '2px' }} />
              <div className="absolute w-2 h-3 bg-current" style={{ top: '3px', left: '4px' }} />
            </div>
          </div>
        )}
        <span className="font-medium">
          Homework
        </span>
      </div>
    </Button>
  );
});

HomeworkButton.displayName = 'HomeworkButton';
