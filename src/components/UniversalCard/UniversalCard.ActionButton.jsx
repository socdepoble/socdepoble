import React from 'react';

const UniversalCardActionButton = ({ 
    variant = 'blue', 
    onClick, 
    children, 
    className = '',
    title
}) => {
    // Fixed height of 42px matches the original "Connectar" button height.
    // We use flex-col to easily support either 1 line (Connectar) or 2 lines (Date/Time)
    const baseClasses = "h-[42px] px-5 rounded-full flex flex-col items-center justify-center transition-all active:scale-[0.98] shadow-sm pointer-events-auto cursor-pointer";
    
    const variants = {
        blue: "bg-[#3EA3F5] hover:bg-[#5BB0FA] text-white",
        orange: "bg-[#ea580c] hover:bg-[#c2410c] text-[#111111]"
    };

    return (
        <button 
            className={`${baseClasses} ${variants[variant] || variants.blue} ${className}`}
            onClick={onClick}
            title={title}
        >
            {children}
        </button>
    );
};

export default UniversalCardActionButton;
