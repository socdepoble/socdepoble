-- Tabla para los Likes de los Posts
CREATE TABLE IF NOT EXISTS post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- Habilitar RLS
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver todos los likes
CREATE POLICY "Public post_likes are viewable by everyone" ON post_likes
  FOR SELECT USING (true);

-- Política: Los usuarios solo pueden insertar sus propios likes
CREATE POLICY "Users can insert their own likes" ON post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propios likes
CREATE POLICY "Users can delete their own likes" ON post_likes
  FOR DELETE USING (auth.uid() = user_id);
