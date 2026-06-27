// src/data/broadcast.ts
export type TabMessage =
    | { type: 'POST_CREATED', payload: { tempId: string, post: any } }
    | { type: 'POST_LIKED', payload: { postId: string, delta: number } };

const channel = new BroadcastChannel('socdepoble_sync');

export function broadcastMutation(msg: TabMessage) {
    channel.postMessage(msg);
}

export function subscribeToMutations(callback: (msg: TabMessage) => void) {
    const handler = (event: MessageEvent) => callback(event.data);
    channel.addEventListener('message', handler);
    return () => channel.removeEventListener('message', handler);
}
