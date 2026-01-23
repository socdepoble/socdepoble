/**
 * Computes a SHA-256 hash of a File object for deduplication purposes.
 * @param {File} file 
 * @returns {Promise<string>} Hexadecimal hash string
 */
export async function calculateFileHash(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
