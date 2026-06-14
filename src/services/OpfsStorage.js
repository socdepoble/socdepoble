// src/services/OpfsStorage.js

export class OpfsStorage {
  async init() {
    this.root = await navigator.storage.getDirectory();
  }
  async guardarVector(id, vector) {
    const vectorsDir = await this.root.getDirectoryHandle('vectors', {
      create: true
    });
    const fileHandle = await vectorsDir.getFileHandle(`${id}.bin`, {
      create: true
    });
    const writable = await fileHandle.createWritable();
    // Suposem que el vector és un Float32Array o Uint8Array
    await writable.write(vector);
    await writable.close();
  }
  async esborrarVector(id) {
    const vectorsDir = await this.root.getDirectoryHandle('vectors', {
      create: false
    });
    await vectorsDir.removeEntry(`${id}.bin`);
  }
  async guardarFitxer(nom, data) {
    const fileHandle = await this.root.getFileHandle(nom, {
      create: true
    });
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }
  async carregarFitxer(nom) {
    try {
      const fileHandle = await this.root.getFileHandle(nom, {
        create: false
      });
      const file = await fileHandle.getFile();
      return await file.arrayBuffer();
    } catch (e) {
      return null;
    }
  }
}