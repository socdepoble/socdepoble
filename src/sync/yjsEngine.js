import * as Y from "yjs";
import { openDB } from "idb";

const DB_NAME = "yjs-docs";
const STORE = "docs";

let db;

export async function initYjsDB() {
  db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE);
    },
  });
}

export async function persistDoc(doc, docId) {
  const state = Y.encodeStateAsUpdate(doc);
  await db.put(STORE, state, docId);
}

export async function loadDoc(docId) {
  const doc = new Y.Doc();
  const state = await db.get(STORE, docId);

  if (state) {
    Y.applyUpdate(doc, state);
  }

  return doc;
}

export function pruneDoc(doc) {
  const snapshot = Y.snapshot(doc);

  const newDoc = new Y.Doc();
  Y.applyUpdate(newDoc, Y.encodeStateAsUpdate(doc, snapshot));

  doc.destroy();

  return newDoc;
}

export function startPruningStrategy(activeDoc) {
  setInterval(() => {
    pruneDoc(activeDoc);
  }, 1000 * 60 * 10); // cada 10 min
}
