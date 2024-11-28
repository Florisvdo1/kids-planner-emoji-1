export function useHapticFeedback() {
  return () => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(50);
      } catch (e) {
        console.warn('Vibration API not supported');
      }
    }
  };
}
