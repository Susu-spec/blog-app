/**
 * @fileoverview Scrolls the window to the top when the route changes.
 */

import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * ScrollToTop component — automatically scrolls the window to the top
 * whenever the route (pathname) changes.
 *
 * This ensures that navigation between pages starts from the top
 * rather than retaining the previous scroll position.
 *
 *  @returns {null} This component does not render any UI.
 **/

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
