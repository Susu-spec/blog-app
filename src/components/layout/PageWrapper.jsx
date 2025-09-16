import { easeOut, motion } from "framer-motion";
import { useLocation } from "react-router";

export default function PageWrapper({ children }) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.8, ease: easeOut }}
      className="w-full min-h-[100dvh]"
    >
      {children}
    </motion.div>
  );
}
