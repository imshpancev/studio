
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
        className={cn("lucide lucide-footprints", className)}
    >
      <path d="M4 16.8V11a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v5.8a2 2 0 0 1-1.2 1.8l-2.1.8a2 2 0 0 0-1.2 1.8V22" />
      <path d="M8.2 13.5A2 2 0 0 0 7 11.8V9.5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v2.3a2 2 0 0 1-1.2 1.8l-2.1.8a2 2 0 0 0-1.2 1.8V22" />
      <path d="M12.8 13.5a2 2 0 0 0-1.2-1.8V9.5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v2.3a2 2 0 0 1-1.2 1.8l-2.1.8a2 2 0 0 0-1.2 1.8V22" />
      <path d="M17 16.8V11a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v5.8a2 2 0 0 1-1.2 1.8l-2.1.8a2 2 0 0 0-1.2 1.8V22" />
    </svg>
);

    