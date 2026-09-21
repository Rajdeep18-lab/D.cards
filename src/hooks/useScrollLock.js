import { useEffect, useRef } from 'react';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

/**
 * Custom React hook to safely lock and unlock background page scrolling.
 * Automatically handles component mounting, unmounting, and dynamic state changes.
 *
 * @param {boolean} isLocked - Whether scroll should currently be locked.
 */
export function useScrollLock(isLocked) {
  const isCurrentlyLockedRef = useRef(false);

  useEffect(() => {
    if (isLocked && !isCurrentlyLockedRef.current) {
      lockScroll();
      isCurrentlyLockedRef.current = true;
    } else if (!isLocked && isCurrentlyLockedRef.current) {
      unlockScroll();
      isCurrentlyLockedRef.current = false;
    }

    return () => {
      if (isCurrentlyLockedRef.current) {
        unlockScroll();
        isCurrentlyLockedRef.current = false;
      }
    };
  }, [isLocked]);
}

export default useScrollLock;
