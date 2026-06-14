import React from "react";
export default function ChickenRouter({
  size = 160,
  className = "",
  ariaLabel = "Gallina amb auriculars picotejant un cable",
  ...rest
}) {
  return <svg role="img" aria-label={ariaLabel} width={size} height={size * 120 / 160} viewBox="0 0 160 120" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <title>{ariaLabel}</title>

      <g stroke="#111827" strokeWidth="1.6" fill="none">
        <ellipse cx="48" cy="70" rx="28" ry="18" fill="#FFEDD5" stroke="#111827" />
        <circle cx="36" cy="62" r="4" fill="#111827" />
        <path d="M56 62 q6 -6 12 0" stroke="#F97316" strokeWidth="2" fill="none" />
        <path d="M24 50 q12 -8 24 0" stroke="#94A3B8" strokeWidth="3" fill="none" />
        <circle cx="24" cy="50" r="6" fill="#94A3B8" stroke="#111827" />
        <circle cx="48" cy="50" r="6" fill="#94A3B8" stroke="#111827" />
        <path d="M76 78 q20 6 40 -6" stroke="#374151" strokeWidth="2" fill="none" />
        <rect x="112" y="60" width="28" height="18" rx="3" fill="#0EA5E9" stroke="#0B1220" />
        <circle cx="126" cy="69" r="2" fill="#fff" />
      </g>

      <text x="12" y="18" fontFamily="sans-serif" fontSize="10" fill="#374151">clac‑clac</text>
    </svg>;
}