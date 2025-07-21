import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export default function SlideIn({ 
  children, 
  direction = 'left',
  delay = 0, 
  duration = 0.6, 
  className = "",
  threshold = 0.3
}: SlideInProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { opacity: 0, x: -50 };
      case 'right': return { opacity: 0, x: 50 };
      case 'up': return { opacity: 0, y: -50 };
      case 'down': return { opacity: 0, y: 50 };
      default: return { opacity: 0, x: -50 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case 'left': 
      case 'right': 
        return { opacity: 1, x: 0 };
      case 'up': 
      case 'down': 
        return { opacity: 1, y: 0 };
      default: return { opacity: 1, x: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialPosition()}
      animate={inView ? getAnimatePosition() : getInitialPosition()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}