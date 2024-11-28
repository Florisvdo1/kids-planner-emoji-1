import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

export function HuiswerkButton() {
  const [isChecked, setIsChecked] = useState(false);
  const triggerHaptic = useHapticFeedback();

  const handleToggle = () => {
    triggerHaptic();
    setIsChecked(!isChecked);
  };

  return (
    <Button
      variant="outline"
      className={`
        w-full h-12 relative transition-colors
        ${isChecked ? 'bg-primary/20' : ''}
      `}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          className={`w-6 h-6 transition-transform ${isChecked ? 'scale-110' : ''}`}
        >
          <path
            d="M4 6h16M4 12h16m-7 6h7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            className={isChecked ? 'text-primary' : ''}
          />
          {isChecked && (
            <circle
              cx="18"
              cy="18"
              r="3"
              fill="currentColor"
              className="text-primary"
            />
          )}
        </svg>
        <span>Huiswerk</span>
      </div>
    </Button>
  );
}
