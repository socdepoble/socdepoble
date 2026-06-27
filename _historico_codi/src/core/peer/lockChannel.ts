import { createSecureChannel } from './secureChannel';

export const lockChannelPromise = createSecureChannel('lock-zombie-killer');

// Note: To use lockChannel it comes as a promise, meaning owners should `await lockChannelPromise` to get `send` and `subscribe`.
