/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const LazyHtmlRenderer = forwardRef(({ htmlContent, className, onClick }, ref) => {
    const internalContainerRef = useRef(null);
    const sentinelRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Expose internal ref to parent
    useImperativeHandle(ref, () => internalContainerRef.current);

    // Parse HTML to nodes whenever it changes
    useEffect(() => {
        if (!htmlContent) {
            setNodes([]);
            setCurrentIndex(0);
            if (internalContainerRef.current) internalContainerRef.current.innerHTML = '';
            return;
        }

        // Trellat: Molí Fariner (Lazy Chunking)
        // Ensures massive strings (e.g. 500KB Genotip) do not block main thread.
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const parsedNodes = Array.from(doc.body.childNodes);
        
        // Wipe existing content carefully to keep React refs intact if needed
        if (internalContainerRef.current) {
            // Remove everything except the sentinel (which React controls)
            Array.from(internalContainerRef.current.childNodes).forEach(child => {
                if (child !== sentinelRef.current) {
                    internalContainerRef.current.removeChild(child);
                }
            });
        }
        
        setNodes(parsedNodes);
        setCurrentIndex(0);
    }, [htmlContent]);

    // Handle chunk rendering via IntersectionObserver
    useEffect(() => {
        if (nodes.length === 0 || currentIndex >= nodes.length) return;

        const handleIntersect = (entries) => {
            const sentinel = entries[0];
            if (sentinel.isIntersecting) {
                // Next chunk size (adjustable: larger = faster load but more thread lock)
                const CHUNK_SIZE = 5; 
                const fragment = document.createDocumentFragment();
                let nextIndex = currentIndex;
                
                for (let i = 0; i < CHUNK_SIZE && nextIndex < nodes.length; i++, nextIndex++) {
                    fragment.appendChild(nodes[nextIndex]);
                }
                
                if (internalContainerRef.current) {
                    // Insert before the sentinel
                    if (sentinelRef.current) {
                        internalContainerRef.current.insertBefore(fragment, sentinelRef.current);
                    } else {
                        internalContainerRef.current.appendChild(fragment);
                    }
                    
                    // Fire an event to notify parents (e.g. for TOC <pre> modifications)
                    const event = new CustomEvent('html-chunk-rendered', { 
                        bubbles: true, 
                        detail: { currentIndex, nextIndex, total: nodes.length }
                    });
                    internalContainerRef.current.dispatchEvent(event);
                }
                
                setCurrentIndex(nextIndex);
            }
        };

        const observer = new IntersectionObserver(handleIntersect, {
            root: null,
            // Preload massively before it enters viewport to avoid stuttering on scroll
            rootMargin: '1200px', 
            threshold: 0
        });

        // Initial paint kickstart: render first chunk manually to provide layout for the sentinel
        if (currentIndex === 0) {
            const INITIAL_CHUNK = Math.min(8, nodes.length); // Enough to fill the first screen
            const fragment = document.createDocumentFragment();
            let nextIndex = 0;
            
            for (let i = 0; i < INITIAL_CHUNK; i++, nextIndex++) {
                fragment.appendChild(nodes[nextIndex]);
            }
            
            if (internalContainerRef.current) {
                if (sentinelRef.current) {
                    internalContainerRef.current.insertBefore(fragment, sentinelRef.current);
                } else {
                    internalContainerRef.current.appendChild(fragment);
                }
                
                const event = new CustomEvent('html-chunk-rendered', { 
                    bubbles: true, 
                    detail: { currentIndex: 0, nextIndex, total: nodes.length }
                });
                internalContainerRef.current.dispatchEvent(event);
            }
            setCurrentIndex(nextIndex);
        }

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [nodes, currentIndex]);

    return (
        <div 
            ref={internalContainerRef} 
            className={className} 
            onClick={onClick}
        >
            {/* Sentinel */}
            {currentIndex < nodes.length && (
                <div 
                    ref={sentinelRef} 
                    className="w-full flex items-center justify-center p-8 opacity-40 transition-opacity"
                    aria-hidden="true"
                >
                    <div className="w-6 h-6 border-2 border-[var(--theme-accent-primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
});

LazyHtmlRenderer.displayName = 'LazyHtmlRenderer';

export default LazyHtmlRenderer;
