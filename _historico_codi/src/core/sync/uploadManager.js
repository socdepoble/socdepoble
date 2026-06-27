import { enqueue } from "./syncEngine";

export async function compressImage(file) {
  const bitmap = await createImageBitmap(file);

  const canvas = new OffscreenCanvas(1024, 1024);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(bitmap, 0, 0, 1024, 1024);

  return await canvas.convertToBlob({
    type: "image/jpeg",
    quality: 0.7,
  });
}

export function chunkFile(file, chunkSize = 256 * 1024) {
  const chunks = [];
  let offset = 0;

  while (offset < file.size) {
    chunks.push(file.slice(offset, offset + chunkSize));
    offset += chunkSize;
  }

  return chunks;
}

export async function uploadFile(file) {
  const compressed = await compressImage(file);
  const chunks = chunkFile(compressed);

  for (let i = 0; i < chunks.length; i++) {
    await enqueue({
      type: "UPLOAD_CHUNK",
      index: i,
      total: chunks.length,
      data: await chunks[i].arrayBuffer(),
    });
  }
}
