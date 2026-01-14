import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    hoverEffect?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({
    children,
    className,
    hoverEffect = true,
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            whileHover={hoverEffect ? { scale: 1.02, y: -4 } : undefined}
            transition={{ duration: 0.3 }}
            className={cn(
                "glass-premium p-6 rounded-2xl border border-orange-500/30 backdrop-blur-md",
                hoverEffect && "hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/10",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
