import { useState, useEffect } from 'react';

export function useSoftConnectionStatus() {
  const [status, setStatus] = useState("ok");

  useEffect(() => {
    const update = () => {
      if (!navigator.onLine) {
        setStatus("reconnecting");
      } else {
        setStatus("ok");
      }
    };

    // Initial check
    update();

    window.addEventListener("offline", update);
    window.addEventListener("online", update);

    return () => {
      window.removeEventListener("offline", update);
      window.removeEventListener("online", update);
    };
  }, []);

  return status;
}
