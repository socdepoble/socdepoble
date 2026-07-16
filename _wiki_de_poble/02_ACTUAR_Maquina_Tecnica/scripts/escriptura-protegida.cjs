'use strict';
/** TOMBSTONE P0: una funció genèrica d'escriptura no pot autoautoritzar-se. */
async function writeFileProtected() {
  throw new Error('SDP-LOCK: wrapper genèric retirat; usa una operació concreta amb rebut del Reflex.');
}
module.exports = { writeFile: writeFileProtected };
