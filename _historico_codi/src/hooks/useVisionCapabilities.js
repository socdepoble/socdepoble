import { useState, useEffect } from 'react';

export const useVisionCapabilities = () => {
  const [supportsWebGPU, setSupportsWebGPU] = useState(false);
  
  useEffect(() => {
    const checkGPU = () => {
      // Check if navigator.gpu exists and has requestAdapter
      if ('gpu' in navigator && navigator.gpu && typeof navigator.gpu.requestAdapter === 'function') {
        setSupportsWebGPU(true);
      } else {
        setSupportsWebGPU(false);
      }
    };
    checkGPU();
  }, []);
  
  return supportsWebGPU;
};
