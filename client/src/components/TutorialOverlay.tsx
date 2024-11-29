import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const tutorialSteps = [
  {
    title: 'Welcome to Emoji Dagplanner!',
    description: 'Let\'s learn how to use this app to plan your day with emojis.',
  },
  {
    title: 'Emoji Grid',
    description: 'Drag emojis from the picker below and drop them into the time slots to plan your activities.',
  },
  {
    title: 'Homework Tracking',
    description: 'Use the homework button to mark when you\'ve completed your homework. It turns green when checked!',
  },
  {
    title: 'Reset Your Day',
    description: 'Click the Reset button at any time to clear all your selections and start fresh.',
  },
];

interface TutorialOverlayProps {
  onClose: () => void;
}

export function TutorialOverlay({ onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleNext = () => {
    if (currentStep === tutorialSteps.length - 1) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {tutorialSteps[currentStep].title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Skip
          </Button>
        </div>
        
        <p className="text-gray-600">
          {tutorialSteps[currentStep].description}
        </p>
        
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-1">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <Button onClick={handleNext}>
            {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
