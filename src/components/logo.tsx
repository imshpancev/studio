import { cn } from "@/lib/utils";
import React from "react";

export const LighSportLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 400 96"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(className)}
    aria-label="The LighSport"
    fontFamily="sans-serif"
  >
    <path
      d="M36.12,40.16c-3.76,0-7.14,1.4-9.74,3.78l-2.61-4.52h-6.22V95h7.24V63.2c0-5.7,3.13-10.18,7.91-10.18c4.78,0,7.91,4.48,7.91,10.18V95h7.24V59.38C50.04,47.79,44.1,40.16,36.12,40.16z"
      fill="#ff9800"
    ></path>
    <text
      x="70"
      y="75"
      fontSize="58"
      fill="#4287f5"
      fontWeight="bold"
    >
      LighSport
    </text>
  </svg>
);
