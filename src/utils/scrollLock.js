/**
 * Robust Scroll Lock Utility for D.CARD
 * 
 * - Locks body and document scrolling on mobile (iOS Safari, Android Chrome) and desktop.
 * - Preserves the exact scroll position without jumping to the top or bouncing.
 * - Prevents layout shift by compensating for scrollbar width when scrollbar disappears.
 * - Temporarily disables smooth scrolling during restoration to prevent animated scroll transitions.
 * - Reference-counted to safely support multiple modals or modal transitions.
 */

let lockCount = 0;
let savedScrollY = 0;
let savedScrollX = 0;
let originalStyles = {
  bodyOverflow: '',
  bodyPosition: '',
  bodyTop: '',
  bodyLeft: '',
  bodyRight: '',
  bodyWidth: '',
  bodyPaddingRight: '',
  htmlOverflow: '',
};

/**
 * Lock scrolling on document/body.
 */
export function lockScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (lockCount === 0) {
    // 1. Record current scroll position
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    savedScrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;

    // 2. Measure scrollbar width to prevent horizontal layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // 3. Save original inline styles
    originalStyles = {
      bodyOverflow: document.body.style.overflow,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyLeft: document.body.style.left,
      bodyRight: document.body.style.right,
      bodyWidth: document.body.style.width,
      bodyPaddingRight: document.body.style.paddingRight,
      htmlOverflow: document.documentElement.style.overflow,
    };

    // 4. Apply fixed body lock with negative top offset
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = `-${savedScrollX}px`;
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    // Prevent layout shift if a scrollbar was visible
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  lockCount++;
}

/**
 * Unlock scrolling and restore previous position and styles.
 */
export function unlockScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (lockCount <= 0) {
    lockCount = 0;
    return;
  }

  lockCount--;

  if (lockCount === 0) {
    const restoreY = savedScrollY;
    const restoreX = savedScrollX;

    // Restore body styles
    document.body.style.position = originalStyles.bodyPosition || '';
    document.body.style.top = originalStyles.bodyTop || '';
    document.body.style.left = originalStyles.bodyLeft || '';
    document.body.style.right = originalStyles.bodyRight || '';
    document.body.style.width = originalStyles.bodyWidth || '';
    document.body.style.overflow = originalStyles.bodyOverflow || '';
    document.body.style.paddingRight = originalStyles.bodyPaddingRight || '';

    // Temporarily disable smooth scroll behavior to prevent visual animation jump
    const htmlEl = document.documentElement;
    const prevHtmlScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';

    // Instantly restore scroll position
    window.scrollTo(restoreX, restoreY);

    // Re-enable original scroll behavior on next frame
    requestAnimationFrame(() => {
      htmlEl.style.scrollBehavior = prevHtmlScrollBehavior;
    });
  }
}

/**
 * Check if scroll is currently locked.
 */
export function isScrollLocked() {
  return lockCount > 0;
}
