import { useState, useCallback, useRef, useEffect } from 'react';

// EXTREME AUDIT V2 FIX: Eliminació estrica de memory leaks i stale closures.
export const useAttachmentManager = () => {
    const [attachedFile, setAttachedFile] = useState(null);
    const [attachedFilePreview, setAttachedFilePreview] = useState(null);

    // Ref master per assegurar que sempre alliberem l'últim Blob, sense dependències.
    const activePreviewRef = useRef(null);

    useEffect(() => {
        return () => {
            if (activePreviewRef.current) {
                URL.revokeObjectURL(activePreviewRef.current);
            }
        };
    }, []);

    const handleFileSelect = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Revocar incondicional de l'anterior via ref per evitar fugues
        if (activePreviewRef.current) {
            URL.revokeObjectURL(activePreviewRef.current);
        }

        setAttachedFile(file);
        if (file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setAttachedFilePreview(objectUrl);
            activePreviewRef.current = objectUrl;
        } else {
            setAttachedFilePreview(null);
            activePreviewRef.current = null;
        }
    }, []);

    const clearAttachment = useCallback(() => {
        if (activePreviewRef.current) {
            URL.revokeObjectURL(activePreviewRef.current);
        }
        setAttachedFile(null);
        setAttachedFilePreview(null);
        activePreviewRef.current = null;
    }, []);

    return { attachedFile, attachedFilePreview, handleFileSelect, clearAttachment };
};
