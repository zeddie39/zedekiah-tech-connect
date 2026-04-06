import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  
  // Handle Android hardware back button
  useAndroidBackButton();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
