import { usePowerSyncWatchedQuery } from '@powersync/react';
import { checkStorageCapabilities } from '../utils/storageProbe';
import { useState, useEffect } from 'react';
const IOS_RAM_SAFE_LIMIT = 150;

/**
 * 🛡️ DAL (Data Access Layer) Blindado.
 * Inyecta paginación forzada en WebKit si operamos en RAM pura.
 */
export function useSafeQuery(sql, parameters = []) {
  const [isEphemeral, setIsEphemeral] = useState(false);
  useEffect(() => {
    checkStorageCapabilities().then(caps => {
      if (caps.privateMode || !caps.indexedDB && !caps.opfs) {
        setIsEphemeral(true);
      }
    });
  }, []);
  let safeSql = sql;
  if (isEphemeral && !safeSql.toLowerCase().includes('limit')) {
    safeSql = `${safeSql} LIMIT ${IOS_RAM_SAFE_LIMIT}`;
    console.warn(`🛡️ [ARCH SHIELD] LIMIT ${IOS_RAM_SAFE_LIMIT} inyectado forzosamente para prevenir Jetsam OOM Crash en Safari Private.`);
  }
  const {
    data
  } = usePowerSyncWatchedQuery(safeSql, parameters);
  return data || [];
}