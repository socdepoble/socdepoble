import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ textToCopy, className = "" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof textToCopy === 'string') {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    };

    return (
        <button 
            onClick={handleCopy}
            className={`flex items-center justify-center transition-colors ${className}`}
            title="Copiar text"
            type="button"
        >
            {copied ? <Check size={20} className="text-white" /> : <Copy size={20} className="text-white" />}
        </button>
    );
};

export default CopyButton;
