# Mapa de Redireccions 301 i Seguretat Staging (SiteGround)

Aquest document estableix les regles estructurals per al servidor Apache (SiteGround) per complir l'Objectiu P2 de La Paradoja Cyber-Rural.

## 1. Bloqueig de Bots en Staging (robots.txt)

Si disposes d'un entorn de proves (ex: `dev.socdepoble.org` o un directori `/staging`), assegura't de pujar aquest arxiu `robots.txt` exclusivament en eixe entorn per evitar que Google indexe contingut duplicat:

```text
User-agent: *
Disallow: /
```

> **Atenció:** A l'entorn de producció (`socdepoble.org`), has de mantindre el `robots.txt` actual genèric que sí que permet el rastreig (`Allow: /`).

## 2. Mapa de Redireccions 301 (.htaccess)

Per concentrar la força SEO en un únic domini central i netejar la brutícia històrica, afegeix aquestes regles al principi del teu fitxer `.htaccess` a SiteGround, just abans del bloc de rutes de React/Vite.

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On

  # 1. Forçar HTTPS i WWW cap a NO-WWW (Domini Canònic)
  # Tot el trànsit de www.socdepoble.org i HTTP -> HTTPS socdepoble.org
  RewriteCond %{HTTPS} off [OR]
  RewriteCond %{HTTP_HOST} ^www\.socdepoble\.org$ [NC]
  RewriteRule ^(.*)$ https://socdepoble.org/$1 [L,R=301]

  # 2. Redireccions d'antics dominis (.com, .cat i somdepoble.com cap a socdepoble.org)
  # IMPORTANT: No incloem .net ací per no trencar el teu blog actiu de WordPress
  RewriteCond %{HTTP_HOST} ^(www\.)?(socdepoble\.(com|cat)|somdepoble\.com)$ [NC]
  RewriteRule ^(.*)$ https://socdepoble.org/$1 [L,R=301]

  # 3. Redireccions dels Vercels Antics (Opcional si Vercel es tanca, però recomanat si es manté viu algun proxy)
  # (Cal configurar-ho a Vercel mateix o si el DNS apunta cap ací)
  RewriteCond %{HTTP_HOST} ^soc-de-poble\.vercel\.app$ [NC]
  RewriteRule ^(.*)$ https://socdepoble.org/$1 [L,R=301]

</IfModule>
```

Aquestes accions "escombra" eliminaran els fantasmes SEO i tancaran el P2 de la nostra estratègia.
