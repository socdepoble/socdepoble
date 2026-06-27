import { useState } from 'react';
import { exportDocument } from '../export/ExportPipeline.js';

/**
 * L'Exportador Absolut 11/10 (Sóc de Poble) - PIPELINE INTEGRAT QWEN
 * Zero dependencies, dual-channel binari.
 */
export function useUnifiedExporter(docId, blocks, title) {
  const [exportState, setExportState] = useState({
    status: 'idle', // idle | normalizing | serializing | streaming | final | error
    progress: 0,
    error: null
  });

  const exportToAffinity = async () => {
    try {
      setExportState({ status: 'streaming', progress: 0, error: null });

      const ws = new WebSocket('ws://localhost:8765/mcp');
      ws.binaryType = "arraybuffer";

      await new Promise((resolve, reject) => {
        ws.onopen = () => resolve();
        ws.onerror = () => reject(new Error("No s'ha pogut establir la connexió al Bridge 11/10 (MCP)"));
      });

      // Prepare document structure for ExportPipeline
      const document = {
        metadata: { identifier: docId, title: title || 'Sense Títol', language: 'ca' },
        content: Object.values(blocks),
        toc: [] // TOC se podria derivar aquí, passat vuit com a simplificació
      };

      const result = await exportDocument(document, ws, {
        onProgress: (info) => {
          setExportState({ status: 'streaming', progress: parseFloat(info.percent), error: null });
        },
        onError: (err, context) => {
          console.error("Export Error 11/10:", err, context);
          setExportState(prev => ({ ...prev, status: 'error', error: err.message }));
        }
      });

      if (result.success) {
        setExportState({ status: 'final', progress: 100, error: null });
      } else {
        setExportState({ status: 'error', progress: 0, error: result.error?.message || "Fallada desconeguda a l'exportació" });
      }

    } catch (err) {
      setExportState(prev => ({ ...prev, status: 'error', error: err.message }));
    }
  };

  const exportToEPUB = exportToAffinity;

  return {
    exportToAffinity,
    exportToEPUB,
    exportState
  };
}
