import { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

export const HomeworkButton = forwardRef<{ reset: () => void }, {}>(({}, ref) => {
  const { dayPlan, updateDayPlan } = useDayPlan();
  const triggerHaptic = useHapticFeedback();

  useImperativeHandle(ref, () => ({
    reset: () => {
      updateDayPlan({
        ...dayPlan,
        homework_completed: false,
      });
    }
  }));

  const handleToggle = () => {
    triggerHaptic();
    updateDayPlan({
      ...dayPlan,
      homework_completed: !dayPlan?.homework_completed,
    });
  };

  const isChecked = dayPlan?.homework_completed ?? false;

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
          <div className="animate-wobble order-first" style={{ animationIterationCount: '1' }}>
            <span className="text-2xl drop-shadow-lg">👍</span>
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
