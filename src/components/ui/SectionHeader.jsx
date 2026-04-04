import React from 'react';

const SectionHeader = ({ title, children, className = '', ...props }) => {
    return (
        <header className={`section-header ${className}`.trim()} {...props}>
            <h3>{title}</h3>
            {children}
        </header>
    );
};

export default SectionHeader;
