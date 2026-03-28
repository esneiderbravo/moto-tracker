'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Renders an animated splash screen on application load using Framer Motion.
 */
export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 1, 
              ease: "easeOut",
              type: "spring",
              bounce: 0.4
            }}
            className="relative"
          >
            <svg 
              width="140" 
              height="140" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.circle 
                cx="50" cy="50" r="42" 
                stroke="#FF5722" 
                strokeWidth="5" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 0.75 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                style={{ strokeDashoffset: "0px" }}
              />
              <motion.path 
                d="M 20 50 A 30 30 0 0 1 80 50" 
                stroke="#2C2C2C" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray="4 6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
              <motion.line 
                x1="50" y1="50" x2="72" y2="35" 
                stroke="#ffffff" 
                strokeWidth="4" 
                strokeLinecap="round"
                initial={{ rotate: -120, transformOrigin: "50px 50px" }}
                animate={{ rotate: 10 }}
                transition={{ delay: 0.7, duration: 1.2, type: "spring", bounce: 0.5 }}
              />
              <motion.circle 
                cx="50" cy="50" r="5" 
                fill="#FF5722" 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 flex flex-col items-center"
          >
            <h1 className="text-4xl font-extrabold text-white tracking-wider">
              MOTO<span className="text-primary">TRACKER</span>
            </h1>
            <p className="text-textSecondary mt-2 text-xs tracking-[0.25em] uppercase font-semibold">
              Ride. Track. Connect.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
