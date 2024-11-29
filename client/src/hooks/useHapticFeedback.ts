export function useHapticFeedback() {
  return () => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(75);
      } catch (error) {
        console.warn('Vibration API error:', error instanceof Error ? error.message : 'Unknown error');
      }
    } else {
      console.debug('Vibration API not supported on this device');
    }
  };
}
