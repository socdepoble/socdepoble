// opfs_worker.js — L'ÚNIC escriptor del .ylog. createSyncAccessHandle només existeix dins
// d'un Worker, i és l'única via d'escriptura OPFS que funciona en iPadOS <= 17 (Safari sense
// createWritable). De regal: tot el I/O ix del fil principal. Els mètodes del handle s'usen
// amb await: en Chrome són síncrons (await innocu) i en Safari antic retornaven Promises.
// Les operacions s'encadenen (chain) perquè un handler async no s'entrellace amb el següent.

let handle = null;
let size = 0;
let chain = Promise.resolve();

const reply = (msg, transfer) => self.postMessage(msg, transfer || []);

async function exec(m) {
  switch (m.t) {
    case 'open': {
      const root = await navigator.storage.getDirectory();
      const fh = await root.getFileHandle(m.file, { create: true });
      // Bloqueig EXCLUSIU: si una altra pestanya té el registre obert, açò llança error.
      // És una garantia, no un defecte: un sol escriptor per .ylog = zero corrupció creuada.
      handle = await fh.createSyncAccessHandle();
      size = await handle.getSize();
      const buf = new Uint8Array(size);
      if (size) await handle.read(buf, { at: 0 });
      reply({ id: m.id, t: 'ready', bytes: size, buf: buf.buffer }, [buf.buffer]);
      return;
    }
    case 'append': {
      const bytes = new Uint8Array(m.buf);
      await handle.write(bytes, { at: size });
      size += bytes.byteLength;
      await handle.flush();
      reply({ id: m.id, t: 'ok', size });
      return;
    }
    case 'rewrite': {
      // Compactació: snapshot al principi + truncate. Si morim entre write i truncate, la cua
      // vella queda darrere del snapshot: el CRC del replay la descarta i el pròxim open repara.
      const bytes = new Uint8Array(m.buf);
      await handle.write(bytes, { at: 0 });
      await handle.truncate(bytes.byteLength);
      size = bytes.byteLength;
      await handle.flush();
      reply({ id: m.id, t: 'ok', size });
      return;
    }
    case 'truncate': {
      await handle.truncate(m.to);
      size = m.to;
      await handle.flush();
      reply({ id: m.id, t: 'ok', size });
      return;
    }
    case 'close': {
      if (handle) {
        await handle.flush();
        await handle.close();
        handle = null;
      }
      reply({ id: m.id, t: 'ok', size });
      return;
    }
    default:
      throw new Error(`Ordre desconeguda: ${m.t}`);
  }
}

self.onmessage = e => {
  const m = e.data;
  chain = chain
    .then(() => exec(m))
    .catch(err => reply({ id: m.id, t: 'err', error: String(err?.message || err) }));
};
