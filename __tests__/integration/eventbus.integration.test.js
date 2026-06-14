/**
 * __tests__/integration/eventbus.integration.test.js
 *
 * Tests d'integració per al Tauler d'Anuncis (EventTarget natiu).
 * - Simula rhizomeManager registrant handlers (hydrate, getCryptoKeys).
 * - Simula ipfsManager emetent deltes i sol·licitant claus.
 * - Sense dependències externes; usa mocks mínims per Yjs.
 *
 * Executa amb: jest --env=jsdom
 */

describe('EventBus (EventTarget) integration', () => {
  let bus;
  let ydoc;
  let appliedUpdates;
  let cryptoKeys;

  beforeEach(() => {
    // Tauler d'Anuncis: EventTarget natiu
    bus = new EventTarget();

    // Mock mínim de ydoc amb applyUpdate
    appliedUpdates = [];
    ydoc = {
      applyUpdate: (u) => {
        // emular aplicació d'update (guardar per assertions)
        appliedUpdates.push(u instanceof Uint8Array ? Array.from(u) : u);
      }
    };

    // Mock de claus locals
    cryptoKeys = { keyId: 'local-1', publicKey: 'pub-xxx' };
  });

  test('rhizomeManager handles offgrid deltas emitted by ipfsManager', async () => {
    // rhizomeManager registra handler per 'offgridDeltas'
    bus.addEventListener('offgridDeltas', (ev) => {
      const { deltas, source } = ev.detail || {};
      // injectar cada delta al ydoc
      for (const d of deltas) {
        ydoc.applyUpdate(d);
      }
      // opcional: emetre ack
      bus.dispatchEvent(new CustomEvent('offgridAck', { detail: { source, count: deltas.length } }));
    });

    // ipfsManager emet deltas
    const deltas = [new Uint8Array([1,2,3]), new Uint8Array([4,5,6])];
    bus.dispatchEvent(new CustomEvent('offgridDeltas', { detail: { deltas, source: 'ipfs-peer-1' } }));

    // comprovar que ydoc ha rebut i aplicat les actualitzacions
    expect(appliedUpdates.length).toBe(2);
    expect(appliedUpdates[0]).toEqual([1,2,3]);
    expect(appliedUpdates[1]).toEqual([4,5,6]);
  });

  test('ipfsManager can request crypto keys via request/response pattern', async () => {
    // Implementem un petit RPC sobre EventTarget: request + response events
    // rhizomeManager registra handler per 'request:getCryptoKeys'
    bus.addEventListener('request:getCryptoKeys', (ev) => {
      const { requestId } = ev.detail;
      // respondre amb event 'response:getCryptoKeys'
      bus.dispatchEvent(new CustomEvent('response:getCryptoKeys', { detail: { requestId, result: cryptoKeys } }));
    });

    // ipfsManager fa la request i espera la resposta amb timeout
    function requestGetCryptoKeys(timeoutMs = 2000) {
      return new Promise((resolve, reject) => {
        const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
        function onResponse(ev) {
          if (ev.detail && ev.detail.requestId === requestId) {
            bus.removeEventListener('response:getCryptoKeys', onResponse);
            resolve(ev.detail.result);
          }
        }
        bus.addEventListener('response:getCryptoKeys', onResponse);
        // enviar request
        bus.dispatchEvent(new CustomEvent('request:getCryptoKeys', { detail: { requestId } }));
        // timeout
        setTimeout(() => {
          bus.removeEventListener('response:getCryptoKeys', onResponse);
          reject(new Error('timeout'));
        }, timeoutMs);
      });
    }

    const keys = await requestGetCryptoKeys(1000);
    expect(keys).toEqual(cryptoKeys);
  });

  test('malformed delta is rejected and does not corrupt ydoc', () => {
    // rhizomeManager handler amb validació bàsica
    bus.addEventListener('offgridDeltas', (ev) => {
      const { deltas } = ev.detail || {};
      for (const d of deltas) {
        // validació: ha de ser Uint8Array i longitud > 0
        if (!(d instanceof Uint8Array) || d.length === 0) {
          // emetre error event i ignorar
          bus.dispatchEvent(new CustomEvent('offgridError', { detail: { reason: 'invalid-delta' } }));
          continue;
        }
        ydoc.applyUpdate(d);
      }
    });

    // enviar un delta malformada i una bona
    const good = new Uint8Array([9,9]);
    const bad = {}; // malformada
    bus.dispatchEvent(new CustomEvent('offgridDeltas', { detail: { deltas: [bad, good] } }));

    // només la bona ha d'haver estat aplicada
    expect(appliedUpdates.length).toBe(1);
    expect(appliedUpdates[0]).toEqual([9,9]);
  });
});
