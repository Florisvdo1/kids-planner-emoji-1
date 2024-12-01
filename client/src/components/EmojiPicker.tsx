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
    item: () => {
      triggerHaptic(); // Haptic feedback when starting drag
      document.body.classList.add('dragging');
      return {
        emoji,
        hasTriggeredProximity: false,
        type: 'emoji'
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      document.body.classList.remove('dragging');
      if (monitor.didDrop()) {
        triggerHaptic(); // Haptic feedback when dropping emoji
      }
    },
    options: {
      dropEffect: 'copy',
      enableTouchEvents: true,
    },
  }));

  return (
    <button
      ref={drag}
      className={`
        relative w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded
        transition-all duration-300 touch-none select-none
        flex items-center justify-center
        transform-gpu will-change-transform
        ${isDragging 
          ? 'opacity-90 scale-125 rotate-2 shadow-2xl z-50 bg-white/95 ring-2 ring-primary/30' 
          : 'hover:bg-gray-100 hover:scale-110 hover:shadow-lg active:scale-125 active:bg-primary/10'
        }
        transition-transform duration-300 ease-out
        touch-feedback
      `}
      style={{
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      onClick={() => triggerHaptic()}
      onTouchStart={(e) => {
        e.preventDefault();
        triggerHaptic();
        document.body.classList.add('dragging');
      }}
      onTouchEnd={() => {
        document.body.classList.remove('dragging');
      }}
      aria-label={`Select ${emoji}`}
    >
      <div className="absolute inset-[-11px] touch-none" /> {/* 44px touch target (22px on each side) */}
      <span className="text-base sm:text-lg md:text-xl p-2 sm:p-2.5 md:p-3 pointer-events-none select-none">
        {emoji}
      </span>
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
    if (!searchTerm.trim()) {
      return emojiCategories[category].emojis;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    const words = searchLower.split(/\s+/);

    // If searching, show results from all categories
    if (searchLower) {
      const allResults = emojiCategories.flatMap(cat => 
        cat.emojis.filter(emoji => {
          const nameMatch = words.every(word => 
            emoji.name.toLowerCase().includes(word)
          );
          // Also match by emoji character for direct searches
          const charMatch = emoji.char === searchTerm;
          return nameMatch || charMatch;
        })
      );

      // Remove duplicates if any
      return Array.from(new Map(allResults.map(item => 
        [item.char, item]
      )).values());
    }

    return emojiCategories[category].emojis;
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
    <Card className="p-1.5 sm:p-2 relative z-20">
      <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search emojis (e.g., 'happy face' or '🎮')"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // Reset to first page when searching
              setPart(0);
            }}
            className="w-full pl-8 h-10 sm:h-11"
            onFocus={() => triggerHaptic()}
          />
          <Search 
            className={`w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
              searchTerm ? 'text-primary' : 'text-gray-500'
            }`} 
          />
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
        className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-2.5 h-[120px] sm:h-[140px] md:h-[160px] overflow-hidden touch-none"
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
          <div className="col-span-full flex flex-col items-center justify-center h-full text-gray-500">
            {searchTerm ? (
              <>
                <span className="text-lg mb-1">No emojis found</span>
                <span className="text-sm opacity-75">
                  Try different keywords or check spelling
                </span>
              </>
            ) : (
              <span>This category is empty</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
