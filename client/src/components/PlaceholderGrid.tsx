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
        w-12 h-12 border-2 rounded-lg flex items-center justify-center
        ${isOver ? 'border-primary' : 'border-gray-300'}
        ${emoji ? 'bg-white' : 'bg-gray-50'}
      `}
    >
      {emoji || '?'}
    </div>
  );
}

export function PlaceholderGrid() {
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
    <Card className="p-4">
      <div className="flex flex-wrap gap-2">
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
            className="w-12 h-12"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
