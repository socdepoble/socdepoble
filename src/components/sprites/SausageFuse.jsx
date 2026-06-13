import React from "react";

export default function SausageFuse({ size = 160, className = "", ariaLabel = "Llonganissa fusible que fuma", ...rest }) {
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={size}
      height={(size * 80) / 160}
      viewBox="0 0 160 80"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{ariaLabel}</title>
      <defs>
        <linearGradient id="sf-g1" x1="0" x2="1">
          <stop offset="0" stopColor="#D97706" />
          <stop offset="1" stopColor="#FFB86B" />
        </linearGradient>
      </defs>

      <g fill="none" stroke="#111827" strokeWidth="2">
        <path d="M10 40 q30 -18 60 0 q30 18 60 0" fill="url(#sf-g1)" strokeLinejoin="round" />
        <rect x="140" y="34" width="10" height="12" rx="2" fill="#7C3E00" stroke="#111827" />
        <g transform="translate(135,20)" fill="#374151" opacity="0.9">
          <ellipse cx="8" cy="8" rx="8" ry="4" />
          <path d="M2 6 q6 -6 12 0" stroke="#111827" strokeWidth="1.2" fill="none" />
        </g>
      </g>

      <g aria-hidden="true" fill="#F3F4F6" fontSize="10" fontFamily="sans-serif">
        <text x="12" y="18">pssssh</text>
      </g>
    </svg>
  );
}
