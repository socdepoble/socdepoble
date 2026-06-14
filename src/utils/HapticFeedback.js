/**
 * HapticFeedback.js - Protocol "El Batec"
 * Standardized vibration patterns for Sóc de Poble.
 */

const Haptics = {
  // Tecla suau (clic botó)
  light: [10],
  // Acció confirmada (èxit)
  success: [20, 50, 20],
  // Avís/Error (atenció)
  warning: [100, 50, 100],
  // El Batec (Sincronització Rhizome)
  heartbeat: [10, 500, 10],
  // Mètode per disparar el batec (NOMÉS si hi ha interacció prèvia)
  trigger: pattern => {
    if ('vibrate' in navigator) {
      // El navegador bloqueja vibra si no hi ha gest d'usuari
      const hasInteracted = navigator.userActivation && navigator.userActivation.hasBeenActive;
      if (hasInteracted) {
        navigator.vibrate(pattern);
      } else {
        // [SILENCE] Waiting for user gesture
      }
    }
  }
};
export default Haptics;