import { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

interface HomeworkButtonProps {
  onDataChange?: () => void;
}

export const HomeworkButton = forwardRef<{
  reset: () => void;
  setChecked: (checked: boolean) => void;
  isChecked: () => boolean;
}, HomeworkButtonProps>(({ onDataChange }, ref) => {
  const [isChecked, setIsChecked] = useState(false);
  const triggerHaptic = useHapticFeedback();

  useImperativeHandle(ref, () => ({
    reset: () => {
      setIsChecked(false);
      onDataChange?.();
    },
    setChecked: (checked: boolean) => {
      setIsChecked(checked);
    },
    isChecked: () => isChecked
  }));

  useEffect(() => {
    onDataChange?.();
  }, [isChecked, onDataChange]);

  const handleToggle = () => {
    triggerHaptic();
    setIsChecked(!isChecked);
  };

  return (
    <Button
      variant="outline"
      className={`
        w-full h-14 relative transition-all duration-300 overflow-visible
        ${isChecked ? 'bg-[#45d054] hover:bg-[#3cbd49]' : 'bg-[#FF5252] hover:bg-[#ff4040]'}
        text-white border-2 border-white/20
      `}
      onClick={handleToggle}
    >
      <div className="flex items-center justify-center gap-3 relative">
        {isChecked && (
          <div className="animate-wubble order-first">
            <span className="text-3xl drop-shadow-lg">👍</span>
          </div>
        )}
        <span className="text-lg tracking-wide">
          Homework
        </span>
      </div>
    </Button>
  );
});

HomeworkButton.displayName = 'HomeworkButton';
