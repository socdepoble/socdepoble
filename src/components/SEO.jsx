import React from 'react';

/**
 * Component per a la gestió dinàmica de l'SEO i metadades.
 * Aprofitant les capacitats de React 19, aquests elements es mouran
 * automàticament al <head> del document.
 */
const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author = 'Sóc de Poble'
}) => {
    const siteTitle = 'Sóc de Poble';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaultDesc = 'La plataforma de connexió comunitària per als pobles de la Comunitat Valenciana.';
    const defaultImage = '/og-image.png'; // Updated to existing file
    const currentUrl = url || window.location.href;

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDesc} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDesc} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={currentUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDesc} />
            <meta name="twitter:image" content={image || defaultImage} />

            {/* Video Support for high-level sharing */}
            {type === 'video.other' && (
                <meta property="og:video" content={url} />
            )}

            {/* Canonical Link */}
            <link rel="canonical" href={currentUrl} />
        </>
    );
};

export default SEO;
