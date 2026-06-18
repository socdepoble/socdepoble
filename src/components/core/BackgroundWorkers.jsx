import { memo } from 'react';
import { useTabReconciliation } from '../../hooks/useTabReconciliation';
import { useBlindatgeOPFS } from '../../hooks/useBlindatgeOPFS';
import { useVersionWatchdog } from '../../hooks/useVersionWatchdog';

function BackgroundWorkers() {
  useTabReconciliation();
  useBlindatgeOPFS();
  useVersionWatchdog();
  return null;
}

export default memo(BackgroundWorkers);
