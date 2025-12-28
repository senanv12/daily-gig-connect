import React, { useRef } from "react";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

interface HeroGridBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroGridBackground = ({ children, className }: HeroGridBackgroundProps) => {
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

  const speedX = 0.5; 
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className || ''}`}
    >
      {/* Base grid layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>

      {/* Interactive glow layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} isActive />
      </motion.div>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-light/50 via-background/80 to-secondary/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};

const GridPattern = ({ offsetX, offsetY, isActive = false }: { offsetX: any, offsetY: any, isActive?: boolean }) => {
  return (
    <motion.svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <motion.pattern
          id={isActive ? "hero-active-grid" : "hero-base-grid"}
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
            strokeOpacity={isActive ? "0.9" : "0.2"}
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${isActive ? "hero-active-grid" : "hero-base-grid"})`} />
    </motion.svg>
  );
};

export default HeroGridBackground;
