-- =========================================================
-- SÓC DE POBLE: SEED DE DATOS REALES (La Torre de les Maçanes & Alrededores)
-- =========================================================
-- v8: FINAL IMÁGENES IA
-- 1. Usa las imágenes generadas por Nano Banana (en /images/*.png).
-- 2. Pueblos sin foto para evitar roturas (hasta que el usuario las ponga).
-- 3. Diseño de contenido ajustado a las fotos disponibles.

-- A. CORRECCIÓN DE ESTRUCTURA
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- B. INSERTAR PUEBLOS (Sin fotos locales rotas, usamos placeholder o vacio)
-- Nota: El usuario prefiere poner las fotos él mismo o bajarlas de Wikipedia manual.
-- De momento las dejamos apuntando a /images/ que si existen (si las descargó) bien, sino sale el placeholder del componente.
INSERT INTO towns (id, name, description, image_url, population, logo_url) VALUES
(101, 'La Torre de les Maçanes', 'Un oasis de tranquilidad a 788m de altura. Famosa por su "Pa Beneït", la Torre Major y el mercado de los domingos.', '/images/torre.jpg', 692, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg/300px-Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg.png'),
(102, 'Xixona', 'La cuna mundial del turrón. Ciudad dulce que combina industria tradicional con un casco antiguo lleno de historia.', '/images/xixona.jpg', 6865, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Escut_de_Xixona.svg/300px-Escut_de_Xixona.svg.png'),
(103, 'Penàguila', 'Tierra de mitos y leyendas como el Tio Cuc. Situada a los pies de la Serra de Aitana, ofrece el espectacular Jardín de Santos.', '/images/penaguila.jpg', 269, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Escut_de_Pen%C3%A0guila.svg/300px-Escut_de_Pen%C3%A0guila.svg.png'),
(104, 'Benifallim', 'Pequeño tesoro escondido entre montañas. Con apenas 130 habitantes, es el refugio perfecto para quien busca silencio.', '/images/benifallim.jpg', 130, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Escut_de_Benifallim.svg/300px-Escut_de_Benifallim.svg.png'),
(105, 'Alcoi', 'Ciudad de los puentes y el modernismo. Capital industrial con las fiestas de Moros y Cristianos más famosas.', '/images/alcoi.jpg', 58960, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Escut_d%27Alcoi.svg/300px-Escut_d%27Alcoi.svg.png'),
(106, 'Relleu', 'Pueblo de tradiciones y senderos. Su nueva pasarela sobre el pantano del siglo XVII es un atractivo turístico.', '/images/relleu.jpg', 1195, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Escut_de_Relleu.svg/300px-Escut_de_Relleu.svg.png')
ON CONFLICT (id) DO UPDATE SET 
image_url = EXCLUDED.image_url, 
logo_url = EXCLUDED.logo_url,
description = EXCLUDED.description;

-- C. INSERTAR POSTS (Usando imágenes IA disponibles y roles)
INSERT INTO posts (id, author, avatar_type, content, image_url, connections_count, created_at, author_id, author_role) VALUES
(201, 'Ajuntament Torremanzanas', 'gov', '📢 NOTA INFORMATIVA: El servicio de médico de familia pasará consulta este martes y jueves de 9:00 a 13:00. Recordad pedir cita previa.', NULL, 12, NOW() - INTERVAL '1 hour', 'admin-id', 'grup'),
(202, 'Banda de Música La Lira', 'group', '🎺 Aquest divendres assaig general a la Casa de Cultura. Preparem el concert de Santa Cecília! No falteu, que hem de repassar el pasdoble nou.', NULL, 34, NOW() - INTERVAL '3 hours', 'banda-id', 'grup'),
(203, 'Bar El Chato', 'shop', '🍲 Avui dijous toca OLLETA DE BLAT! Amb pencas, botifarra i molt d''amor. Reserveu taula o emporteu-vos-la en olla.', '/images/olleta.png', 45, NOW() - INTERVAL '5 hours', 'bar-id', 'empresa'),
(204, 'Forn de Pa La Plaça', 'shop', '🥖 Acabem de traure les coques de tomaca i les de pericana! També tenim pastissets de moniato fets a mà amb la recepta de la iaia.', '/images/coques.png', 28, NOW() - INTERVAL '6 hours', 'forn-id', 'empresa'),
(205, 'Maria (Veïna)', 'user', 'Algú sap si l''autobús d''Alcoi de les 15:30 puja avui? Ahir no va passar i em vaig quedar tirada... 😠 Necessitem millor transport!', NULL, 15, NOW() - INTERVAL '1 day', 'maria-id', 'gent'),
(206, 'Grup Senderisme La Torre', 'group', '📸 Fotos de la ruta d''ahir al Rentonar. Quines vistes tenim! La pròxima setmana farem la ruta de les fonts. Qui s''apunta?', '/images/tomates.png', 56, NOW() - INTERVAL '2 days', 'hike-id', 'grup'),
(207, 'Comissió de Festes', 'group', '🎆 Ja tenim el llibret de festes preparat! Aquest any recuperem la "Dansà" tradicional a la plaça. Veniu vestits de saragüells!', NULL, 89, NOW() - INTERVAL '3 days', 'festes-id', 'grup')
ON CONFLICT (id) DO UPDATE SET
content = EXCLUDED.content,
image_url = EXCLUDED.image_url,
author_role = EXCLUDED.author_role;

-- D. INSERTAR MERCADO (Imágenes IA de alta calidad y roles)
INSERT INTO market_items (id, title, price, seller, image_url, tag, created_at, seller_role) VALUES
(301, 'Garrafes Oli Verge Extra (5L)', '38€', 'Cooperativa Agrícola', '/images/oli.png', 'Alimentació', NOW(), 'empresa'),
(302, 'Llenya d''Ametler Seca', '120€/t', 'Batiste "El Serra"', '/images/llenya.png', 'Llar', NOW() - INTERVAL '2 hours', 'empresa'),
(303, 'Mel de Romer Artesana', '10€', 'Abelles de la Torre', '/images/mel.png', 'Alimentació', NOW() - INTERVAL '5 hours', 'empresa'),
(304, 'Tomates de Penjar', '3€/kg', 'Hort del Tio Pepe', '/images/tomates.png', 'Alimentació', NOW() - INTERVAL '1 day', 'gent')
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
image_url = EXCLUDED.image_url,
seller_role = EXCLUDED.seller_role;

-- E. CHAT SIMULADO
INSERT INTO chats (id, name, last_message, time, unread_count, type) VALUES
(401, 'Alcalde (Vicent)', 'Bon dia Javi, gràcies per la proposta de l''app.', '10:30', 1, 'user'),
(402, 'Grup Paellas Diumenge', 'Qui porta el conill per a l''arròs? 🥘', 'Ahir', 5, 'group'),
(403, 'Forn La Plaça', 'Ja tinc les teues coques apartades.', 'Dilluns', 0, 'shop')
ON CONFLICT (id) DO UPDATE SET
last_message = EXCLUDED.last_message;
