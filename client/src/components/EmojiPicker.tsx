import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { emojiCategories } from '../lib/emojiData';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

interface DraggableEmojiProps {
  emoji: string;
  triggerHaptic: () => void;
}

function DraggableEmoji({ emoji, triggerHaptic }: DraggableEmojiProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'emoji',
    item: { emoji },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <button
      ref={drag}
      className={`
        text-xl sm:text-2xl rounded p-2 sm:p-1.5
        transition-colors touch-manipulation
        min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px]
        flex items-center justify-center
        ${isDragging ? 'opacity-50' : 'hover:bg-gray-100'}
      `}
      onClick={() => triggerHaptic()}
      aria-label={`Select ${emoji}`}
    >
      {emoji}
    </button>
  );
}

export function EmojiPicker() {
  const [category, setCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const triggerHaptic = useHapticFeedback();

  const handleCategoryChange = (direction: 'next' | 'prev') => {
    triggerHaptic();
    setCategory(curr => {
      if (direction === 'next') {
        return (curr + 1) % emojiCategories.length;
      }
      return curr === 0 ? emojiCategories.length - 1 : curr - 1;
    });
  };

  const currentEmojis = emojiCategories[category].emojis.filter(emoji => 
    emoji.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex gap-2 mb-3 sm:mb-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 h-10 sm:h-11"
          />
          <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCategoryChange('prev')}
          className="h-10 w-10 sm:h-11 sm:w-11"
          aria-label="Previous category"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <span className="font-medium text-sm sm:text-base">
          {emojiCategories[category].name}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCategoryChange('next')}
          className="h-10 w-10 sm:h-11 sm:w-11"
          aria-label="Next category"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 sm:gap-2">
        {currentEmojis.map((emoji, index) => (
          <DraggableEmoji key={index} emoji={emoji.char} triggerHaptic={triggerHaptic} />
        ))}
      </div>
    </Card>
  );
}
