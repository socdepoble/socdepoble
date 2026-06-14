import React from 'react';

export const Section = ({
  id,
  title,
  subtitle,
  children,
  className = 'mb-16'
}) => (
  <section className={className} id={id}>
    {title && <h2 className="sosp-h2 mb-6">{title}</h2>}
    {subtitle && <h3 className="sosp-h3 mb-4">{subtitle}</h3>}
    {children}
  </section>
);
