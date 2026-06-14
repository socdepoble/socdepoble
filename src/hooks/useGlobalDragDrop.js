import { useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../app/context/NavigationContext';
import { useModal } from '../app/context/ModalContext';

export function useGlobalDragDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const counterRef = useRef(0);
  const navigate = useNavigate();
  const { setGlobalDroppedFile, preferredAgentId } = useNavigation();
  const { openPostModal } = useModal();

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
      setGlobalDroppedFile(file);
      navigate(`/chats/${preferredAgentId || '11111111-1a1a-0000-0000-000000000000'}`);
    } else {
      openPostModal({ isPrivate: false, initialFile: file });
    }
  }, [navigate, setGlobalDroppedFile, preferredAgentId, openPostModal]);

  return {
    isDragging,
    dragProps: {
      onDragEnter: onDragEnter,
      onDragLeave: onDragLeave,
      onDragOver: onDragOver,
      onDrop: onDrop
    }
  };
}
