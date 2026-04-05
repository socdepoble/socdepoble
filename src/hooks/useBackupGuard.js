import { useState, useEffect, useCallback } from 'react';

const BACKUP_WARN_DAYS   = 5; // Avisa al dia 5
const BACKUP_URGENT_DAYS = 6; // Alarma al dia 6

export function useBackupGuard() {
  const [backupStatus, setBackupStatus] = useState(() => {
    if (typeof localStorage === 'undefined') return 'ok';
    const lastBackup  = parseInt(localStorage.getItem('last_backup_ts') || '0', 10);
    const lastOpen    = parseInt(localStorage.getItem('last_open_ts')   || Date.now().toString(), 10);
    const now = Date.now();
    
    // Convert timestamp diffs to days
    const daysSinceBackup = (now - lastBackup) / 86_400_000;
    const daysSinceOpen   = (now - lastOpen)   / 86_400_000;

    // El riesgo es el máximo entre los días que han pasado desde el backup y la inactividad real de la PWA
    const riskDays = Math.max(daysSinceBackup, daysSinceOpen);

    if (riskDays >= BACKUP_URGENT_DAYS) return 'urgent';
    if (riskDays >= BACKUP_WARN_DAYS) return 'warn';
    return 'ok';
  });

  useEffect(() => {
    // Actualizamos timestamp de última apertura
    localStorage.setItem('last_open_ts', Date.now().toString());
  }, []);

  const markBackupDone = useCallback(() => {
    localStorage.setItem('last_backup_ts', Date.now().toString());
    setBackupStatus('ok');
  }, []);

  return { backupStatus, markBackupDone };
}
