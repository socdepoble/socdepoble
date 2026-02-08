-- Phase 12: National Territorial Injection & L'Alacantí Restoration
-- [MASTER_INJECTION] Universal Coverage for Sóc de Poble

-- 1. Restore L'Alacantí Core
INSERT INTO public.towns (name, province, comarca, population, description)
VALUES 
('Alacant', 'Alacant', 'L''Alacantí', 337000, 'Capital de la província i cor de L''Alacantí.'),
('Sant Vicent del Raspeig', 'Alacant', 'L''Alacantí', 59000, 'Ciutat universitària i motor dinàmic de la comarca.'),
('Mutxamel', 'Alacant', 'L''Alacantí', 25000, 'Poble de tradició agrícola i flors bategant.'),
('El Campello', 'Alacant', 'L''Alacantí', 29000, 'Port de pescadors i platges de la comarca.'),
('Sant Joan d''Alacant', 'Alacant', 'L''Alacantí', 24000, 'El centre sanitari i de servicis de L''Alacantí.'),
('Xixona', 'Alacant', 'L''Alacantí', 7000, 'Bressol del turró i guardiana del Carrasquet.'),
('Agost', 'Alacant', 'L''Alacantí', 4700, 'Terra de terrissers i tradició mil·lenària.')
ON CONFLICT (name, province) DO UPDATE 
SET comarca = EXCLUDED.comarca, 
    population = EXCLUDED.population;

-- 2. Inject Spanish Capitals (Universal Reach)
INSERT INTO public.towns (name, province, comarca, population, description)
VALUES 
('Madrid', 'Madrid', 'Área Metropolitana de Madrid', 3300000, 'Capital de España y centro neurálgico del país.'),
('Barcelona', 'Barcelona', 'Barcelonès', 1600000, 'Capital de Catalunya y motor cultural del Mediterráneo.'),
('València', 'València', 'València', 800000, 'Capital del Túria y centro de la Horta de València.'),
('Sevilla', 'Sevilla', 'Metropolitana de Sevilla', 680000, 'Capital de Andalucía y corazón del Guadalquivir.'),
('Zaragoza', 'Zaragoza', 'Zaragoza', 670000, 'Ciudad del Ebro y tesoro monumental de Aragón.'),
('Málaga', 'Málaga', 'Málaga-Costa del Sol', 580000, 'Faro del sur y capital de la Costa del Sol.'),
('Murcia', 'Murcia', 'Huerta de Murcia', 460000, 'Capital de la huerta segureña y tierra de contrastes.'),
('Palma', 'Illes Balears', 'Palma', 420000, 'Capital de las Baleares y joya insular.'),
('Las Palmas de Gran Canaria', 'Las Palmas', 'Gran Canaria', 380000, 'Metrópolis canaria abierta al Atlántico.'),
('Bilbao', 'Bizkaia', 'Gran Bilbao', 345000, 'Transformación industrial y arte contemporáneo vasco.'),
('A Coruña', 'A Coruña', 'A Coruña', 245000, 'Ciudad de cristal y balcón del Atlántico gallego.'),
('Vitoria-Gasteiz', 'Araba', 'Vitoria-Gasteiz', 255000, 'Anillo verde y capital de Euskadi.'),
('Granada', 'Granada', 'Vega de Granada', 230000, 'Bajo el cielo de la Alhambra y Sierra Nevada.'),
('Santa Cruz de Tenerife', 'Santa Cruz de Tenerife', 'Área Metropolitana', 205000, 'Carnaval y puerto histórico canario.')
ON CONFLICT (name, province) DO UPDATE 
SET population = EXCLUDED.population;

-- 3. Ensure L'Alacoia is fresh 
UPDATE public.towns 
SET comarca = 'L''Alcoià' 
WHERE name IN ('Ibi', 'Alcoi', 'Banyeres de Mariola', 'Cocentaina', 'Muro d''Alcoi');
