import { useEffect } from 'react';

/**
 * Custom hook to handle escape key press
 * @param {Function} onEscape - The function to call when Escape key is pressed
 */
const useEscape = (onEscape) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape]);
};

export default useEscape;
