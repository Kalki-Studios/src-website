"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SVGs = [
  // Resistor
  (props: any) => (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 10H10L15 2L25 18L35 2L45 18L50 10H60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Capacitor
  (props: any) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M20 0V15M20 40V25M10 15H30M10 25H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  // IC (Microchip)
  (props: any) => (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="10" y="10" width="30" height="30" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M5 15H10M5 25H10M5 35H10M40 15H45M40 25H45M40 35H45M15 5V10M25 5V10M35 5V10M15 40V45M25 40V45M35 40V45" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  // Diode
  (props: any) => (
    <svg width="50" height="30" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 15H15M35 15H50M15 5V25L35 15Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M35 5V25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  // Inductor
  (props: any) => (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 10H10C11.5 4 14.5 4 15 10C15.5 16 18.5 16 20 10C21.5 4 24.5 4 25 10C25.5 16 28.5 16 30 10C31.5 4 34.5 4 35 10C35.5 16 38.5 16 40 10C41.5 4 44.5 4 45 10C45.5 16 48.5 16 50 10H60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Transistor (BJT)
  (props: any) => (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="2"/>
      <path d="M10 25H20M20 15V35M20 20L35 10V5M20 30L35 40V45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M31 37L35 40L35 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  // ESP32 / NodeMCU
  (props: any) => (
    <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="10" y="5" width="20" height="50" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="12" y="7" width="16" height="16" stroke="currentColor" strokeWidth="2"/>
      <path d="M14 9H26M14 12H26M14 15H26M14 18H26" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M10 25H5M10 30H5M10 35H5M10 40H5M10 45H5M10 50H5M30 25H35M30 30H35M30 35H35M30 40H35M30 45H35M30 50H35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="20" cy="45" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
];

const generateComponents = (count: number) => {
  // Use a grid to ensure even distribution across the screen
  const cols = 5;
  const rows = Math.ceil(count / cols);
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;

  const cells: { r: number, c: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ r, c });
    }
  }
  
  // Shuffle cells so we pick randomly if count < total cells
  cells.sort(() => Math.random() - 0.5);

  return Array.from({ length: count }).map((_, i) => {
    const cell = cells[i];
    
    // Add random jitter within the cell to make it look organic
    const jitterX = (Math.random() * 0.6 + 0.2) * cellWidth; // 20% to 80% of cell
    const jitterY = (Math.random() * 0.6 + 0.2) * cellHeight; // 20% to 80% of cell
    
    return {
      id: i,
      Svg: SVGs[i % SVGs.length],
      initialX: (cell.c * cellWidth) + jitterX,
      initialY: (cell.r * cellHeight) + jitterY,
      duration: Math.random() * 30 + 30,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.7 + 0.8,
    };
  });
};

export default function FloatingElectronics() {
  const [mounted, setMounted] = useState(false);
  const [components, setComponents] = useState<any[]>([]);

  useEffect(() => {
    setComponents(generateComponents(17));
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {components.map((comp) => {
        const { Svg, id, initialX, initialY, duration, rotation, scale } = comp;
        
        return (
          <motion.div
            key={id}
            className="absolute text-gray-300 transition-colors duration-300 hover:text-gray-600 active:text-gray-800 pointer-events-auto cursor-grab active:cursor-grabbing"
            style={{
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            initial={{ y: 0, x: 0, rotate: rotation, scale }}
            animate={{
              y: [0, -40, 0, 40, 0],
              x: [0, 30, 0, -30, 0],
              rotate: [rotation, rotation + 20, rotation - 20, rotation],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "linear",
            }}
            drag
            dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
            dragElastic={0.1}
            whileHover={{ scale: scale * 1.2 }}
            whileDrag={{ scale: scale * 1.3 }}
          >
            <Svg className="opacity-60 hover:opacity-100 transition-opacity drop-shadow-sm" />
          </motion.div>
        );
      })}
    </div>
  );
}
