
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
        <path d="M13 18m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
        <path d="M8.5 13.5l-2.5 -6l-3.5 4l2.5 4l3.5 -2"></path>
        <path d="M12.5 13.5l2.5 -6l3.5 4l-2.5 4l-3.5 -2"></path>
        <path d="M5.5 13.5l2.5 -2.5l2.5 2.5"></path>
    </svg>
);
