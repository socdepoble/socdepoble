import React from 'react';
export default function ButtonTrellat({
  label,
  onClick,
  icon: Icon,
  disabled = false,
  type = "button",
  className = "",
  intent = "primary"
}) {
  const intentColors = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center min-w-[56px] min-h-[56px] rounded-full font-semibold px-4 transition-all
                  will-change-transform focus:outline-none focus-visible:ring-2 active:scale-95 touch-manipulation disabled:opacity-50
                  ${intentColors[intent] || intentColors.primary} ${className}`} style={{
    transform: 'translateZ(0)'
  }}>
      {Icon && <Icon className="w-6 h-6 pointer-events-none mr-2" aria-hidden="true" />}
      <span className="pointer-events-none font-bold uppercase">{label}</span>
    </button>;
}