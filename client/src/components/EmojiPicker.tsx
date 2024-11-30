import { useState, useRef, useEffect } from 'react';
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
    begin: () => {
      triggerHaptic(); // Haptic feedback when starting drag
    },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        triggerHaptic(); // Haptic feedback when dropping emoji
      }
    },
  }));

  return (
    <button
      ref={drag}
      className={`
        text-lg sm:text-xl lg:text-2xl rounded p-1.5 sm:p-2
        transition-all duration-200 touch-manipulation
        min-w-[40px] min-h-[40px]
        flex items-center justify-center
        ${isDragging ? 'opacity-70 scale-125 rotate-1 shadow-xl' : 'hover:bg-gray-100 hover:scale-110'}
        transition-all duration-300 ease-out transform-gpu will-change-transform
        motion-reduce:transition-none
        motion-reduce:transform-none
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
  const [part, setPart] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const triggerHaptic = useHapticFeedback();
  const containerRef = useRef<HTMLDivElement>(null);

  // Get grid columns based on screen size
  const getGridColumns = () => {
    if (typeof window === 'undefined') return 5;
    if (window.innerWidth >= 768) return 8;
    if (window.innerWidth >= 640) return 6;
    return 5;
  };
  
  const [gridColumns, setGridColumns] = useState(getGridColumns());

  useEffect(() => {
    const handleResize = () => {
      setGridColumns(getGridColumns());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Validate current category and provide fallback
  useEffect(() => {
    if (category < 0 || category >= emojiCategories.length) {
      console.warn(`Invalid category index: ${category}, resetting to 0`);
      setCategory(0);
    }
  }, [category]);

  const getFilteredEmojis = () => {
    return emojiCategories[category].emojis.filter(emoji => 
      emoji.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const splitIntoRows = (emojis: typeof emojiCategories[0]['emojis']) => {
    const rows: typeof emojis[] = [];
    for (let i = 0; i < emojis.length; i += gridColumns) {
      rows.push(emojis.slice(i, i + gridColumns));
    }
    return rows;
  };

  const handleCategoryChange = (direction: 'next' | 'prev') => {
    triggerHaptic();
    
    const nextCategory = (curr: number) => {
      const next = direction === 'next' 
        ? (curr + 1) % emojiCategories.length
        : (curr - 1 + emojiCategories.length) % emojiCategories.length;
      
      // Validate the next category has emojis
      let attempts = 0;
      let validNext = next;
      while (attempts < emojiCategories.length && emojiCategories[validNext].emojis.length === 0) {
        validNext = direction === 'next'
          ? (validNext + 1) % emojiCategories.length
          : (validNext - 1 + emojiCategories.length) % emojiCategories.length;
        attempts++;
      }
      
      console.log(`Category change: ${emojiCategories[curr].name} -> ${emojiCategories[validNext].name} (${validNext}/${emojiCategories.length - 1})`);
      return validNext;
    };

    setCategory(curr => nextCategory(curr));
    setPart(0); // Reset part when changing categories
    setSearchTerm(''); // Clear search when changing categories
  };

  const handlePartChange = (direction: 'next' | 'prev') => {
    triggerHaptic();
    const rows = splitIntoRows(getFilteredEmojis());
    
    setPart(curr => {
      if (direction === 'next') {
        return (curr + 1) % rows.length;
      }
      return (curr - 1 + rows.length) % rows.length;
    });
  };

  const filteredEmojis = getFilteredEmojis();
  const emojiRows = splitIntoRows(filteredEmojis);
  const currentEmojis = emojiRows[Math.min(part, emojiRows.length - 1)] || [];
  const totalParts = emojiRows.length;

  return (
    <Card className="p-2 sm:p-3 relative z-20">
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
          onClick={() => totalParts > 1 ? handlePartChange('prev') : handleCategoryChange('prev')}
          className="h-10 w-10 sm:h-11 sm:w-11"
          aria-label="Previous category"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <span className="font-medium text-sm sm:text-base">
          {`${emojiCategories[category].name}${totalParts > 1 ? ` ${part + 1}/${totalParts}` : ''}`}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => totalParts > 1 ? handlePartChange('next') : handleCategoryChange('next')}
          className="h-10 w-10 sm:h-11 sm:w-11"
          aria-label="Next category"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      <div 
        ref={containerRef}
        className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-0.5 sm:gap-1 md:gap-2 min-h-[200px]"
      >
        {currentEmojis.length > 0 ? (
          currentEmojis.map((emoji, index) => (
            <DraggableEmoji 
              key={`${emoji.char}-${index}`} 
              emoji={emoji.char} 
              triggerHaptic={triggerHaptic} 
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-full text-gray-500">
            {searchTerm ? 'No emojis found' : 'This category is empty'}
          </div>
        )}
      </div>
    </Card>
  );
}
