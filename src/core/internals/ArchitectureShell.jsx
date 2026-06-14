import React from 'react';

/**
 * 🛡️ [ARCH SHIELD] Architecture Shell
 * Prevents React Suspense or aggressive unmounts from destroying
 * the PowerSync and IndexedDB contexts, which causes fatal locks in Safari.
 */
export const ArchitectureShell = React.memo(({
  children
}) => {
  return <>{children}</>;
}, () => true); // Never update this component