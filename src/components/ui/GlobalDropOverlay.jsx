import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../app/context/NavigationContext';
import { useModal } from '../../app/context/ModalContext';

export default function GlobalDropOverlay() {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const counterRef = useRef(0);
  const navigate = useNavigate();
  const { setGlobalDroppedFile, preferredAgentId } = useNavigation();
  const { openPostModal } = useModal();

  // Refs per a dependències inestables
  const navigateRef = useRef(navigate);
  const setGlobalDroppedFileRef = useRef(setGlobalDroppedFile);
  const preferredAgentIdRef = useRef(preferredAgentId);
  const openPostModalRef = useRef(openPostModal);

  useEffect(() => { navigateRef.current = navigate; }, [navigate]);
  useEffect(() => { setGlobalDroppedFileRef.current = setGlobalDroppedFile; }, [setGlobalDroppedFile]);
  useEffect(() => { preferredAgentIdRef.current = preferredAgentId; }, [preferredAgentId]);
  useEffect(() => { openPostModalRef.current = openPostModal; }, [openPostModal]);

  // Handlers estables (mai canvien)
  const onDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    counterRef.current += 1;
    if (counterRef.current === 1) setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    counterRef.current -= 1;
    if (counterRef.current === 0) setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    counterRef.current = 0;

    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const file = files[0];
    if (file.type.startsWith('image/')) {
      setGlobalDroppedFileRef.current(file);
      navigateRef.current(`/chats/${preferredAgentIdRef.current || '11111111-1a1a-0000-0000-000000000000'}`);
    } else {
      openPostModalRef.current({ isPrivate: false, initialFile: file });
    }
  }, []);

  // useEffect amb dependències ESTABLES i AbortController
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    document.addEventListener('dragenter', onDragEnter, { signal });
    document.addEventListener('dragleave', onDragLeave, { signal });
    document.addEventListener('dragover', onDragOver, { signal });
    document.addEventListener('drop', onDrop, { signal });

    return () => {
      abortController.abort();
    };
  }, [onDragEnter, onDragLeave, onDragOver, onDrop]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-sdp-z-overlay bg-sdp-theme-accent-primary/95 flex flex-col items-center justify-center text-white pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-95">
      <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mb-6 animate-pulse">
        <UploadCloud size={64} className="text-white drop-shadow-xl" />
      </div>
      <h2 className="text-4xl font-black uppercase tracking-widest drop-shadow-md">
        {t('common.drop_anar', 'Deixa Anar')}
      </h2>
    </div>
  );
}
