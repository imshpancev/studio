
import { cn } from "@/lib/utils";
import React from "react";

export const TheLighSportLogo = ({ className }: { className?: string }) => (
    <div className={cn("flex items-center gap-2", className)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-10 w-10">
            <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/>
            <path d="M7.07 14.94c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3"/>
        </svg>
        <span className="text-3xl font-bold tracking-tighter" style={{ color: 'hsl(var(--primary))' }}>
            The Ligh<span style={{ color: 'hsl(var(--accent))' }}>Sport</span>
        </span>
    </div>
);
