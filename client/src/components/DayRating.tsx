import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

const ratings = [
  { emoji: '😱', label: 'Terrible' },
  { emoji: '😕', label: 'Bad' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😄', label: 'Great' },
];

export function DayRating() {
  const [selected, setSelected] = useState<number | null>(null);
  const triggerHaptic = useHapticFeedback();

  const handleSelect = (index: number) => {
    triggerHaptic();
    setSelected(index);
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">How was your day?</h2>
      <div className="flex justify-between">
        {ratings.map((rating, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={`
              text-2xl p-2 rounded-full transition-transform
              ${selected === index ? 'scale-125 bg-primary/10' : 'hover:scale-110'}
            `}
            aria-label={rating.label}
          >
            {rating.emoji}
          </button>
        ))}
      </div>
    </Card>
  );
}
