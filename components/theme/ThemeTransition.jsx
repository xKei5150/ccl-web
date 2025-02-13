"use client";

import { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeTransition({ children, className = "" }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Wrap without animation for static content
export function ThemeTransitionStatic({ children, className = "" }) {
  return <Fragment>{children}</Fragment>;
}