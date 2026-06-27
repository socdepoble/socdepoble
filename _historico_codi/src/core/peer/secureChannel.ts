export type SecureMessage = {
  type: string;
  payload: any;
  signature: ArrayBuffer; // HMAC-SHA-256
};

export async function createSecureChannel(
  channelName: string
): Promise<{
  send: (msg: Omit<SecureMessage, 'signature'>) => void;
  subscribe: (handler: (msg: SecureMessage) => void) => () => void;
}> {
  const channel = new BroadcastChannel(channelName);

  // Derivar una clave HMAC por sesión del navegador
  const material = window.crypto.getRandomValues(new Uint8Array(32));
  const key = await window.crypto.subtle.importKey(
    'raw',
    material,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );

  const secretKeyStr = btoa(
    String.fromCharCode(...new Uint8Array(await window.crypto.subtle.exportKey('raw', key)))
  );

  // único por tab, solo visible en el contexto actual
  const hmac = async (data: string): Promise<ArrayBuffer> => {
    const encoder = new TextEncoder();
    const msg = encoder.encode(data);
    const hash = await window.crypto.subtle.sign('HMAC', key, msg);
    return hash;
  };

  const send = async (msg: Omit<SecureMessage, 'signature'>) => {
    const data = JSON.stringify({ ...msg, secretKeyStr });
    const sig = await hmac(data);
    channel.postMessage({ ...msg, signature: sig } as SecureMessage);
  };

  const verify = async (
    candidate: SecureMessage,
    cb: (valid: boolean, data: string | undefined) => void
  ) => {
    const data = JSON.stringify({ ...candidate, secretKeyStr });
    const encoder = new TextEncoder();
    const sig = encoder.encode(data);
    const valid = await window.crypto.subtle.verify(
      'HMAC',
      key,
      candidate.signature,
      sig
    );
    cb(valid, valid ? data : undefined);
  };

  const subscribe = (handler: (msg: SecureMessage) => void) => {
    const listener = (event: MessageEvent) => {
      verify(event.data, (valid, data) => {
        if (!valid) return;
        handler(event.data as SecureMessage);
      });
    };
    channel.addEventListener('message', listener);
    return () => {
      channel.removeEventListener('message', listener);
    };
  };

  return { send, subscribe };
}
