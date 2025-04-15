"use client"

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface RotatingWordsProps {
  words: string[];
  className?: string;
  style?: React.CSSProperties; // Add this line
  interval?: number;
}

export function RotatingWords({ 
  words, 
  className = "", 
  style = {},  // Add this line
  interval = 2000 
}: RotatingWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [words.length, interval]);
  
  return (
    <span className="relative inline-block min-w-[120px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          className={`absolute ${className}`}
          style={style}  // Add this line
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

