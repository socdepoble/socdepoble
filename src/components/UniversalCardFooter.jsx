import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';

const UniversalCardFooter = ({
    item,
    cardVariant,
    navigate
}) => {
    // Determine the button text based on variant
    let buttonText = "LLEGIR MÉS";
    let icon = <ChevronRight size={18} strokeWidth={2.5}/>;
    
    if (cardVariant === 'mercat' || cardVariant === 'market') {
        buttonText = "INTERESSAT";
        icon = <Plus size={18} strokeWidth={2.5}/>;
    } else if (cardVariant === 'pobles') {
        buttonText = "VISITAR POBLE";
    } else if (item?.type === 'tramit') {
        buttonText = "TRAMITAR";
    }

    const handleClick = (e) => {
        e.stopPropagation();
        const id = item?.uuid || item?.id;
        
        if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${id}`);
        } else if (cardVariant === 'pobles') {
            navigate(`/pobles/${id || item?.town_id}`);
        } else {
            navigate(`/post/${id}`);
        }
    };

    return (
        <div className="px-4 pb-4 pt-2 bg-white dark:bg-[#0a0a0a] rounded-b-[28px]">
            <button 
                onClick={handleClick}
                className="w-full h-[52px] flex items-center justify-center gap-2 bg-[#111827] dark:bg-white text-white dark:text-gray-900 rounded-[28px] font-black text-[14px] tracking-[0.1em] uppercase hover:bg-black/80 active:scale-95 transition-all shadow-md"
            >
                {icon}
                {buttonText}
            </button>
        </div>
    );
};

export default UniversalCardFooter;
