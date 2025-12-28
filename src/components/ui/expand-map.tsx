"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"

interface LocationMapProps {
  location?: string
  coordinates?: string
  className?: string
}

export function LocationMap({
  location = "Bakı, Azərbaycan",
  coordinates = "40.4093° N, 49.8671° E",
  className,
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-50, 50], [8, -8])
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8])

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden cursor-pointer ${className}`}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary to-muted"
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(var(--background)/0.4)_100%)]" />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary to-muted" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--primary)/0.2)_0%,transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--accent)/0.15)_0%,transparent_50%)]" />

              <svg className="absolute inset-0 w-full h-full opacity-30">
                {/* Main roads - using foreground with opacity */}
                <line x1="0" y1="35%" x2="100%" y2="35%" stroke="hsl(var(--foreground))" strokeWidth="3" strokeOpacity="0.4" />
                <line x1="0" y1="65%" x2="100%" y2="65%" stroke="hsl(var(--foreground))" strokeWidth="2" strokeOpacity="0.3" />

                {/* Vertical main roads */}
                <line x1="30%" y1="0" x2="30%" y2="100%" stroke="hsl(var(--foreground))" strokeWidth="3" strokeOpacity="0.4" />
                <line x1="70%" y1="0" x2="70%" y2="100%" stroke="hsl(var(--foreground))" strokeWidth="2" strokeOpacity="0.3" />

                {/* Secondary streets */}
                {[20, 50, 80].map((y, i) => (
                  <line key={`h-${i}`} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="hsl(var(--foreground))" strokeWidth="1" strokeOpacity="0.15" />
                ))}
                {[15, 45, 55, 85].map((x, i) => (
                  <line key={`v-${i}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="hsl(var(--foreground))" strokeWidth="1" strokeOpacity="0.15" />
                ))}
              </svg>

              {/* Buildings - using muted-foreground */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="absolute top-[20%] left-[15%] w-12 h-16 bg-muted-foreground/20 rounded-sm" />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="absolute top-[25%] left-[35%] w-8 h-12 bg-muted-foreground/15 rounded-sm" />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="absolute top-[40%] right-[20%] w-14 h-10 bg-muted-foreground/20 rounded-sm" />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="absolute bottom-[30%] left-[50%] w-10 h-14 bg-muted-foreground/15 rounded-sm" />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="absolute bottom-[35%] right-[35%] w-16 h-8 bg-muted-foreground/20 rounded-sm" />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="absolute top-[55%] left-[25%] w-6 h-10 bg-muted-foreground/15 rounded-sm" />

              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-6 h-6 bg-primary rounded-full border-3 border-background shadow-lg" />
                  <div className="absolute inset-0 w-6 h-6 bg-primary/50 rounded-full animate-ping" />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-primary/30 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid pattern - only show when collapsed */}
        <svg className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5" strokeOpacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">

          {/* Top section */}
          <div className="flex items-start justify-between">

            <motion.div
              className="w-12 h-12 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Map Icon SVG */}
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
            </motion.div>

            {/* Status indicator */}
            <motion.div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div 
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="text-xs font-medium text-foreground">Canlı</span>
            </motion.div>
          </div>

          {/* Bottom section */}
          <div className="space-y-2">

            <motion.h3 
              className="text-xl font-semibold text-foreground"
              layout
            >
              {location}
            </motion.h3>

            <AnimatePresence>
              {isExpanded && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-muted-foreground font-mono"
                >
                  {coordinates}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Animated underline */}
            <motion.div 
              className="h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full"
              initial={{ width: "30%" }}
              animate={{ width: isHovered ? "60%" : "30%" }}
              transition={{ duration: 0.3 }}
            />
          </div>

        </div>

      </motion.div>

      {/* Click hint */}
      <motion.div 
        className="absolute bottom-4 right-4 text-xs text-muted-foreground/60"
        animate={{ opacity: isHovered ? 1 : 0 }}
      >
        Genişlətmək üçün klik edin
      </motion.div>
    </motion.div>
  )
}
