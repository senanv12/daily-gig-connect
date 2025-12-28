import React, { useRef } from "react";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

interface InfiniteGridBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const InfiniteGridBackground = ({ children, className }: InfiniteGridBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.3; 
  const speedY = 0.3;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative min-h-screen w-full overflow-hidden bg-background ${className || ''}`}
    >
      {/* Base grid layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>

      {/* Interactive glow layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} isActive />
      </motion.div>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-60" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const GridPattern = ({ offsetX, offsetY, isActive = false }: { offsetX: any, offsetY: any, isActive?: boolean }) => {
  return (
    <motion.svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <motion.pattern
          id={isActive ? "active-grid" : "base-grid"}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
            strokeWidth={isActive ? "1.5" : "0.5"}
            strokeOpacity={isActive ? "0.8" : "0.15"}
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${isActive ? "active-grid" : "base-grid"})`} />
    </motion.svg>
  );
};

export default InfiniteGridBackground;
