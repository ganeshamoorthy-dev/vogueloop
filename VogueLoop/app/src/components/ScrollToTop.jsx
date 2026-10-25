import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component:
 * 1. Resets scroll position to (0, 0) upon any route navigation.
 * 2. If a hash is provided (e.g., /#how-it-works), scrolls smoothly to the target element.
 * 3. Solves the issue where navigating away from an anchor section leaves the new page scrolled down.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Remove leading '#' and search for the target ID
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        // Small delay to ensure the DOM has rendered if navigating across pages
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
        return;
      }
    }

    // Default: Reset scroll to very top on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
