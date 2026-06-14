import React from "react";
export default function PixelPet({
  size = 140,
  className = "",
  ariaLabel = "Píxel el gos‑ratolí amb pendrive",
  ...rest
}) {
  return <svg role="img" aria-label={ariaLabel} width={size} height={size * 100 / 140} viewBox="0 0 140 100" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <title>{ariaLabel}</title>

      <g stroke="#111827" strokeWidth="1.6" fill="none">
        <ellipse cx="48" cy="64" rx="28" ry="16" fill="#8B5E3C" stroke="#111827" />
        <circle cx="36" cy="56" r="4" fill="#0EA5E9" />
        <path d="M60 60 q10 -6 20 0" stroke="#111827" fill="none" />
        <path d="M18 68 q-6 10 10 18" stroke="#111827" strokeWidth="2" fill="none" />
        <rect x="92" y="56" width="18" height="8" rx="2" fill="#111827" />
        <path d="M100 64 v8" stroke="#111827" strokeWidth="1.2" />
      </g>

      <text x="10" y="18" fontFamily="sans-serif" fontSize="10" fill="#0EA5E9">bip‑bip</text>
    </svg>;
}