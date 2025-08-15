import { useEffect, useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { HiArrowUp } from "react-icons/hi2";

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
        right="2rem"
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
