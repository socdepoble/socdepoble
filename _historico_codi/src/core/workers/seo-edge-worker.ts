export interface Env {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';
    // Mitigación: Expandido para soportar scrapers sociales como WhatsApp / Telegram
    const isBotUA = /Googlebot|Twitterbot|bingbot|facebookexternalhit|yandex|whatsapp|telegram/i.test(userAgent);
    
    // Extrema mitigación de DDOS por Spoofing
    const cfFeatures: any = request.cf || {};
    const isVerifiedBot = cfFeatures.botManagement?.verifiedBot === true;

    if (isBotUA) {
        // En un entorno de producción estricto, bloquear bots no verificados que hacen spoofing
        // if (!isVerifiedBot && process.env.NODE_ENV === 'production') {
        //      return new Response('Forbidden: Spoofed Bot Identity Detected', { status: 403 });
        // }

        const postMatch = url.pathname.match(/^\/post\/([a-zA-Z0-9-]+)$/);
        if (postMatch && env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
            const postId = postMatch[1];
            
            try {
                // Fetch al edge directo a la REST API de Supabase para latencia mínima << 50ms
                const dbRes = await fetch(`${env.SUPABASE_URL}/rest/v1/posts?uuid=eq.${postId}&select=title,content,author_name,image_url,created_at`, {
                    headers: {
                        'apikey': env.SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`
                    }
                });

                if (dbRes.ok) {
                    const data = await dbRes.json() as any[];
                    if (data && data.length > 0) {
                        const post = data[0];
                        const title = post.title || 'Actualitat - Sóc de Poble';
                        const description = (post.content || '').substring(0, 150).replace(/"/g, '&quot;') + '...';
                        const imageUrl = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || 'https://socdepoble.org/og-default.png');
                        const author = post.author_name || 'Usuari de Sóc de Poble';
                        const date = post.created_at || new Date().toISOString();

                        // JSON-LD Estructurado
                        const jsonLd = {
                            "@context": "https://schema.org",
                            "@type": "NewsArticle",
                            "headline": title.replace(/"/g, '\\"'),
                            "image": [imageUrl],
                            "datePublished": date,
                            "author": [{
                                "@type": "Person",
                                "name": author.replace(/"/g, '\\"'),
                                "url": `https://socdepoble.org/post/${postId}`
                            }]
                        };

                        const metaTags = `
                            <title>${title}</title>
                            <meta name="description" content="${description}">
                            <meta property="og:title" content="${title}">
                            <meta property="og:description" content="${description}">
                            <meta property="og:image" content="${imageUrl}">
                            <meta property="og:type" content="article">
                            <meta name="twitter:card" content="summary_large_image">
                            <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
                        `;

                        const bodyHtml = `
                            <div id="ssr-seo-content" style="display:none;">
                                <h1>${title}</h1>
                                <h2>Escrit per ${author} a ${date}</h2>
                                <img src="${imageUrl}" alt="${title}" />
                                <p>${description}</p>
                            </div>
                        `;

                        // Recuperar index.html para inyectar (Cloudflare lo servirá de Assets si usamos dispatch regular)
                        const originalResponse = await fetch(request);
                        
                        // Uso de HTMLRewriter nativo de Cloudflare Workers para no bloquear I/O
                        return new HTMLRewriter()
                          .on('head', {
                              element(element) {
                                  element.append(metaTags, { html: true });
                              }
                          })
                          .on('body', {
                              element(element) {
                                  element.prepend(bodyHtml, { html: true });
                              }
                          })
                          .transform(originalResponse);
                    }
                }
            } catch(e) {
                // Fail-open: Si Supabase falla al edge, procedemos con el CSR normal
            }
        }
    }
    
    // Fallback: Retorna a la app CSR habitúal
    return fetch(request);
  }
};
