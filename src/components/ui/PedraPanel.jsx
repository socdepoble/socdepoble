import React from 'react';

const PedraPanel = ({ children, className = '', as: Component = 'article', ...props }) => {
  return (
    <Component 
      className={`bg-[var(--sp-bg-panel)] rounded-[var(--sp-radius-trellat)] overflow-hidden border-2 border-[var(--sp-border-master)] shadow-[4px_4px_0_rgba(0,0,0,0.15)] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default PedraPanel;
