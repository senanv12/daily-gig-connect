import * as React from "react"
import { motion, type Easing } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface DockProps {
  className?: string
  items: {
    icon: LucideIcon
    label: string
    onClick?: () => void
    href?: string
  }[]
}

interface DockIconButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  href?: string
  className?: string
}

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as Easing
    }
  }
}

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, label, onClick, href, className }, ref) => {
    const handleClick = () => {
      if (href) {
        if (href.startsWith('#')) {
          const element = document.querySelector(href);
          element?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = href;
        }
      }
      onClick?.();
    };

    return (
      <motion.button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "group relative flex h-12 w-12 items-center justify-center rounded-xl",
          "bg-background/80 backdrop-blur-sm border border-border/50",
          "transition-all duration-300 hover:scale-110 hover:bg-primary/10",
          "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20",
          className
        )}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        <motion.span
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          whileHover={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md border border-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {label}
        </motion.span>
      </motion.button>
    )
  }
)
DockIconButton.displayName = "DockIconButton"

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ items, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        variants={floatingAnimation}
        className={cn("relative", className)}
      >
        <motion.div
          className={cn(
            "flex items-center gap-2 rounded-2xl p-2",
            "bg-card/80 backdrop-blur-md border border-border/50",
            "shadow-lg shadow-black/5"
          )}
        >
          <motion.div className="flex items-center gap-1">
            {items.map((item, index) => (
              <DockIconButton
                key={index}
                icon={item.icon}
                label={item.label}
                onClick={item.onClick}
                href={item.href}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }
)
Dock.displayName = "Dock"

export { Dock }
