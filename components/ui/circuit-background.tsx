'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function CircuitBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}
        />
      </div>

      {/* Circuit lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 255, 255, 0)" />
            <stop offset="50%" stopColor="rgba(0, 255, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(0, 255, 255, 0)" />
          </linearGradient>
        </defs>
        
        {/* Horizontal lines */}
        <motion.line
          x1="0" y1="20%" x2="100%" y2="20%"
          stroke="url(#circuit-gradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop", ease: "linear" }}
        />
        <motion.line
          x1="0" y1="40%" x2="100%" y2="40%"
          stroke="url(#circuit-gradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 1 }}
        />
        <motion.line
          x1="0" y1="60%" x2="100%" y2="60%"
          stroke="url(#circuit-gradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.5, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 2 }}
        />
        <motion.line
          x1="0" y1="80%" x2="100%" y2="80%"
          stroke="url(#circuit-gradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 0.5 }}
        />

        {/* Vertical lines */}
        <motion.line
          x1="20%" y1="0" x2="20%" y2="100%"
          stroke="url(#circuit-gradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 1.5 }}
        />
        <motion.line
          x1="40%" y1="0" x2="40%" y2="100%"
          stroke="url(#circuit-gradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 2.5 }}
        />
        <motion.line
          x1="60%" y1="0" x2="60%" y2="100%"
          stroke="url(#circuit-gradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4.5, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 0.8 }}
        />
        <motion.line
          x1="80%" y1="0" x2="80%" y2="100%"
          stroke="url(#circuit-gradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.2, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 1.8 }}
        />

        {/* Circuit nodes */}
        <motion.circle
          cx="20%" cy="20%" r="4"
          fill="rgba(0, 255, 255, 0.6)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop", delay: 1 }}
        />
        <motion.circle
          cx="40%" cy="40%" r="3"
          fill="rgba(0, 128, 255, 0.6)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop", delay: 2 }}
        />
        <motion.circle
          cx="60%" cy="60%" r="4"
          fill="rgba(0, 255, 255, 0.6)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatType: "loop", delay: 0.5 }}
        />
        <motion.circle
          cx="80%" cy="80%" r="3"
          fill="rgba(0, 128, 255, 0.6)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, repeatType: "loop", delay: 1.5 }}
        />
      </svg>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
    </div>
  );
}