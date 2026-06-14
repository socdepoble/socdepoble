import React, { useState, useEffect } from 'react';
import UniversalShell from './UniversalShell';

export default function UniversalPage({
  children,
  slug,
  title,
  subtitle,
  variant = 'post',
  item,
  ...shellProps
}) {
  const [htmlContent, setHtmlContent]   = useState(null);
  const [pageData,    setPageData]      = useState(null);
  const [isLoading,   setIsLoading]     = useState(Boolean(slug));

  useEffect(() => {
    if (!slug) return;

    // A simple mock since we removed pageRegistry.js in the purge
    const mockEntry = { title: slug.toUpperCase(), subtitle: 'Contingut de ' + slug };
    setPageData(mockEntry);
    setIsLoading(false);
  }, [slug]);

  const displayTitle    = title    || pageData?.title    || 'Sóc de Poble';
  const displaySubtitle = subtitle || pageData?.subtitle || '';
  const resolvedItem    = item     || pageData           || null;

  return (
    <UniversalShell
      title={displayTitle}
      subtitle={displaySubtitle}
      item={resolvedItem}
      variant={variant}
      {...shellProps}
    >
      {children ?? (
        isLoading
          ? <p className="opacity-40 italic text-sm">Carregant el contingut de la pàgina…</p>
          : htmlContent
            ? <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            : null
      )}
    </UniversalShell>
  );
}
