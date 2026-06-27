import * as Y from "yjs";

export function createSyncMessage(doc) {
  return Y.encodeStateVector(doc);
}

export function createUpdateFromVector(doc, remoteVector) {
  return Y.encodeStateAsUpdate(doc, remoteVector);
}

export function applyRemoteUpdate(doc, update) {
  Y.applyUpdate(doc, update);
}
