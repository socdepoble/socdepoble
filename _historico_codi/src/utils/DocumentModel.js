/**
 * @typedef {Object} Block
 * @property {string} id - UUID del bloc
 * @property {'metadata'|'chapter'|'section'} type - Pels llibres, generalment 'chapter'
 * @property {string} content - Contingut en Markdown natiu SOSP
 */

/**
 * @typedef {Object} DocumentMeta
 * @property {string} title
 * @property {string} author 
 * @property {string} lastModified - ISO 8601 string
 */

/**
 * @typedef {Object} DocumentModel
 * @property {string} id - UUID del document sencer
 * @property {DocumentMeta} meta 
 * @property {Block[]} blocks - La matriu de textareas virtualitzats per no saturar l'A10
 */

/**
 * Generador inicial d'un Document Bancal
 * @returns {DocumentModel}
 */
export const createEmptyDocument = () => ({
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    meta: {
        title: 'Nou Document Sóc de Poble',
        author: 'Cronista SOSP',
        lastModified: new Date().toISOString()
    },
    blocks: [
        {
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
            type: 'chapter',
            content: '# Introducció\\n\\nComença a escriure ací...'
        }
    ]
});

/**
 * Assistent per planar un DocumentModel cap a un text Markdown complet
 * Utilitzat abans d'exportar a ePub.
 * @param {DocumentModel} doc 
 * @returns {string} Text compilat
 */
export const compileDocumentToMarkdown = (doc) => {
    return doc.blocks.map(b => b.content).join('\\n\\n---\\n\\n'); 
};
