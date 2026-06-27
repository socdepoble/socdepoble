import * as Y from 'yjs';

export class YjsDocAdapter {
    constructor(ydoc) {
        this.doc = ydoc;
        this.onDeltaEmit = () => {};

        this.doc.on('update', (update, origin) => {
            if (origin !== 'ble-sync') {
                this.onDeltaEmit(update);
            }
        });
    }

    applyDelta(update) {
        Y.applyUpdate(this.doc, update, 'ble-sync');
    }

    getStateVector() {
        return Y.encodeStateVector(this.doc);
    }

    getMissingDeltas(remoteStateVector) {
        return Y.encodeStateAsUpdate(this.doc, remoteStateVector);
    }
}
