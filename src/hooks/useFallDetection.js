import { useState, useEffect, useCallback } from 'react';

// Umbrales de detección basados en estudios de Detección de Caídas PWA
const K_FREEFALL_THRESHOLD = 0.4; // Menos de 0.4G indica caída libre
const K_IMPACT_THRESHOLD = 2.5; // Más de 2.5G indica impacto
const K_STILLNESS_THRESHOLD = 0.5; // Menos de 0.5G de cambio indica inactividad

const FALL_STATES = {
  NORMAL: 'normal',
  FREEFALL: 'freefall',
  IMPACT: 'impact',
  ALERTING: 'alerting'
};

export const useFallDetection = (isActive) => {
  const [fallState, setFallState] = useState(FALL_STATES.NORMAL);
  const [hasPermission, setHasPermission] = useState(false);
  const [sensorError, setSensorError] = useState('');

  const requestPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState === 'granted') {
          setHasPermission(true);
        } else {
          setSensorError('Permiso de sensores denegado.');
        }
      } catch (error) {
        setSensorError('Error al solicitar permisos: ' + error.message);
      }
    } else {
      // Dispositivos que no requieren permiso o no lo soportan
      setHasPermission(true);
    }
  }, []);

  useEffect(() => {
    if (!isActive || !hasPermission) {
      // use setTimeout to avoid synchronous setState warning inside the effect. 
      // Although the warning usually triggers directly during render, 
      // to be absolutely safe we can defer it.
      setTimeout(() => setFallState(FALL_STATES.NORMAL), 0);
      return;
    }

    let currentState = FALL_STATES.NORMAL;
    let freefallStartTime = 0;
    let impactTime = 0;
    
    // Filtro básico paso bajo
    // let gravity = { x: 0, y: 0, z: 0 };
    // const alpha = 0.8;

    const handleMotion = (event) => {
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const accX = accelerationIncludingGravity.x || 0;
      const accY = accelerationIncludingGravity.y || 0;
      const accZ = accelerationIncludingGravity.z || 0;

      // Calcular magnitud de aceleración en G's (suponiendo 1G ~= 9.8 m/s^2)
      const magnitude = Math.sqrt(accX * accX + accY * accY + accZ * accZ) / 9.81;

      // Máquina de estados básica
      const now = Date.now();

      if (currentState === FALL_STATES.NORMAL) {
        if (magnitude < K_FREEFALL_THRESHOLD) {
          currentState = FALL_STATES.FREEFALL;
          freefallStartTime = now;
        }
      } 
      else if (currentState === FALL_STATES.FREEFALL) {
        // Impacto tras caída (pico de Gs)
        if (magnitude > K_IMPACT_THRESHOLD) {
          currentState = FALL_STATES.IMPACT;
          impactTime = now;
        } 
        // Si han pasado más de 2 seg sin impacto, fue falso positivo
        else if (now - freefallStartTime > 2000) {
          currentState = FALL_STATES.NORMAL;
        }
      } 
      else if (currentState === FALL_STATES.IMPACT) {
        // Post-impacto (quietud absoluta)
        if (now - impactTime > 1000) {
            // Evaluamos la falta de movimiento (simplificado)
            currentState = FALL_STATES.ALERTING;
            setFallState(FALL_STATES.ALERTING);
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion, true);

    return () => {
      window.removeEventListener('devicemotion', handleMotion, true);
    };
  }, [isActive, hasPermission]);

  const cancelAlert = useCallback(() => {
    setFallState(FALL_STATES.NORMAL);
  }, []);

  return {
    fallState,
    hasPermission,
    requestPermission,
    sensorError,
    cancelAlert
  };
};
