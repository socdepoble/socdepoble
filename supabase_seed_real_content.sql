-- =========================================================
-- SÓC DE POBLE: SEED DE DATOS REALES (La Torre de les Maçanes & Alrededores)
-- =========================================================
-- v5: VERSIÓN SIMPLIFICADA (A prueba de fallos)
-- Solo inserta los datos. Ignora la configuración técnica compleja.

-- 1. CORRECCIÓN DE ESTRUCTURA (Por si acaso falta)
ALTER TABLE market_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 2. INSERTAR PUEBLOS
INSERT INTO towns (id, name, description, image_url, population, logo_url) VALUES
(101, 'La Torre de les Maçanes', 'Un oasis de tranquilidad en la montaña alicantina. Conocida por su "Pa Beneït" y el mercado de los domingos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Torremanzanas_Alicante.jpg/1200px-Torremanzanas_Alicante.jpg', 692, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg/166px-Escut_de_la_Torre_de_les_Ma%C3%A7anes.svg.png'),
(102, 'Xixona', 'Bressol del torró. Ciudad dulce y puerta de la montaña.', 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Vistas_de_Jijona.jpg', 6865, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Escut_de_Xixona.svg/170px-Escut_de_Xixona.svg.png'),
(103, 'Penàguila', 'Tierra de mitos y leyendas, a los pies de la Serra de Aitana. Famosa por el "Jardín de Santos".', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Pen%C3%A0guila_view.jpg/1200px-Pen%C3%A0guila_view.jpg', 269, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Escut_de_Pen%C3%A0guila.svg/167px-Escut_de_Pen%C3%A0guila.svg.png'),
(104, 'Benifallim', 'Pequeño tesoro escondido entre montañas. Tranquilidad absoluta.', 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Benifallim.jpg', 130, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Escut_de_Benifallim.svg/159px-Escut_de_Benifallim.svg.png'),
(105, 'Alcoi', 'Ciudad de los puentes y capital industrial. Moros y Cristianos de Interés Turístico Internacional.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Alcoi_pont_de_Sant_Jordi.jpg/1200px-Alcoi_pont_de_Sant_Jordi.jpg', 58960, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Escut_d%27Alcoi.svg/167px-Escut_d%27Alcoi.svg.png'),
(106, 'Relleu', 'Pueblo de tradiciones y senderos, famoso por su pasarela sobre el pantano.', 'https://multimedia.comunitatvalenciana.com/web/render/multimedia/10706/relleu_pantano_pasarela.jpg', 1195, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Escut_de_Relleu.svg/166px-Escut_de_Relleu.svg.png')
ON CONFLICT (id) DO UPDATE SET 
image_url = EXCLUDED.image_url, 
population = EXCLUDED.population, 
logo_url = EXCLUDED.logo_url;

-- 3. INSERTAR POSTS
INSERT INTO posts (id, author, avatar_type, content, image_url, connections_count, created_at, author_id) VALUES
(201, 'Ajuntament Torremanzanas', 'gov', '📢 AVISO: Ya está disponible el Bono Consumo Nadal. Pasa por el Ayuntamiento a recoger tus vales para comprar en el comercio local. #FemPoble', 'https://torremanzanas.es/wp-content/uploads/2024/10/bonos-consumo-navidad-2024.jpg', 45, NOW() - INTERVAL '2 hours', 'admin-id'),
(202, 'Bar El Chato', 'shop', '👨‍🍳 Avui tenim Olleta de Blat! Reserveu taula que s''acaba ràpid. Bon profit a tots!', 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Olleta_de_blat.jpg', 23, NOW() - INTERVAL '5 hours', 'shop-id'),
(203, 'Associació Amics de la Serra', 'group', '📸 Excursió d''aquest mati pel camí vell de Xixona. La nostra terra és espectacular. Gràcies a tots els que heu vingut!', 'https://es.wikiloc.com/wikiloc/imgServer.do?id=1285227&var=images&i=0', 89, NOW() - INTERVAL '1 day', 'group-id'),
(204, 'Forn de Pa La Plaça', 'shop', '🥖 Coques acabades de fer! De pèsols, de tomaca i ceba... o la clàssica de molletes. Veniu abans que volen!', NULL, 12, NOW() - INTERVAL '4 hours', 'bakery-id'),
(205, 'Ajuntament Xixona', 'gov', '🎄 Es preparen els llums de Nadal. Aquest any Xixona brillarà més que mai. Us esperem a la Fira de Nadal!', 'https://jijonaturismo.com/wp-content/uploads/2019/11/Fira-de-Nadal-de-Xixona.jpg', 156, NOW() - INTERVAL '2 days', 'xixona-id')
ON CONFLICT (id) DO UPDATE SET
content = EXCLUDED.content,
image_url = EXCLUDED.image_url;

-- 4. INSERTAR MERCADO
INSERT INTO market_items (id, title, price, seller, image_url, tag, created_at) VALUES
(301, 'Garrafes d''Oli Verge Extra (Cooperativa)', '35€', 'Cooperativa Agrícola', 'https://m.media-amazon.com/images/I/71N-d+lq3IL._AC_UF1000,1000_QL80_.jpg', 'Alimentació', NOW()),
(302, 'Llenya d''ametler seca', '120€/t', 'Paco "El Serra"', 'https://mcdn.wallapop.com/images/10420/gb/u6/__/c10420p932733912/i3275069480.jpg?pictureSize=W640', 'Llar', NOW() - INTERVAL '1 day'),
(303, 'Muebles rústicos restaurados', '150€', 'Casa Rural El Moral (Liquidació)', 'https://mcdn.wallapop.com/images/10420/er/8s/__/c10420p895742416/i3089735412.jpg?pictureSize=W640', 'Mobles', NOW() - INTERVAL '3 days'),
(304, 'Mel de romer artesana', '10€', 'Abelles de la Torre', 'https://m.media-amazon.com/images/I/71yv4+jR1bL._AC_UF894,1000_QL80_.jpg', 'Alimentació', NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO UPDATE SET
title = EXCLUDED.title,
price = EXCLUDED.price;

-- 5. CHAT SIMULADO
INSERT INTO chats (id, name, last_message, time, unread_count, type) VALUES
(401, 'Vicent (Alcalde)', 'Hola Javi! Benvingut a l''app. Si tens cap dubte passa''t per l''Ajuntament.', '10:30', 1, 'user'),
(402, 'Grup Senderisme', 'Aquest diumenge pugem al Rentonar? ⛰️', 'Ahir', 3, 'group'),
(403, 'Forn la Plaça', 'Tinc les coques que vas encarregar.', 'Dilluns', 0, 'shop')
ON CONFLICT (id) DO UPDATE SET
last_message = EXCLUDED.last_message;
