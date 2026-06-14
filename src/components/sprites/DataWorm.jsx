import React from "react";
export default function DataWorm({
  size = 160,
  className = "",
  ariaLabel = "Cuc de dades que expulsa bits brillants",
  ...rest
}) {
  return <svg role="img" aria-label={ariaLabel} width={size} height={size * 80 / 160} viewBox="0 0 160 80" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <title>{ariaLabel}</title>

      <g stroke="#111827" strokeWidth="1.2" fill="none">
        <path d="M10 50 q20 -20 40 0 q20 20 40 0 q20 -20 60 0" fill="#60A5FA" stroke="#111827" />
        <circle cx="30" cy="42" r="4" fill="#fff" />
        <g fill="#FFEDD5">
          <rect x="110" y="30" width="6" height="6" rx="1" />
          <rect x="118" y="26" width="4" height="4" rx="1" />
          <rect x="124" y="34" width="3" height="3" rx="0.8" />
        </g>
      </g>

      <text x="12" y="18" fontFamily="sans-serif" fontSize="10" fill="#374151">chew‑bits</text>
    </svg>;
}