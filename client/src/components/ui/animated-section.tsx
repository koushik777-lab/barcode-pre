import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
    // Determine if we should animate (defaults to true)
    // We use a state to ensure once it's visible, it STAYS visible.
    // Framer motion's 'once: true' is usually enough, but sometimes unmounting/remounting
    // can reset it. However, if the parent unmounts, state is lost anyway.
    // This mostly protects against viewport glitches.

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "0px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={cn("w-full transition-all duration-500", className)}
        >
            {children}
        </motion.div>
    );
}
