// No React hooks needed for this standalone hook logic unless we use state/effect, but here we don't.


const useTrellatPersist = () => {
  const requestPersist = async () => {
    if (navigator.storage?.persist) {
      const persisted = await navigator.storage.persisted();
      if (!persisted) {
        const granted = await navigator.storage.persist();
        console.log('Persistència concedida:', granted);
      }
    }
  };

  // Battery shield
  const checkBattery = () => {
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        if (battery.level < 0.2 || battery.chargingTime === Infinity) {
          // Pause sync
          window.dispatchEvent(new CustomEvent('battery-low'));
        }
      });
    }
  };

  return { requestPersist, checkBattery };
};

export default useTrellatPersist;
