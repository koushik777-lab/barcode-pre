import { cn } from "@/lib/utils";
import React from "react";

interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "glow" | "glow-strong";
}

export function GradientText({ children, className, variant = "default" }: GradientTextProps) {
    const variants = {
        default: "bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600",
        glow: "text-glow text-white",
        "glow-strong": "text-glow-strong text-orange-500"
    }

    return (
        <span className={cn(variants[variant], className)}>
            {children}
        </span>
    );
}
