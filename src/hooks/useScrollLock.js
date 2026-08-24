import { useEffect } from 'react';

export function useScrollLock(isLocked) {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
}
