<?php
/**
 * BATEGAT SEO GOD - BOT PROXY (Mode Bancal)
 * Aquest script actua com a escut per a les SPA (PWA). Només s'executa quan 
 * l'aranya de WhatsApp, Telegram o Twitter intenta llegir la pàgina.
 * Evitem que lligen l'index.html genèric i els escopim les Meta Tags correctes.
 */

// Llistat de rutes conegudes amb les seues metadades (Es pot ampliar fàcilment)
$rutes_conegudes = [
    'genotip' => [
        'titol' => 'Genotip | Sóc de Poble',
        'descripcio' => 'Descobreix l\'ADN artificial i l\'arquitectura de sobirania digital del projecte.',
        'imatge' => '/assets/uploads/empresa/soc-de-poble/posts/genotip/portada_genotip.png'
    ],
    'el-projecte' => [
        'titol' => 'El Llibre | Sóc de Poble',
        'descripcio' => 'Llig el manifest complet d\'aquest projecte documental transmèdia.',
        'imatge' => '/assets/uploads/empresa/soc-de-poble/posts/el-projecte/exemple-de-poble-001.png'
    ],
    'projecte' => [
        'titol' => 'El Projecte | Sóc de Poble',
        'descripcio' => 'Llig el manifest complet d\'aquest projecte documental transmèdia.',
        'imatge' => '/assets/uploads/empresa/soc-de-poble/posts/el-projecte/exemple-de-poble-001.png'
    ],
    'versions' => [
        'titol' => 'Versions del Sistema | Sóc de Poble',
        'descripcio' => 'Historial d\'actualitzacions i memòria tècnica de l\'evolució de l\'Eixam.',
        'imatge' => '/uploads/avatars/soc-de-poble_book_comic_nano_1770526279743.png'
    ],
    'skills' => [
        'titol' => 'Skills | Sóc de Poble',
        'descripcio' => 'Tot el que em fa ser qui sóc. L\'ànima de la màquina.',
        'imatge' => '/assets/uploads/empresa/soc-de-poble/posts/genotip/portada_genotip.png'
    ],
    'iaies-mundials' => [
        'titol' => 'Iaies Mundials | Sóc de Poble',
        'descripcio' => 'Conexions globals i arquitectura descentralitzada.',
        'imatge' => '/assets/uploads/brain/media__1775601829353.jpg'
    ]
];

// Dades per defecte si la ruta no està al diccionari
$default_og = [
    'titol' => 'Sóc de Poble',
    'descripcio' => 'La xarxa social rural sobirana. El Sistema Operatiu de les Comarques.',
    'imatge' => '/uploads/avatars/soc-de-poble_book_comic_nano_1770526279743.png'
];

$ruta_original = isset($_GET['ruta']) ? trim($_GET['ruta'], '/') : '';
$ruta_clau = explode('/', $ruta_original)[0];

$og = isset($rutes_conegudes[$ruta_clau]) ? $rutes_conegudes[$ruta_clau] : $default_og;

// Assegurem que la imatge tinga el domini complet
$url_base = 'https://socdepoble.org';
$imatge_absoluta = strpos($og['imatge'], 'http') === 0 ? $og['imatge'] : $url_base . $og['imatge'];
$url_absoluta = $url_base . '/' . $ruta_original;

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="ca-valencia">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($og['titol']) ?></title>
    
    <!-- Meta Tags OpenGraph (Per a WhatsApp, Facebook, Telegram) -->
    <meta property="og:title" content="<?= htmlspecialchars($og['titol']) ?>" />
    <meta property="og:description" content="<?= htmlspecialchars($og['descripcio']) ?>" />
    <meta property="og:image" content="<?= htmlspecialchars($imatge_absoluta) ?>" />
    <meta property="og:url" content="<?= htmlspecialchars($url_absoluta) ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Sóc de Poble" />
    
    <!-- Meta Tags Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= htmlspecialchars($og['titol']) ?>" />
    <meta name="twitter:description" content="<?= htmlspecialchars($og['descripcio']) ?>" />
    <meta name="twitter:image" content="<?= htmlspecialchars($imatge_absoluta) ?>" />
    
    <!-- Redirecció en cas que algun humà descarriat arribe ací -->
    <meta http-equiv="refresh" content="0;url=<?= htmlspecialchars($url_absoluta) ?>" />
    
    <style>
        body { background: #000; color: #fff; font-family: system-ui; text-align: center; padding: 2rem; }
    </style>
</head>
<body>
    <h1><?= htmlspecialchars($og['titol']) ?></h1>
    <p><?= htmlspecialchars($og['descripcio']) ?></p>
    <p>Redirigint a la plataforma real...</p>
    <script>
        window.location.href = "<?= htmlspecialchars($url_absoluta) ?>";
    </script>
</body>
</html>
