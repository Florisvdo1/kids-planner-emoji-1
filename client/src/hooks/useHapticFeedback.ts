export function useHapticFeedback() {
  return () => {
    if ('vibrate' in navigator) {
      try {
        // Pattern: vibrate 100ms, pause 50ms, vibrate 100ms
        navigator.vibrate([150, 50, 150]);
      } catch (error) {
        // Enhanced error handling with proper type checking
        if (error instanceof TypeError) {
          console.warn('Vibration API type error:', error.message);
        } else {
          console.warn('Unexpected Vibration API error:', error instanceof Error ? error.message : 'Unknown error');
        }
      }
    } else {
      console.debug('Vibration API not supported on this device');
    }
  };
}
