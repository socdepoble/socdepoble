/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

self.addEventListener('message', async (e: MessageEvent) => {
  const { file, tempId } = e.data;
  try {
    // Implosión térmica por GPU. El Hilo Principal ni se entera.
    const bitmap = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
    
    const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.6 });
    self.postMessage({ tempId, blob, success: true });
  } catch (err: any) {
    self.postMessage({ tempId, error: err.message, success: false });
  }
});
export {}; // Fuerza el tipado de módulo ES
