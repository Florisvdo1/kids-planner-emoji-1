import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { emojiCategories } from '../lib/emojiData';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

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
    <Card className="p-4">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8"
          />
          <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCategoryChange('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">
          {emojiCategories[category].name}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCategoryChange('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {currentEmojis.map((emoji, index) => (
          <button
            key={index}
            className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
            onClick={() => triggerHaptic()}
          >
            {emoji.char}
          </button>
        ))}
      </div>
    </Card>
  );
}
