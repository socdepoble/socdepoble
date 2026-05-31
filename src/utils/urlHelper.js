import imageMap from './imageMap.json';

export const resolveImageUrl = (originalUrl) => {
    if (!originalUrl) return originalUrl;
    if (typeof originalUrl !== 'string') return originalUrl;

    // The assets check will be moved to the bottom

    // Fix for system/ui paths that were moved to assets/
    if (originalUrl.startsWith('/system/ui/')) {
        return `/assets${originalUrl}`;
    }

    // Extract filename for lookup
    const parts = originalUrl.split('/');
    const filename = parts[parts.length - 1];
    
    // Exact match in our registry
    if (imageMap[filename]) {
        return imageMap[filename];
    }
    
    // Fuzzy match
    const fuzzy = Object.keys(imageMap).find(k => {
        const stripped = filename.replace(/_[0-9a-f]+(\.[a-z]+)$/i, '$1').replace(/-[0-9]+x[0-9]+(\.[a-z]+)$/i, '$1');
        const kName = k.split('.')[0];
        const fName = stripped.split('.')[0];
        return k === stripped || kName.includes(fName) || fName.includes(kName);
    });
    
    if (fuzzy) {
        return imageMap[fuzzy];
    }

    // If it's already an /assets/ path and wasn't mapped, it's probably correct
    if (originalUrl.startsWith('/assets/')) {
        return originalUrl;
    }

    // If it's a local /uploads path that wasn't found in the map, maybe it just needs /assets prefix
    if (originalUrl.startsWith('/uploads/')) {
        return `/assets${originalUrl}`;
    }

    return originalUrl;
};

