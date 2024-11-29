import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

interface PlaceholderProps {
  emoji: string | null;
  onDrop: (item: { emoji: string }) => void;
}

function Placeholder({ emoji, onDrop }: PlaceholderProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'emoji',
    drop: (item: { emoji: string }) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`
        w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14
        border-2 rounded-lg flex items-center justify-center
        text-base sm:text-lg md:text-xl
        transition-colors duration-200
        ${isOver ? 'border-primary' : 'border-gray-300'}
        ${emoji ? 'bg-white' : 'bg-gray-50'}
        hover:bg-gray-50/80
        touch-manipulation
      `}
      aria-label={emoji ? `Placeholder with ${emoji}` : 'Empty placeholder'}
    >
      {emoji || '?'}
    </div>
  );
}

interface PlaceholderGridProps {
  title: string;
}

export function PlaceholderGrid({ title }: PlaceholderGridProps) {
  const [placeholders, setPlaceholders] = useState<(string | null)[]>([null]);
  const triggerHaptic = useHapticFeedback();

  const handleAddPlaceholder = () => {
    if (placeholders.length < 5) {
      triggerHaptic();
      setPlaceholders([...placeholders, null]);
    }
  };

  const handleDrop = (index: number, item: { emoji: string }) => {
    triggerHaptic();
    const newPlaceholders = [...placeholders];
    newPlaceholders[index] = item.emoji;
    setPlaceholders(newPlaceholders);
  };

  return (
    <Card className="p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{title}</h3>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {placeholders.map((emoji, index) => (
          <Placeholder
            key={index}
            emoji={emoji}
            onDrop={(item) => handleDrop(index, item)}
          />
        ))}
        
        {placeholders.length < 5 && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddPlaceholder}
            className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 touch-manipulation"
            aria-label="Add placeholder"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
      </div>
    </Card>
  );
}
