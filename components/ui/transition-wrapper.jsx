import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const TransitionWrapper = memo(({ children, isLoading, className }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isLoading ? "loading" : "content"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

TransitionWrapper.displayName = "TransitionWrapper";