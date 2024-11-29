import { useState, forwardRef, useImperativeHandle } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import type { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

interface PlaceholderProps {
  emoji: string | null;
  onDrop: (item: { emoji: string }) => void;
  index: number;
  onEmojiSwap: (fromIndex: number, toIndex: number) => void;
}

function Placeholder({ emoji, onDrop, index, onEmojiSwap }: PlaceholderProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'emoji',
    drop: (item: { emoji: string; sourceIndex?: number }) => {
      if (typeof item.sourceIndex === 'number') {
        onEmojiSwap(item.sourceIndex, index);
      } else {
        onDrop(item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'emoji',
    item: { emoji, sourceIndex: index },
    canDrag: !!emoji,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) => {
        drop(node);
        if (emoji) drag(node);
      }}
      className={`
        w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14
        border-2 rounded-lg flex items-center justify-center
        text-base sm:text-lg md:text-xl
        transition-all duration-300 ease-out
        relative z-10
        ${isOver ? 'border-primary shadow-xl scale-110 glow-effect' : 'border-gray-300 hover:shadow-lg'}
        ${isDragging ? 'opacity-50 scale-125 z-50 shadow-xl' : ''}
        ${canDrop ? 'bg-primary/10' : emoji ? 'bg-white hover:bg-gray-50/90' : 'bg-gray-50'}
        hover:scale-115
        touch-manipulation
        transform-gpu
      `}
      style={{
        boxShadow: isOver ? '0 0 10px rgba(135, 206, 235, 0.5)' : 'none',
      }}
      aria-label={emoji ? `Placeholder with ${emoji}` : 'Empty placeholder'}
    >
      {emoji || '?'}
    </div>
  );
}

interface PlaceholderGridProps {
  title: string;
}

export const PlaceholderGrid = forwardRef<{ reset: () => void }, PlaceholderGridProps>(({ title }, ref) => {
  const [placeholders, setPlaceholders] = useState<(string | null)[]>([null]);
  const triggerHaptic = useHapticFeedback();

  useImperativeHandle(ref, () => ({
    reset: () => setPlaceholders([null])
  }));

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

  const handleEmojiSwap = (fromIndex: number, toIndex: number) => {
    triggerHaptic();
    const newPlaceholders = [...placeholders];
    const temp = newPlaceholders[fromIndex];
    newPlaceholders[fromIndex] = newPlaceholders[toIndex];
    newPlaceholders[toIndex] = temp;
    setPlaceholders(newPlaceholders);
  };

  return (
    <Card className="p-2 sm:p-3 transform-gpu hover:glow-effect">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{title}</h3>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {placeholders.map((emoji, index) => (
          <Placeholder
            key={index}
            emoji={emoji}
            index={index}
            onDrop={(item) => handleDrop(index, item)}
            onEmojiSwap={handleEmojiSwap}
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
});

PlaceholderGrid.displayName = 'PlaceholderGrid';
