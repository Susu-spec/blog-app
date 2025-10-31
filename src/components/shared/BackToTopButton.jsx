import { useEffect, useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { HiArrowUp } from "react-icons/hi2";


/**
 * A floating button that appears after scrolling down the page,
 * allowing users to smoothly return to the top.
 *
 * This component listens to the window's scroll position and toggles
 * visibility once the user scrolls beyond 300px vertically.
 *
 * @component
 * @example
 * return (
 *   <BackToTopButton />
 * )
 */

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
      <IconButton
        position="fixed"
        bottom="9rem"
        right="10%"
        aria-label="Back to top"
        onClick={scrollToTop}
        colorScheme="teal"
        borderRadius="full"
        boxShadow="lg"
      >
        <HiArrowUp />
      </IconButton>
    )
  );
}
