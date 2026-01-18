-- Tabla para Favoritos del Mercado
CREATE TABLE IF NOT EXISTS market_favorites (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES market_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, user_id)
);

-- Habilitar RLS
ALTER TABLE market_favorites ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver todos los favoritos
CREATE POLICY "Public market_favorites are viewable by everyone" ON market_favorites
  FOR SELECT USING (true);

-- Política: Los usuarios solo pueden insertar sus propios favoritos
CREATE POLICY "Users can insert their own favorites" ON market_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propios favoritos
CREATE POLICY "Users can delete their own favorites" ON market_favorites
  FOR DELETE USING (auth.uid() = user_id);
