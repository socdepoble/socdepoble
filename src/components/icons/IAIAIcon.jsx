import React from "react";

const IAIAIcon = ({ size = 28, color = "currentColor", className = "", ...props }) => {
  return (
    <span
      className={`iaia-icon-official ${className}`}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: color === "currentColor" ? "var(--color-primary, #00D2FF)" : color,
        maskImage: "url('/assets/avatars/iaia_silhouette_official.png')",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: "url('/assets/avatars/iaia_silhouette_official.png')",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        ...props.style
      }}
      {...props}
    />
  );
};

export default IAIAIcon;
