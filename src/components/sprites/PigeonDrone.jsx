import React from "react";

export default function PigeonDrone({ size = 160, className = "", ariaLabel = "Coloms amb petites càmeres com drons", ...rest }) {
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={size}
      height={(size * 100) / 160}
      viewBox="0 0 160 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{ariaLabel}</title>

      <g stroke="#111827" strokeWidth="1.2" fill="none">
        <ellipse cx="40" cy="56" rx="18" ry="10" fill="#F3F4F6" />
        <circle cx="36" cy="52" r="3" fill="#111827" />
        <rect x="58" y="44" width="18" height="10" rx="2" fill="#94A3B8" />
        <path d="M66 44 v-8" stroke="#111827" />
        <ellipse cx="100" cy="56" rx="18" ry="10" fill="#F3F4F6" />
        <circle cx="96" cy="52" r="3" fill="#111827" />
        <path d="M58 36 q20 -12 40 0" stroke="#60A5FA" strokeWidth="1.2" fill="none" />
      </g>

      <text x="12" y="18" fontFamily="sans-serif" fontSize="10" fill="#374151">brrr</text>
    </svg>
  );
}
