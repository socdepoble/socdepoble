import React from "react";
export default function BootAntenna({
  size = 120,
  className = "",
  ariaLabel = "Bota vella que fa d'antena Wi‑Fi",
  ...rest
}) {
  return <svg role="img" aria-label={ariaLabel} width={size} height={size} viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <title>{ariaLabel}</title>

      <g stroke="#111827" strokeWidth="1.6" fill="none">
        <path d="M20 80 q10 -30 40 -30 q20 0 36 18 v18 q-30 6 -76 0 z" fill="#7C3E00" stroke="#111827" />
        <rect x="60" y="30" width="6" height="18" rx="2" fill="#374151" />
        <circle cx="63" cy="24" r="6" fill="#0EA5E9" />
        <path d="M63 12 a20 20 0 0 1 0 24" stroke="#60A5FA" strokeWidth="1.6" fill="none" />
      </g>

      <text x="10" y="18" fontFamily="sans-serif" fontSize="10" fill="#374151">…</text>
    </svg>;
}