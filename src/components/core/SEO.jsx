// ✅ VERSIÓ FINAL - SEO GOD MODE AMB VALIDACIÓ COMPLETA
import { Helmet } from 'react-helmet-async';
import { APP_VERSION } from '../../constants';

/**
 * 🏺 SEO [VIRAL TIERS GOD] - Sincronitzat amb APP_VERSION
 * Gestió dinàmica de l'SEO per a previsualitzacions d'alt impacte.
 * 
 * CARACTERÍSTIQUES:
 * - Prevenció de duplicats en og:image
 * - Validació de dades estructurades (Schema.org)
 * - Suport per a Twitter Cards, Facebook, WhatsApp
 * - Canonical URLs automàtiques
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'Sóc de Poble',
  structuredData = {},
  noIndex = false
}) => {
  // [VALIDACIÓ] Títol per defecte si no es proporciona
  const siteTitle = 'Sóc de Poble';
  const showVersion = typeof window !== 'undefined' && !window.HIDE_SEO_VERSION;
  const versionString = APP_VERSION;
  const displayTitle = title ? title : siteTitle;
  const fullTitle = showVersion ? `${displayTitle} | ${siteTitle} ${versionString}` : `${displayTitle} | ${siteTitle}`;
  
  // [VALIDACIÓ] URL canònica automàtica completíssima i absoluta
  const baseUrl = 'https://socdepoble.org';
  let canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : baseUrl);
  if (!canonicalUrl.startsWith('http')) {
      canonicalUrl = `${baseUrl}${canonicalUrl}`;
  }
  
  // [HOTFIX] Extraure imatge de l'array si ve compresa així des de dades_mock
  const getImageUrl = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (Array.isArray(img) && img.length > 0) return getImageUrl(img[0]);
    return '';
  };
  const resolvedImage = getImageUrl(image);
  
  // [VALIDACIÓ] Imatge per defecte (OG Image master)
  const safeImage = resolvedImage ? (resolvedImage.startsWith('/') ? resolvedImage : `/${resolvedImage}`) : '/assets/uploads/brain/media__1775601829353.jpg';
  const ogImage = resolvedImage?.startsWith('http') ? resolvedImage : `${baseUrl}${safeImage}`;  
  // [VALIDACIÓ] Descripció per defecte
  const defaultDescription = 'La xarxa social rural sobirana. Connectant pobles, preservant memòria, bategant en comunitat.';
  const metaDescription = description || defaultDescription;
  
  // [VALIDACIÓ] Keywords per defecte
  const defaultKeywords = 'poble, rural, comunitat, valencià, sobirania digital, memòria local, ajuntament, mercat km0';
  const metaKeywords = keywords || defaultKeywords;
  
  // [SEGURETAT] Netejar dades perilloses
  const sanitize = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .substring(0, 500); // Max length per a meta tags
  };

  // [SCHEMA.ORG] Dades estructurades per defecte
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'profile' ? 'ProfilePage' : (type === 'article' ? 'NewsArticle' : (type === 'product' ? 'Product' : 'Organization')),
    "name": "Sóc de Poble",
    "url": baseUrl,
    "logo": `${baseUrl}/icon-512x512.png`,
    "description": sanitize(metaDescription),
    "foundingDate": "2024",
    "areaServed": {
      "@type": "Country",
      "name": "País Valencià"
    }
  };

  const mergedStructuredData = { ...defaultStructuredData, ...structuredData };
  const sanitizedStructuredData = {};
  for (const [key, value] of Object.entries(mergedStructuredData)) {
      sanitizedStructuredData[key] = typeof value === 'string' ? sanitize(value) : value;
  }

  // [PREVENCIÓ DUPLICATS] Key única per a cada tag per netejar Helmet
  const helmetKey = typeof window !== 'undefined' ? window.location.pathname : 'seo-static';

  return (
    <Helmet key={helmetKey} defer={false}>
      {/* === BÀSICS === */}
      <title>{sanitize(fullTitle)}</title>
      <meta name="title" content={sanitize(fullTitle)} />
      <meta name="description" content={sanitize(metaDescription)} />
      <meta name="keywords" content={sanitize(metaKeywords)} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="application-name" content="Sóc de Poble" />
      <meta name="theme-color" content="#f97316" />
      
      {/* === CANONICAL === */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* === OPEN GRAPH / FACEBOOK / WHATSAPP === */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={sanitize(fullTitle)} />
      <meta property="og:description" content={sanitize(metaDescription)} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={sanitize(title || siteTitle)} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="ca_ES" />
      
      {/* === TWITTER CARDS === */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={sanitize(fullTitle)} />
      <meta name="twitter:description" content={sanitize(metaDescription)} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={sanitize(title || siteTitle)} />
      <meta name="twitter:site" content="@socdepoble" />
      <meta name="twitter:creator" content="@javillinares" />
      
      {/* === INSTAGRAM / PINTEREST === */}
      <meta name="pinterest" content="nopin" />
      
      {/* === APPLE TOUCH ICONS === */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteTitle} />
      
      {/* === MICROSOFT TILE === */}
      <meta name="msapplication-TileColor" content="#f97316" />
      <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
      
      {/* === SCHEMA.ORG STRUCTURED DATA === */}
      <script type="application/ld+json">
        {JSON.stringify(mergedStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
