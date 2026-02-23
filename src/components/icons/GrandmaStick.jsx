import React from 'react';

const GrandmaStick = ({ size = 28, color = "currentColor", strokeWidth = 2, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Head */}
      <circle cx="12" cy="7" r="3" />
      {/* Hair bun */}
      <circle cx="12" cy="3.5" r="1.5" />
      {/* Body / Dress */}
      <path d="M12 10c-3 0-5 2-5 5v5h10v-5c0-3-2-5-5-5z" />
      {/* Stick / Cane */}
      <path d="M18 10v10" />
      <path d="M17 10h2" />
    </svg>
  );
};

export default GrandmaStick;
