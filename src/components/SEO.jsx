import React from 'react';

/**
 * SEO [VIRAL TIERS GOD]
 * Gestió dinàmica de l'SEO per a previsualitzacions d'alt impacte.
 */
const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author = 'Sóc de Poble',
    structuredData = {}
}) => {
    const siteTitle = 'Sóc de Poble';
    const showVersion = typeof window !== 'undefined' && !window.HIDE_SEO_VERSION;
    const versionString = 'v1.5.6-BATEGA';

    const displayTitle = title ? title : siteTitle;
    const fullTitle = showVersion ? `${displayTitle} | ${siteTitle} ${versionString}` : `${displayTitle} | ${siteTitle}`;

    const defaultDesc = 'La teva comunitat, els teus veïns. Connecta amb la vida del teu poble.';
    const defaultImage = '/og-image.png?v=batega-1';
    const baseUrl = 'https://socdepoble.vercel.app';

    // Ensure absolute URLs for Open Graph (required by WhatsApp, Telegram, etc.)
    const absoluteImage = image?.startsWith('http') ? image : `${baseUrl}${image || defaultImage}`;
    const absoluteUrl = url?.startsWith('http') ? url : `${baseUrl}${url || window.location.pathname}`;

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDesc} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDesc} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:image:secure_url" content={absoluteImage} />
            <meta property="og:image:alt" content={fullTitle} />
            <meta property="og:url" content={absoluteUrl} />
            <meta property="og:site_name" content="Sóc de Poble" />
            <meta property="og:locale" content="ca_ES" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDesc} />
            <meta name="twitter:image" content={absoluteImage} />
            <meta name="twitter:image:alt" content={fullTitle} />
            <meta name="twitter:site" content="@socdepoble" />
            <meta name="twitter:creator" content="@javillinares" />

            {/* App specific headers */}
            <meta name="apple-mobile-web-app-title" content="Sóc de Poble" />
            <meta name="application-name" content="Sóc de Poble" />
            <meta name="theme-color" content="#9c4221" />

            {/* Canonical Link */}
            <link rel="canonical" href={absoluteUrl} />

            {/* Structured Data (JSON-LD) - Dynamic Injection */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": type === 'profile' ? 'ProfilePage' : (type === 'article' ? 'NewsArticle' : 'WebSite'),
                    "name": fullTitle,
                    "description": description || defaultDesc,
                    "url": absoluteUrl,
                    "image": absoluteImage,
                    ...structuredData
                })}
            </script>
        </>
    );
};

export default SEO;
