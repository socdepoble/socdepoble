import React from "react";
export default function EmberDust({
  size = 160,
  className = "",
  ariaLabel = "Pols de cendra que formen icones d'error",
  ...rest
}) {
  return <svg role="img" aria-label={ariaLabel} width={size} height={size * 80 / 160} viewBox="0 0 160 80" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      <title>{ariaLabel}</title>

      <g fill="#F97316" opacity="0.9" stroke="#111827" strokeWidth="0.8">
        <circle cx="30" cy="30" r="2.6" />
        <circle cx="44" cy="36" r="2.2" />
        <path d="M60 28 l6 6 10 -10" stroke="#111827" strokeWidth="1.2" fill="none" />
        <rect x="90" y="24" width="6" height="6" rx="1" />
        <path d="M110 34 q6 -6 12 0" stroke="#111827" strokeWidth="1.2" fill="none" />
      </g>

      <text x="12" y="18" fontFamily="sans-serif" fontSize="10" fill="#374151">*error*</text>
    </svg>;
}