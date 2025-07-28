
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
        <circle cx="12" cy="5" r="1" />
        <path d="M15 22v-4s-1-2-2-2-2 2-2 2" />
        <path d="M8.5 22V17.5" />
        <path d="M12 12.5a2.5 2.5 0 0 0 -2.5 -2.5" />
        <path d="M12 10a2.5 2.5 0 0 1 -2.5 -2.5" />
        <path d="m6.5 10-3 3 2.5 2.5" />
        <path d="M17.5 10-3 3-2.5-2.5" />
    </svg>
);

    