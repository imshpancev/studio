import { cn } from "@/lib/utils";
import React from "react";

export const LighSportLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 400 96"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
    aria-label="LighTech"
    fontFamily="sans-serif"
    fontWeight="bold"
  >
    <path
      d="M29.5,63.2c-0.8,0-1.5-0.1-2.2-0.4l-10.6,18.3h-7.3V25.9h7.3l10.5,18.2c0.7-0.3,1.5-0.4,2.2-0.4c4.1,0,7.4,3.3,7.4,7.4S33.6,63.2,29.5,63.2z M29.5,45.5c-2.8,0-5.1,2.3-5.1,5.1s2.3,5.1,5.1,5.1s5.1-2.3,5.1-5.1S32.3,45.5,29.5,45.5z"
      fill="#ff9800"
    />
    <text x="70" y="75" fontSize="64" fill="#4287f5">
        Ligh<tspan fill="#ff9800">Tech</tspan>
    </text>
  </svg>
);