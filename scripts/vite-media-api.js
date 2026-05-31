import fs from 'fs';
import path from 'path';

// Helper to read and update registry
const updateRegistry = (updaterFn) => {
    const REGISTRY_FILE = path.join(process.cwd(), 'src/data/media_registry.js');
    let content = fs.readFileSync(REGISTRY_FILE, 'utf-8');
    
    let jsonStr = content.substring(content.indexOf('{'));
    const hmrIdx = jsonStr.indexOf('if (import.meta.hot)');
    if (hmrIdx !== -1) jsonStr = jsonStr.substring(0, hmrIdx);
    jsonStr = jsonStr.trim();
    if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
    
    let registry;
    try {
        registry = JSON.parse(jsonStr);
    } catch (e) {
        throw new Error('Could not parse media_registry.js');
    }

    const updated = updaterFn(registry);
    if (!updated) return false;

    registry.meta.lastUpdated = new Date().toISOString();
    
    // Add import.meta.hot.accept() to prevent Vite full page reloads when this file changes
    const newContent = `export const MEDIA_REGISTRY = ${JSON.stringify(registry, null, 2)};\n\nif (import.meta.hot) { import.meta.hot.accept(); }\n`;
    fs.writeFileSync(REGISTRY_FILE, newContent);
    return true;
};

export function mediaApiPlugin() {
    return {
        name: 'vite-media-api',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (!req.url.startsWith('/api/media')) {
                    return next();
                }

                // Simple JSON body parser
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    const data = body ? JSON.parse(body) : {};
                    const method = req.method;
                    const urlPath = req.url.split('?')[0];
                    const urlParts = urlPath.split('/').filter(Boolean);
                    
                    // Route: POST /api/media/bulk-delete
                    if (method === 'POST' && urlParts.length === 3 && urlParts[2] === 'bulk-delete') {
                        const ids = data.ids || [];
                        if (!Array.isArray(ids) || ids.length === 0) {
                            res.statusCode = 400;
                            return res.end(JSON.stringify({ error: 'No ids provided' }));
                        }

                        try {
                            let deletedCount = 0;
                            updateRegistry(registry => {
                                let modified = false;
                                for (const id of ids) {
                                    const index = registry.media.findIndex(m => m.id === id);
                                    if (index !== -1) {
                                        const filePathToDelete = path.join(process.cwd(), 'public', registry.media[index].path);
                                        if (fs.existsSync(filePathToDelete)) {
                                            try { fs.unlinkSync(filePathToDelete); } catch (e) {}
                                        }
                                        registry.media.splice(index, 1);
                                        deletedCount++;
                                        modified = true;
                                    }
                                }
                                return modified;
                            });

                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ success: true, deleted: deletedCount }));
                        } catch (err) {
                            console.error('[Vite Media API] BULK DELETE error:', err);
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: err.message }));
                        }
                        return;
                    }

                    // Route: DELETE /api/media/:id
                    if (method === 'DELETE' && urlParts.length === 3) {
                        const id = urlParts[2];
                        let filePathToDelete = null;

                        try {
                            updateRegistry(registry => {
                                console.log('[Vite Media API] Searching for id:', id);
                                console.log('[Vite Media API] Registry items count:', registry.media.length);
                                const index = registry.media.findIndex(m => m.id === id);
                                console.log('[Vite Media API] Found at index:', index);
                                if (index === -1) throw new Error('Not found');
                                
                                filePathToDelete = path.join(process.cwd(), 'public', registry.media[index].path);
                                registry.media.splice(index, 1);
                                return true;
                            });

                            if (filePathToDelete && fs.existsSync(filePathToDelete)) {
                                fs.unlinkSync(filePathToDelete);
                            }

                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ success: true }));
                        } catch (err) {
                            console.error('[Vite Media API] DELETE error:', err);
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: err.message }));
                        }
                        return;
                    }

                    // Route: POST /api/media/move/:id
                    if (method === 'POST' && urlParts.length === 4 && urlParts[2] === 'move') {
                        const id = urlParts[3];
                        const newFolder = data.folder;
                        
                        if (!newFolder) {
                            res.statusCode = 400;
                            res.end(JSON.stringify({ error: 'Folder name is required' }));
                            return;
                        }

                        try {
                            let newItemData = null;
                            updateRegistry(registry => {
                                const item = registry.media.find(m => m.id === id);
                                if (!item) throw new Error('Not found');
                                
                                const oldPath = path.join(process.cwd(), 'public', item.path);
                                
                                // Determine new path inside public/assets/uploads/<newFolder>/
                                const newRelDir = `/assets/uploads/${newFolder.toLowerCase().replace(/\\s+/g, '-')}`;
                                const newAbsDir = path.join(process.cwd(), 'public', newRelDir);
                                
                                if (!fs.existsSync(newAbsDir)) {
                                    fs.mkdirSync(newAbsDir, { recursive: true });
                                }

                                const newRelPath = `${newRelDir}/${item.filename}`;
                                const newAbsPath = path.join(process.cwd(), 'public', newRelPath);

                                if (fs.existsSync(oldPath) && oldPath !== newAbsPath) {
                                    fs.renameSync(oldPath, newAbsPath);
                                }

                                item.folder = newFolder;
                                item.path = newRelPath;
                                item.tags = [newFolder];
                                newItemData = item;
                                return true;
                            });

                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ success: true, item: newItemData }));
                        } catch (err) {
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: err.message }));
                        }
                        return;
                    }

                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'Endpoint not found' }));
                });
            });
        }
    };
}
