import { useState, useEffect, useCallback } from 'react';

export const useIAIASpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [rate, setRate] = useState(1.0); // velocitat IAIA

  const speak = useCallback((text, lang = 'ca-ES') => {  // AVL valencià
    if (!('speechSynthesis' in window)) return;

    // Atura qualsevol parla anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.1; // to IAIA càlid
    utterance.volume = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  }, [rate]);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.pause();
    setIsSpeaking(false);
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    setIsSpeaking(true);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentUtterance(null);
  }, []);

  // Neteja al desmuntar
  useEffect(() => () => stop(), [stop]);

  return { speak, pause, resume, stop, isSpeaking, rate, setRate };
};
