const DEFAULT_MTU = 185;
const FRAME_HEADER_BYTES = 16;
const MAX_CHUNK_SEQUENCE = 65535;

function clampMtu(mtu) {
    const value = Number(mtu);
    if (!Number.isFinite(value)) return DEFAULT_MTU;
    return Math.min(512, Math.max(23, Math.floor(value)));
}

function computePayloadSize(mtu) {
    const safeMtu = clampMtu(mtu);
    return Math.max(8, safeMtu - 3 - FRAME_HEADER_BYTES);
}

export function splitIntoFrames(payload, options = {}) {
    if (!(payload instanceof Uint8Array)) {
        throw new Error('splitIntoFrames expects Uint8Array payload');
    }

    const mtu = clampMtu(options.mtu);
    const payloadPerFrame = computePayloadSize(mtu);
    const messageId = options.messageId ?? (Date.now() & 0xffffffff);

    const totalChunks = Math.max(1, Math.ceil(payload.byteLength / payloadPerFrame));
    if (totalChunks > MAX_CHUNK_SEQUENCE) {
        throw new Error(`Message too large for BLE transport (${totalChunks} chunks)`);
    }

    const frames = [];
    for (let sequence = 0; sequence < totalChunks; sequence += 1) {
        const start = sequence * payloadPerFrame;
        const end = Math.min(start + payloadPerFrame, payload.byteLength);
        const chunk = payload.subarray(start, end);

        const frame = new Uint8Array(FRAME_HEADER_BYTES + chunk.byteLength);
        const view = new DataView(frame.buffer);
        view.setUint32(0, messageId, false);
        view.setUint16(4, sequence, false);
        view.setUint16(6, totalChunks, false);
        view.setUint32(8, payload.byteLength, false);
        view.setUint8(12, options.kind ?? 1); // 1=delta,2=state-vector,3=ack
        view.setUint8(13, options.flags ?? 0);
        view.setUint16(14, options.crc ?? 0, false);
        frame.set(chunk, FRAME_HEADER_BYTES);

        frames.push(frame);
    }

    return {
        mtu,
        payloadPerFrame,
        frames,
        messageId,
        totalChunks,
    };
}

export class FrameReassembler {
    constructor({ gcAfterMs = 60_000 } = {}) {
        this.buffers = new Map();
        this.gcAfterMs = gcAfterMs;
    }

    push(frame) {
        if (!(frame instanceof Uint8Array) || frame.byteLength < FRAME_HEADER_BYTES) {
            return null;
        }

        const now = Date.now();
        const view = new DataView(frame.buffer, frame.byteOffset, frame.byteLength);
        const messageId = view.getUint32(0, false);
        const sequence = view.getUint16(4, false);
        const totalChunks = view.getUint16(6, false);
        const totalBytes = view.getUint32(8, false);
        const kind = view.getUint8(12);
        const chunkPayload = frame.subarray(FRAME_HEADER_BYTES);

        if (sequence >= totalChunks || totalChunks === 0) return null;

        let state = this.buffers.get(messageId);
        if (!state) {
            state = {
                createdAt: now,
                updatedAt: now,
                totalChunks,
                totalBytes,
                kind,
                chunks: new Array(totalChunks),
                received: 0,
                receivedBytes: 0,
            };
            this.buffers.set(messageId, state);
        }

        if (!state.chunks[sequence]) {
            state.chunks[sequence] = chunkPayload;
            state.received += 1;
            state.receivedBytes += chunkPayload.byteLength;
            state.updatedAt = now;
        }

        this.evictStale(now);

        if (state.received !== state.totalChunks) return null;

        const out = new Uint8Array(state.totalBytes);
        let offset = 0;
        for (let i = 0; i < state.chunks.length; i += 1) {
            const chunk = state.chunks[i] || new Uint8Array();
            out.set(chunk, offset);
            offset += chunk.byteLength;
        }

        this.buffers.delete(messageId);

        return {
            messageId,
            kind: state.kind,
            payload: out.subarray(0, state.totalBytes),
            totalChunks: state.totalChunks,
        };
    }

    evictStale(now = Date.now()) {
        for (const [messageId, state] of this.buffers.entries()) {
            if (now - state.updatedAt > this.gcAfterMs) {
                this.buffers.delete(messageId);
            }
        }
    }
}
