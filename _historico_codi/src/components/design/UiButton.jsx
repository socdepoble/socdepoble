import React from "react";

const VARIANT_CLASS = {
  primary: "bg-primary text-white hover:brightness-110",
  secondary: "bg-secondary text-black hover:brightness-110",
  ghost: "bg-transparent text-theme-text border border-border-master hover:bg-white/10",
};

const SIZE_CLASS = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const UiButton = React.forwardRef(function UiButton(
  { variant = "primary", size = "md", className = "", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-tactile font-bold transition will-change-transform",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
        "active:scale-[0.98]",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      ].join(" ")}
      {...props}
    />
  );
});

export default UiButton;
