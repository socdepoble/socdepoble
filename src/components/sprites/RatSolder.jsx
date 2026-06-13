import React from "react";

export default function RatSolder({ size = 160, className = "", ariaLabel = "Ratolí reparador soldant una placa", ...rest }) {
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

      <g stroke="#111827" strokeWidth="1.4" fill="none">
        <ellipse cx="40" cy="64" rx="22" ry="12" fill="#FFEDD5" stroke="#111827" />
        <circle cx="32" cy="58" r="3" fill="#111827" />
        <rect x="80" y="56" width="44" height="20" rx="3" fill="#0F172A" stroke="#111827" />
        <path d="M100 66 l8 -6" stroke="#F97316" strokeWidth="1.6" />
        <path d="M108 60 q4 -2 8 0" stroke="#F97316" strokeWidth="1.2" fill="none" />
      </g>

      <text x="12" y="18" fontFamily="sans-serif" fontSize="10" fill="#374151">tic‑tic</text>
    </svg>
  );
}
