import React from "react";

export default function SundialCron({ size = 140, className = "", ariaLabel = "Rellotge de sol que marca notificacions", ...rest }) {
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={size}
      height={size}
      viewBox="0 0 140 140"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{ariaLabel}</title>

      <g stroke="#111827" strokeWidth="1.4" fill="none">
        <circle cx="70" cy="70" r="44" fill="#FDE68A" stroke="#111827" />
        <rect x="68" y="30" width="4" height="40" fill="#7C3E00" />
        <circle cx="70" cy="70" r="4" fill="#111827" />
        <g fill="#374151" fontSize="10" fontFamily="sans-serif">
          <text x="70" y="18" textAnchor="middle">ding</text>
        </g>
      </g>
    </svg>
  );
}
