import React from "react";
export default function SnailCable({
  size = 160,
  className = "",
  ariaLabel = "Caragol que arrossega un cable amb espurnes",
  ...rest
}) {
  return <svg role="img" aria-label={ariaLabel} width={size} height={size * 80 / 160} viewBox="0 0 160 80" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <title>{ariaLabel}</title>

      <g stroke="#111827" strokeWidth="1.4" fill="none">
        <path d="M18 48 q20 -18 40 0 q20 18 40 0" fill="#FDE68A" stroke="#111827" />
        <circle cx="40" cy="40" r="6" fill="#F3F4F6" />
        <path d="M80 56 q30 6 60 -6" stroke="#374151" strokeWidth="2" />
        <g fill="#F97316">
          <circle cx="120" cy="48" r="2" />
          <circle cx="126" cy="44" r="1.6" />
        </g>
      </g>

      <text x="12" y="18" fontFamily="sans-serif" fontSize="10" fill="#374151">scrrr</text>
    </svg>;
}