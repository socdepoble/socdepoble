import { useEffect } from 'react';

/**
 * Hook `useSeoMeta` (Trellat SEO)
 * Mutación síncrona ligera del documento en navegador.
 * Evita la sobrecarga de 30KB de react-helmet.
 * 
 * @param {Object} props
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción del meta (SEO)
 * @param {string} props.image - URL a miniatura/imagen para OG y Twitter.
 */
export const useSeoMeta = ({ title, description, image }) => {
    useEffect(() => {
        const fallbacks = {
            title: 'Sóc de Poble | El Sistema Operatiu Rural',
            description: 'Connecta amb la teua comunitat i recupera el trellat del territori. Mercat rural, memòria viva i sobirania digital.',
            image: 'https://socdepoble.org/og-image.png'
        };

        const activeTitle = title ? `${title} | Sóc de Poble` : fallbacks.title;
        const activeDescription = description || fallbacks.description;
        const activeImage = image || fallbacks.image;

        // Mutate document primitives immediately
        document.title = activeTitle;

        const setMetaTag = (attrName, attrValue, content) => {
            let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attrName, attrValue);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Standard SEO
        setMetaTag('name', 'description', activeDescription);

        // OpenGraph (WhatsApp, FB, etc)
        setMetaTag('property', 'og:title', activeTitle);
        setMetaTag('property', 'og:description', activeDescription);
        setMetaTag('property', 'og:image', activeImage);

        // Twitter Cards
        setMetaTag('name', 'twitter:title', activeTitle);
        setMetaTag('name', 'twitter:description', activeDescription);
        setMetaTag('name', 'twitter:image', activeImage);

        return () => {
            // Restore to fallbacks on exit to keep home sane
            document.title = fallbacks.title;
            setMetaTag('name', 'description', fallbacks.description);
            setMetaTag('property', 'og:title', fallbacks.title);
            setMetaTag('property', 'og:description', fallbacks.description);
            setMetaTag('property', 'og:image', fallbacks.image);
            setMetaTag('name', 'twitter:title', fallbacks.title);
            setMetaTag('name', 'twitter:description', fallbacks.description);
            setMetaTag('name', 'twitter:image', fallbacks.image);
        };
    }, [title, description, image]);
};
