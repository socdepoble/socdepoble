import React from 'react';
import { Button } from '../Button/Button';

const UniversalCardActionButton = ({ 
    variant = 'blue', 
    onClick, 
    children, 
    className = '',
    title,
    ariaLabel,
    leftIcon
}) => {
    const intentMap = {
        blue: 'canonic',
        orange: 'accent-dark'
    };

    return (
        <Button 
            intent={intentMap[variant] || 'canonic'}
            shape="pill"
            size="touch"
            onClick={onClick}
            className={`items-center justify-center border-none !h-[40px] px-4 ${className}`}
            title={title}
            aria-label={ariaLabel || title || "Acció"}
            leftIcon={leftIcon}
        >
            {children}
        </Button>
    );
};

export default UniversalCardActionButton;
