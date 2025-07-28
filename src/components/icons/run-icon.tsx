
import { cn } from "@/lib/utils";
import React from "react";

export const RunIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={cn("lucide lucide-run", className)}
    >
        <circle cx="12" cy="4" r="1" />
        <path d="M15.5 8.5L12 12.5 10.5 11" />
        <path d="M9.5 17.5L8.5 14" />
        <path d="m14.5 17.5 1-3.5" />
        <path d="M7 12.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
        <path d="M17 12.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
    </svg>
);
